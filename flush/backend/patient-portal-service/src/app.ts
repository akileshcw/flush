import express from "express";
import { PatientPortalService } from "./services/patientPortalService";
import { PatientPortalController } from "./controllers/patientPortalController";
import { errorHandler } from "./utils/errorHandler";
import { patientPortalRoutes } from "./routes/patientPortalRoutes";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectRabbitMQ } from "./config/rabbitmq";

async function startServer() {
  const app = express();
  dotenv.config();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const channel = await connectRabbitMQ();
  const patientPortalService = new PatientPortalService(channel);
  const patientPortalController = new PatientPortalController(
    patientPortalService
  );
  app.use(errorHandler);
  app.use("/", patientPortalRoutes(patientPortalController));

  app.listen(3001, () =>
    console.log("Patient Portal Service running on port 3001")
  );
}

startServer().catch(console.error);
