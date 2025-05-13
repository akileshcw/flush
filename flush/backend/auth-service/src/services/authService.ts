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

  async register(
    username: string,
    password: string,
    roles: string[]
  ): Promise<User> {
    const password_hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password_hash, roles });
    await this.userRepository.save(user);
    this.publishEvent("user.registered", {
      id: user.id,
      username,
    });
    return user;
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ username });
    console.log("the username in auth service is", user);
    if (!user) throw new Error("User not found");
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new Error("Invalid password");
    const token = jwt.sign(
      { id: user.id, groups: user.roles, iss: "auth-service", expiresIn: "1h" },
      this.jwtSecret,
      {
        expiresIn: "1h",
      }
    );
    this.publishEvent("user.logged_in", { id: user.id, username });
    return token;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  private publishEvent(event: string, data: any) {
    const message = JSON.stringify({ event, data });
    this.channel.sendToQueue("auth.events", Buffer.from(message));
    console.log(`Event published: ${event}`, data);
  }
  verifyToken(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }
}
