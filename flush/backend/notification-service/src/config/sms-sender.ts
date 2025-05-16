import twilio from "twilio";
import { Channel } from "amqplib";

export class SMSSender {
  private client: twilio.Twilio;
  private analyticsChannel: Channel;

  constructor(
    accountSid: string,
    authToken: string,
    analyticsChannel: Channel
  ) {
    this.client = twilio(accountSid, authToken);
    this.analyticsChannel = analyticsChannel;
  }

  async sendSMS(to: string, from: string, body: string): Promise<void> {
    try {
      await this.client.messages.create({ to, from, body });
      console.log("SMS sent successfully");
      this.publishAnalyticsEvent("notification.events.fanout", "sms_sent", {
        to,
        body,
      });
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error;
    }
  }

  private publishAnalyticsEvent(queue: string, event: string, data: any): void {
    const message = JSON.stringify({ event, data });
    this.analyticsChannel.publish(queue, "", Buffer.from(message));
  }
}
