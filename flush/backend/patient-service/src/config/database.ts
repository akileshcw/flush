import { DataSource } from "typeorm";
import { Patient } from "../models/patient";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "your_username",
  password: "your_password",
  database: "patient_db",
  entities: [Patient],
  synchronize: true, // Set to false in production
});
