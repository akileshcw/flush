import amqp, { Channel } from "amqplib";

export const consumeEvents = async (exchange: string, channel: Channel) => {
  try {
    const { queue } = await channel.assertQueue("", {
      exclusive: true,
      autoDelete: true,
    });

    await channel.bindQueue(queue, exchange, "");
    channel.consume(queue, (msg) => {
      if (msg) {
        console.log(
          "the message received in auth service is",
          JSON.parse(msg.content.toString())
        );
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error in consumeEvents:", error);
  }
};

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
