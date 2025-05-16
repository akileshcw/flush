import admin from "firebase-admin";
import { Channel } from "amqplib";

export class FCMSender {
  private fcmApp: admin.app.App;
  private analyticsChannel: Channel;

  constructor(serviceAccountKey: object, analyticsChannel: Channel) {
    if (!admin.apps.length) {
      this.fcmApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
      });
    } else {
      this.fcmApp = admin.app();
    }
    this.analyticsChannel = analyticsChannel;
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: object
  ): Promise<void> {
    const message = data
      ? {
          ...data,
          token,
        }
      : {
          notification: { title, body },
          token,
        };

    try {
      await this.fcmApp.messaging().send(message);
      console.log("Push notification sent successfully");
      this.publishAnalyticsEvent(
        "notification.events.fanout",
        "notification.fcm.sent",
        { token, title }
      );
    } catch (error) {
      console.error("Error sending push notification:", error);
      throw error;
    }
  }

  private publishAnalyticsEvent(queue: string, event: string, data: any): void {
    const message = JSON.stringify({ event, data });
    this.analyticsChannel.publish(queue, "", Buffer.from(message));
  }
}
