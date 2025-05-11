import { DataSource } from "typeorm";
import { User } from "../models/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "your_username",
  password: "your_password",
  database: "auth_db",
  entities: [User],
  synchronize: true, // Set to false in production
});
