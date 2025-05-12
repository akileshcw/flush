import { DataSource } from "typeorm";
import { Patient } from "../models/patient";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "patient-db",
  port: 5432,
  username: "patient_user",
  password: "patient_pass",
  database: "patient_db",
  entities: [Patient],
  synchronize: true, // Set to false in production
});
