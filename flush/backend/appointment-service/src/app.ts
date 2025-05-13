// app.ts
import express from "express";
import { AppDataSource } from "./config/database";
import { AppointmentService } from "./services/appointmentService";
import { AppointmentController } from "./controllers/appointmentController";
import { appointmentRoutes } from "./routes/appointmentRoutes";
import { connectRabbitMQ, connectToRabbitMQ } from "./config/rabbitmq";

const startServer = async () => {
  try {
    const app = express();
    app.use(express.json());
    // const channel = await connectRabbitMQ();
    const channel = await connectToRabbitMQ();
    await AppDataSource.initialize();
    console.log("Database connected");
    const appointmentService = new AppointmentService(channel!);
    const appointmentController = new AppointmentController(appointmentService);
    app.use("/", appointmentRoutes(appointmentController));
    app.listen(3002, () =>
      console.log("Appointment service running on port 3002")
    );
  } catch (error) {
    console.error("Error starting appointment service:", error);
    process.exit(1);
  }
};

startServer();
