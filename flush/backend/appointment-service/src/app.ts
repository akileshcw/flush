// app.ts
import express from "express";
import { AppDataSource } from "./config/database";
import { AppointmentService } from "./services/appointmentService";
import { AppointmentController } from "./controllers/appointmentController";
import { appointmentRoutes } from "./routes/appointmentRoutes";

const app = express();
app.use(express.json());

(async () => {
  await AppDataSource.initialize();
  console.log("Database connected");

  const appointmentService = new AppointmentService();
  const appointmentController = new AppointmentController(appointmentService);
  app.use("/appointments", appointmentRoutes(appointmentController));

  app.listen(3002, () =>
    console.log("Appointment service running on port 3002")
  );
})();
