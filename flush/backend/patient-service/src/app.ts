import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/database";
import { connectRabbitMQ, connectToRabbitMQ } from "./config/rabbitmq";
import { PatientService } from "./services/patientService";
import { PatientController } from "./controllers/patientController";
import { patientRoutes } from "./routes/patientRoutes";
import { errorHandler } from "./utils/errorHandler";
import dotenv from "dotenv";

async function startServer() {
  try {
    const app = express();
    dotenv.config();
    app.use(bodyParser.json());

    await AppDataSource.initialize();
    const channel = await connectToRabbitMQ();

    const patientService = new PatientService(channel!);
    const patientController = new PatientController(patientService);

    app.use("/", patientRoutes(patientController));
    app.use(errorHandler);

    app.listen(3001, () => {
      console.log("Patient Service running on port 3001");
    });
  } catch (error) {
    console.error("Error starting patient service:", error);
    process.exit(1);
  }
}

startServer().catch(console.error);
