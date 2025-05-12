import { Router } from "express";
import { PatientController } from "../controllers/patientController";
import { authenticateToken, authorizeRole } from "../utils/authMiddleware";

export function patientRoutes(controller: PatientController): Router {
  const router = Router();
  router.post(
    "/",
    authenticateToken,
    authorizeRole(["admin", "staff"]),
    controller.createPatient
  );
  router.get(
    "/",
    authenticateToken,
    authorizeRole(["admin", "staff", "doctor"]),
    controller.getAllPatients
  );
  router.get(
    "/:id",
    authenticateToken,
    authorizeRole(["admin", "staff", "doctor", "patient"]),
    controller.getPatientById
  );
  router.get(
    "/phone/:phone",
    authenticateToken,
    authorizeRole(["admin", "staff", "doctor"]),
    controller.getPatientByPhone
  );
  router.put(
    "/:id",
    authenticateToken,
    authorizeRole(["admin", "staff"]),
    controller.updatePatient
  );
  router.delete(
    "/:id",
    authenticateToken,
    authorizeRole(["admin"]),
    controller.deletePatient
  );
  return router;
}
