import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/database";
import { connectToRabbitMQ } from "./config/rabbitmq";
import { NotificationService } from "./services/notificationService";
import { NotificationController } from "./controller/notificationController";
import { notificationRoutes } from "./routes/notificationRoutes";
import { errorHandler } from "./utils/errorHandler";

async function startServer() {
  try {
    const app = express();
    app.use(bodyParser.json());

    const channel = await connectToRabbitMQ();
    await AppDataSource.initialize();
    console.log("Database connected");

    const notificationService = new NotificationService(channel!);
    const notificationController = new NotificationController(
      notificationService
    );
    app.use("/", notificationRoutes(notificationController));

    app.use(errorHandler);
    app.listen(3005, () => {
      console.log("Notification Service running on port 3005");
    });
  } catch (error) {
    console.error("Error starting notification service:", error);
    process.exit(1);
  }
}

startServer();
