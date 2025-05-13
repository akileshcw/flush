import { Router } from "express";
import { NotificationController } from "../controllers/notificationController";

export function notificationRoutes(controller: NotificationController): Router {
  const router = Router();
  router.post(
    "/send-notification",
    controller.sendNotification.bind(controller)
  );
  router.get("/notifications", controller.getNotifications.bind(controller));
  return router;
}
