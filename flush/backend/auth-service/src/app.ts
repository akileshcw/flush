import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler";
import { connectToRabbitMQ } from "./config/rabbitmq";
import { toNodeHandler } from "better-auth/node";
import auth from "./auth";
import bodyParser from "body-parser";

import { AppDataSource } from "./config/database";
// import { AuthService } from "./services/authService";
// import { AuthController } from "./controllers/authController";
// import { authRoutes } from "./routes/authRoutes";

async function startServer() {
  try {
    const app = express();
    dotenv.config();

    app.use(
      cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
      })
    );

    // Initialize Database
    // Connect to RabbitMQ
    await AppDataSource.initialize();
    console.log("Database connected");
    const channel = await connectToRabbitMQ();
    if (!channel) {
      console.error("Failed to connect to RabbitMQ. Exiting.");
      process.exit(1);
    }
    console.log("Connected to RabbitMQ");

    // Instantiate the service, passing the Prisma client
    // const authService = new AuthService(channel, prisma); // Pass the prisma client here
    // const authController = new AuthController(authService);
    // const routes = authRoutes(authController);

    // Log incoming requests (optional, for debugging)
    app.all(
      "/*splat",
      (req, res, next) => {
        console.log("Request received:", req.method, req.url, req.body);
        next();
      },
      toNodeHandler(auth(channel)) // Use the defined auth routes
    );

    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: true }));

    // Global error handler middleware
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000; // Use environment variable for port
    app.listen(PORT, () => {
      console.log(`Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting auth service:", error);
    process.exit(1);
  }
}

// Gracefully disconnect Prisma Client when the application exits
process.on("beforeExit", async () => {
  console.log("Disconnecting Prisma Client...");
  console.log("Prisma Client disconnected.");
});

// Start the server
startServer();
