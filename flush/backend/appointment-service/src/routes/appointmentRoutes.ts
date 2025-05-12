// routes/appointmentRoutes.ts
import { Router } from "express";
import { AppointmentController } from "../controllers/appointmentController";

export function appointmentRoutes(controller: AppointmentController): Router {
  const router = Router();
  router.post("/", controller.createAppointment.bind(controller));
  router.get("/", controller.getAppointments.bind(controller));
  router.get("/:id", controller.getAppointmentById.bind(controller));
  router.put("/:id", controller.updateAppointment.bind(controller));
  router.delete("/:id", controller.cancelAppointment.bind(controller));
  return router;
}
