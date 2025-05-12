import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/database";
import { connectRabbitMQ } from "./config/rabbitmq";
import { PatientService } from "./services/patientService";
import { PatientController } from "./controllers/patientController";
import { patientRoutes } from "./routes/patientRoutes";
import { errorHandler } from "./utils/errorHandler";
import dotenv from "dotenv";

async function startServer() {
  const app = express();
  dotenv.config();
  app.use(bodyParser.json());

  await AppDataSource.initialize();
  const channel = await connectRabbitMQ();

  const patientService = new PatientService(channel);
  const patientController = new PatientController(patientService);

  app.use("/", patientRoutes(patientController));
  app.use(errorHandler);

  app.listen(3001, () => {
    console.log("Patient Service running on port 3001");
  });
}

startServer().catch(console.error);
