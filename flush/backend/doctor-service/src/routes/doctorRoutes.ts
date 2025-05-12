import { Router } from "express";
import { DoctorController } from "../controllers/doctorController";

export function doctorRoutes(controller: DoctorController): Router {
  const router = Router();
  router.post("/", controller.createDoctor.bind(controller));
  router.get("/:id", controller.getDoctorById.bind(controller));
  return router;
}
