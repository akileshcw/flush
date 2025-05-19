import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/database";
import { AuthService } from "./services/authService";
import { AuthController } from "./controllers/authController";
import { authRoutes } from "./routes/authRoutes";
import { errorHandler } from "./utils/errorHandler";
import { connectToRabbitMQ } from "./config/rabbitmq";
import dotenv from "dotenv";
import cors from "cors";

async function startServer() {
  try {
    const app = express();
    dotenv.config();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const channel = await connectToRabbitMQ();
    await AppDataSource.initialize();
    console.log("Database connected");

    //Instantiate the service
    const authService = new AuthService(channel!);
    const authController = new AuthController(authService);
    const routes = authRoutes(authController);

    app.use(
      "/",
      (req, res, next) => {
        console.log("Request received:", req.url, req.body);
        next();
      },
      routes
    );

    app.use(errorHandler);

    app.listen(3000, () => {
      console.log("Auth Service running on port 3000");
    });
  } catch (error) {
    console.error("Error starting auth service:", error);
    process.exit(1);
  }
}

startServer();
