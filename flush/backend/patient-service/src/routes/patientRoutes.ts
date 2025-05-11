import { Router } from "express";
import { PatientController } from "../controllers/patientController";
import { authenticateToken, authorizeRole } from "../utils/authMiddleware";

export function patientRoutes(controller: PatientController): Router {
  const router = Router();
  router.post(
    "/",
    authenticateToken,
    authorizeRole(["admin", "staff"]),
    controller.createPatient.bind(controller)
  );
  router.get(
    "/",
    authenticateToken,
    authorizeRole(["admin", "staff", "doctor"]),
    controller.getAllPatients.bind(controller)
  );
  router.get(
    "/:id",
    authenticateToken,
    authorizeRole(["admin", "staff", "doctor", "patient"]),
    controller.getPatientById.bind(controller)
  );
  router.get(
    "/phone/:phone",
    authenticateToken,
    authorizeRole(["admin", "staff", "doctor"]),
    controller.getPatientByPhone.bind(controller)
  );
  router.put(
    "/:id",
    authenticateToken,
    authorizeRole(["admin", "staff"]),
    controller.updatePatient.bind(controller)
  );
  router.delete(
    "/:id",
    authenticateToken,
    authorizeRole(["admin"]),
    controller.deletePatient.bind(controller)
  );
  return router;
}
