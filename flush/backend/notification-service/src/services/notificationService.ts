import { Repository } from "typeorm";
import { Notification } from "../models/notification";
import { AppDataSource } from "../config/database";
import { Channel } from "amqplib";

export class NotificationService {
  private notificationRepository: Repository<Notification>;
  private channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;
    this.notificationRepository = AppDataSource.getRepository(Notification);
  }

  createNotification = async (
    receiverId: number,
    message: string,
    type: string
  ): Promise<Notification> => {
    const notification = this.notificationRepository.create({
      receiverId,
      message,
      type,
    });
    await this.notificationRepository.save(notification);
    return notification;
  };
  sendNotification = async (
    receiverId: number,
    message: string,
    type: string
  ): Promise<Notification> => {
    const notification = await this.createNotification(
      receiverId,
      message,
      type
    );
    this.publishEvent("notification.created", "notification.events", {
      id: notification.id,
      receiverId,
      message,
      type,
    });
    return notification;
  };

  async publishEvent(event: string, queue: string, data: any) {
    const message = JSON.stringify({ event, data });
    this.channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Event published: ${event}`, data);
  }
}
