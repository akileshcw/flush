import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/database";
import { AuthService } from "./services/authService";
import { AuthController } from "./controllers/authController";
import { authRoutes } from "./routes/authRoutes";
import { errorHandler } from "./utils/errorHandler";
import { connectToRabbitMQ } from "./config/rabbitmq";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import cors from "cors";

async function startServer() {
  try {
    const app = express();
    dotenv.config();

    const channel = await connectToRabbitMQ();
    await AppDataSource.initialize();
    console.log("Database connected");

    //Instantiate the service
    // const authService = new AuthService(channel!);
    // const authController = new AuthController(authService);

    app.use(
      cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
      })
    );
    app.all(
      "/*splat",
      (req, res, next) => {
        console.log("request received. the route is", req.url);
        next();
      },
      toNodeHandler(auth)
    );
    app.use(errorHandler);

    app.use(bodyParser.json());
    app.listen(3000, () => {
      console.log("Auth Service running on port 3000");
    });
  } catch (error) {
    console.error("Error starting auth service:", error);
    process.exit(1);
  }
}

startServer();
