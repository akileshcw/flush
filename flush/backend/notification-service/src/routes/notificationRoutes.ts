import { Router } from "express";
import { NotificationController } from "../controller/notificationController";

export function notificationRoutes(controller: NotificationController): Router {
  const router = Router();
  router.post("/send-notification", controller.sendNotification);
  return router;
}
