import { DataSource } from "typeorm";
import { Doctor } from "../models/doctor";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "doctor-db",
  port: 5432,
  username: "doctor_user",
  password: "doctor_pass",
  database: "doctor_db",
  entities: [Doctor],
  synchronize: true, // Set to false in production
});
