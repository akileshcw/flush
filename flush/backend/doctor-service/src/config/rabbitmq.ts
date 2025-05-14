import amqp from "amqplib";

export async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue("doctor.events", { durable: true });
  consumeEvents("auth.events", channel).catch((error) =>
    console.error("Error consuming events:", error)
  );
  return channel;
}

//Consume events from the other services
async function consumeEvents(event: string, channel: amqp.Channel) {
  channel.assertQueue(event, { durable: true });
  channel.consume(event, (msg) => {
    if (msg) {
      const { event, data } = JSON.parse(msg.content.toString());
      if (event === "user.registered") {
        console.log("user registered event received", data);
      }
      channel.ack(msg);
    }
  });
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
      channel = await connection.createChannel();
      await channel.assertQueue("doctor.events", { durable: true });
      consumeEvents("auth.events", channel).catch((error) =>
        console.error("Error consuming events:", error)
      );
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
