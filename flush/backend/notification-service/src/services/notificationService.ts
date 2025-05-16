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

  private publishEvent(event: string, queue: string, data: any) {
    const message = JSON.stringify({ event, data });
    this.channel.publish(queue, "", Buffer.from(message));
    console.log(`Event published: ${event}`, data);
  }

  createNotification = async (
    receiverId: number,
    message: string,
    type: string
  ): Promise<Notification> => {
    const notification = this.notificationRepository.create({
      userId: receiverId,
      message,
      type,
    });
    await this.notificationRepository.save(notification);
    return notification;
  };

  sendNotification = async ({
    receiverId,
    message,
    type,
  }: {
    receiverId: number;
    message: string;
    type: string;
  }): Promise<Notification> => {
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

  //Event handler when a message is received from other service
  async handleEvent(event: string, data: any) {
    switch (event) {
      case "user.registered":
        if (data.roles.includes("admin") || data.roles.include("doctors")) {
          const dataFromAuth = {
            receiverId: data.username,
            message: "dental",
            type: "123456789",
          };
          const notification = this.sendNotification(dataFromAuth);
          this.publishEvent(
            "doctor.created",
            "doctor.events.fanout",
            notification
          );
        }
        break;

      default:
        console.log("No matching action to excute based on the received event");
    }
  }
}
