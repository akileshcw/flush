import { Repository } from "typeorm";
import { User } from "../models/user";
import { AppDataSource } from "../config/database";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Channel } from "amqplib";

export class AuthService {
  private userRepository: Repository<User>;
  private channel: Channel;
  private jwtSecret: string = "your_jwt_secret"; // Use environment variable in production

  constructor(channel: Channel) {
    this.channel = channel;
    this.userRepository = AppDataSource.getRepository(User);
  }

  private publishEvent(event: string, data: any) {
    const message = JSON.stringify({ event, data });
    this.channel.publish("auth.events.fanout", "", Buffer.from(message), {
      persistent: true,
    });
    console.log(`Event published: ${event}`, data);
  }

  async register(
    username: string,
    password: string,
    roles: string[]
  ): Promise<User> {
    const password_hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: password_hash,
      roles,
    });
    await this.userRepository.save(user);
    const token = jwt.sign(
      { id: user.id, groups: user.roles, iss: "auth-service", expiresIn: "1h" },
      this.jwtSecret,
      { expiresIn: "1h" }
    );
    this.publishEvent("user.registered", {
      id: user.id,
      username,
      roles,
      token,
    });
    const newUser = { ...user, token: token };
    return newUser;
  }

  async login(
    username: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    let user = await this.userRepository.findOneBy({ username });
    console.log("the user found using findone", user);
    if (!user) {
      user = await this.register(username, password, ["user"]);
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid password");
    console.log("the user roles is", user.roles);
    const token = jwt.sign(
      { id: user.id, groups: user.roles, iss: "auth-service", expiresIn: "1h" },
      this.jwtSecret,
      {
        expiresIn: "1h",
      }
    );
    console.log("the token contains the group", jwt.decode(token));
    this.publishEvent("user.logged_in", { id: user.id, username });
    console.log("the object returned is", { user, token });
    return { user, token };
  }

  async logout(token: string): Promise<void> {
    const decoded = jwt.verify(token, this.jwtSecret);
    if (!decoded) throw new Error("Invalid token");
    this.publishEvent("user.logged_out", { id: decoded });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }
}
