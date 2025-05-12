// config/database.ts
import { DataSource } from "typeorm";
import { Appointment } from "../models/appointment";

export const AppDataSource = new DataSource({
  type: "postgres", // Adjust based on your DB
  host: "appointment-db", // Use the service name defined in docker-compose
  port: 5432,
  username: "appointment_user",
  password: "appointment_pass",
  database: "appointment_db",
  entities: [Appointment],
  synchronize: true, // Set to false in production
});
