import { Repository } from "typeorm";
import { User } from "../models/user";
import { AppDataSource } from "../config/database";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class AuthService {
  private userRepository: Repository<User>;
  private jwtSecret: string = "your_jwt_secret"; // Use environment variable in production

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(
    username: string,
    password: string,
    role: string
  ): Promise<User> {
    const password_hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password_hash, role });
    await this.userRepository.save(user);
    return user;
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) throw new Error("User not found");
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new Error("Invalid password");
    const token = jwt.sign({ id: user.id, role: user.role }, this.jwtSecret, {
      expiresIn: "1h",
    });
    return token;
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }
}
