// routes/appointmentRoutes.ts
import { Router } from "express";
import { AppointmentController } from "../controllers/appointmentController";

export function appointmentRoutes(controller: AppointmentController): Router {
  const router = Router();
  router.post("/", controller.createAppointment);
  router.get("/", controller.getAppointments);
  router.get("/:id", controller.getAppointmentById);
  router.put("/:id", controller.updateAppointment);
  router.delete("/:id", controller.cancelAppointment);
  return router;
}
