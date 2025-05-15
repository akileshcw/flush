import amqp, { Channel } from "amqplib";
import { DoctorService } from "../services/doctorService";

//Consume events from the other services
export async function consumeEvents(exchange: string, channel: amqp.Channel) {
  try {
    const doctorService = new DoctorService(channel);
    const { queue } = await channel.assertQueue("", {
      exclusive: true,
      autoDelete: true,
    });
    await channel.bindQueue(queue, exchange, "");
    await channel.consume(queue, async (msg) => {
      console.log("message received");
      if (msg) {
        try {
          const { event, data } = JSON.parse(msg.content.toString());
          console.log("the event data is", event, data);
          if (event === "user.registered") {
            const roles = data.roles;
            console.log("if roles include doctors?", roles.includes("doctors"));
            if (roles.includes("doctors")) {
              await doctorService.createDoctor({
                name: data.username,
                specialization: "dental",
                contactInfo: "123456",
              });
            }
          }
        } catch (error: any) {
          console.error("Error processing message", error.message);
          channel.nack(msg, false, false);
        }
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log("Error while consuming events", error);
  }
}

export async function connectToExchange(exchange: string, channel: Channel) {
  await channel.assertExchange(exchange, "fanout", { durable: true });
}

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
      await channel.assertQueue("doctor.events", { durable: true });
      await connectToExchange("auth.events.fanout", channel);
      consumeEvents("auth.events.fanout", channel);
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
