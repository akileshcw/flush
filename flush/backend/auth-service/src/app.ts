import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/database";
import { AuthService } from "./services/authService";
import { AuthController } from "./controllers/authController";
import { authRoutes } from "./routes/authRoutes";
import { errorHandler } from "./utils/errorHandler";

async function startServer() {
  const app = express();
  app.use(bodyParser.json());

  await AppDataSource.initialize();

  const authService = new AuthService();
  const authController = new AuthController(authService);

  app.use("/auth", authRoutes(authController));
  app.use(errorHandler);

  app.listen(3000, () => {
    console.log("Auth Service running on port 3000");
  });
}

startServer().catch(console.error);
