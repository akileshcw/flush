import axios from "axios";
import { Channel } from "amqplib";

export class WhatsAppSender {
  private whatsappToken: string;
  private phoneNumberId: string;
  private apiUrl: string;
  private channel: Channel;

  constructor(channel: Channel) {
    this.whatsappToken = process.env.WHATSAPP_TOKEN || "";
    this.phoneNumberId = process.env.PHONE_NUMBER_ID || "";
    this.apiUrl = `https://graph.facebook.com/v22.0/${this.phoneNumberId}/messages`;
    this.channel = channel;
  }

  private publishEvent = async (queue: string, event: string, data: any) => {
    const message = JSON.stringify({ event, data });
    this.channel.publish(queue, "", Buffer.from(message), { persistent: true });
    console.log(
      `published the event ${event} to ${queue} and the message is ${message}`
    );
  };

  async sendMessage({
    receiverNumber,
    templateName,
    templateCategory = "marketing",
    templateComponents,
    messages,
  }: {
    receiverNumber: string;
    templateName: string;
    templateCategory?: string;
    templateComponents: object[];
    messages: string;
  }): Promise<void> {
    if (templateName) {
      if (!templateCategory)
        return this.sendTemplateMessage({
          receiverNumber,
          templateName,
          templateCategory,
          templateComponents,
        });
    } else {
      return this.sendTextMessage({
        receiverNumber,
        messages,
      });
    }
  }

  private async sendWhatsappMessage(body: any) {
    try {
      const data = await axios.post(this.apiUrl, body, {
        headers: {
          Authorization: `Bearer ${this.whatsappToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("WhatsApp message sent successfully");
      this.publishEvent(
        "notification.events.fanout",
        "notificatinn.whatsapp.template.send",
        data
      );
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      throw error;
    }
  }

  private async sendTemplateMessage({
    receiverNumber,
    templateName,
    templateCategory,
    templateComponents,
  }: {
    receiverNumber: string;
    templateName: string;
    templateCategory: string;
    templateComponents: object[];
  }) {
    const messageBody = {
      messaging_product: "whatsapp",
      to: receiverNumber,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en-US" },
        components: templateComponents,
      },
      category: templateCategory,
    };
    this.sendWhatsappMessage(messageBody);
  }

  private async sendTextMessage({
    receiverNumber,
    messages,
  }: {
    receiverNumber: string;
    messages: string;
  }) {
    const messageBodyData = {
      messaging_product: "whatsapp",
      to: receiverNumber,
      type: "text",
      text: {
        body: messages,
      },
    };
    const messageBody = JSON.stringify(messageBodyData);

    this.sendWhatsappMessage(messageBody);
  }
}
