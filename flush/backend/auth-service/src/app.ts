import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/database";
import { AuthService } from "./services/authService";
import { AuthController } from "./controllers/authController";
import { authRoutes } from "./routes/authRoutes";
import { errorHandler } from "./utils/errorHandler";
import { connectRabbitMQ } from "./config/rabbitmq";

async function startServer() {
  const app = express();
  app.use(bodyParser.json());

  await AppDataSource.initialize();
  const channel = await connectRabbitMQ();

  const authService = new AuthService(channel);
  const authController = new AuthController(authService);

  app.use("/", authRoutes(authController));
  app.use(errorHandler);

  app.listen(3000, () => {
    console.log("Auth Service running on port 3000");
  });
}

startServer().catch(console.error);
