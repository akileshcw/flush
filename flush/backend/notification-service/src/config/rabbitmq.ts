import amqp, { Channel } from "amqplib";
import { NotificationService } from "../services/notificationService";

export async function connectToRabbitMQ() {
  const rabbitmqUrl = "amqp://guest:guest@rabbitmq:5672";
  let connection;
  let channel;
  const maxRetries = 5;
  const retryDelay = 5000;
  let retries = 0;

  while (!connection && retries < maxRetries) {
    try {
      connection = await amqp.connect(rabbitmqUrl);
      if (!connection) throw new Error("No connection");
      channel = await connection.createChannel();
      if (!channel) throw new Error("No channel created");
      // consumeEvents("auth.events.fanout", channel);
      // consumeEvents("doctor.events", channel);
      // consumeEvents("appointment.events", channel);
      // consumeEvents("patient.events", channel);
      console.log("Connected to RabbitMQ");
    } catch (error) {
      console.error("Failed to connect to RabbitMQ, retrying...", error);
      retries++;
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }
    }
  }
  return channel;
}

export async function setupConsumer(
  exchange: string,
  channel: Channel,
  service: NotificationService
): Promise<void> {
  try {
    await channel.assertExchange(exchange, "fanout", { durable: true });
    const { queue } = await channel.assertQueue("", {
      exclusive: true, // Unique queue per consumer
      autoDelete: true,
    });
    await channel.bindQueue(queue, exchange, "");

    await channel.consume(queue, async (msg) => {
      console.log("Message received");
      if (msg) {
        try {
          const { event, data } = JSON.parse(msg.content.toString());
          console.log("Event data:", event, data);
          await service.handleEvent(event, data); // Delegate to service
          channel.ack(msg);
        } catch (error: any) {
          console.error("Error processing message:", error.message);
          channel.nack(msg, false, false); // Reject message on error
        }
      }
    });
    console.log(`Consumer set up for exchange: ${exchange}`);
  } catch (error) {
    console.error("Error setting up consumer:", error);
    throw error;
  }
}
