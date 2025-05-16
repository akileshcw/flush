import { DataSource } from "typeorm";
import { Account, Session, User, Verification } from "../models/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "auth-db",
  port: 5432,
  username: "auth_user",
  password: "auth_pass",
  database: "auth_db",
  entities: [User, Session, Account, Verification],
  synchronize: true, // Set to false in production
});
