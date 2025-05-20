import { DataSource } from "typeorm";
import { Account, Jwks, Session, User, Verification } from "../models/user";

export const AppDataSource = new DataSource({
  type: "postgres", // or "mysql", "sqlite", etc. depending on your DB
  username: "auth_user",
  password: "auth_pass",
  database: "auth_db",
  host: "auth-db",
  entities: [User, Session, Account, Verification, Jwks],
  synchronize: true, // Set to false in production
});
