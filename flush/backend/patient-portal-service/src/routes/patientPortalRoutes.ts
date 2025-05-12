import { Router } from "express";
import { PatientPortalController } from "../controllers/patientPortalController";

export function patientPortalRoutes(
  controller: PatientPortalController
): Router {
  const router = Router();
  router.get("/profile/:id", controller.getPatientProfile.bind(controller));
  router.get(
    "/appointments/:id",
    controller.getPatientAppointments.bind(controller)
  );
  return router;
}
