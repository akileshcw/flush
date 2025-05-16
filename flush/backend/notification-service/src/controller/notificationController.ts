import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notificationService";

export class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async sendNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, message, type } = req.body;
      const notification = await this.notificationService.sendNotification({
        receiverId: userId,
        message,
        type,
      });
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  }
}
