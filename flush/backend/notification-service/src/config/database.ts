import { DataSource } from "typeorm";
import { Notification } from "../models/notification";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "notification-db",
  port: 5432,
  username: "notification_user",
  password: "notification_pass",
  database: "notification_db",
  entities: [Notification],
  synchronize: true, // Set to false in production
  logging: false,
});
