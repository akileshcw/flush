import express from "express";
import { errorHandler } from "./utils/errorHandler";
import { doctorRoutes } from "./routes/doctorRoutes";
import { DoctorService } from "./services/doctorService";
import { DoctorController } from "./controllers/doctorController";
// Assume RabbitMQ channel is initialized in rabbitmq.ts
import { connectToRabbitMQ } from "./config/rabbitmq";

const startServer = async () => {
  try {
    const app = express();
    app.use(express.json());

    const channel = await connectToRabbitMQ();

    const doctorService = new DoctorService(channel!);
    const doctorController = new DoctorController(doctorService);

    app.use("/", doctorRoutes(doctorController));
    app.use(errorHandler);

    app.listen(3000, () => console.log("Doctor Service running on port 3000"));
  } catch (error) {
    console.error("Error starting doctor service:", error);
    process.exit(1);
  }
};

startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
