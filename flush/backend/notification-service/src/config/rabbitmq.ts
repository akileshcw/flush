import amqp, { Channel } from "amqplib";

export async function consumeEvents(exchange: string, channel: amqp.Channel) {
  try {
    const { queue } = await channel.assertQueue("", {
      exclusive: true,
      autoDelete: true,
    });
    await channel.bindQueue(queue, exchange, "");
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const { event, data } = JSON.parse(msg.content.toString());
        console.log(
          `Received message in Notification Service from ${event}: ${data}`
        );
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log("the erorr in notification consumer is", error);
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
      await channel.assertQueue("notification.events", { durable: true });
      await connectToExchange("auth.events.fanout", channel);
      consumeEvents("auth.events.fanout", channel);
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
