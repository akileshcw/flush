import amqp from "amqplib";

export async function consumeEvents(event: string, channel: amqp.Channel) {
  channel.assertQueue(event, { durable: true });
  channel.consume(event, async (msg) => {
    if (msg !== null) {
      const content = msg.content.toString();
      console.log(`Received message from ${event}: ${content}`);
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
      await channel.assertQueue("notification.events", { durable: true });
      consumeEvents("auth.events", channel);
      consumeEvents("doctor.events", channel);
      consumeEvents("appointment.events", channel);
      consumeEvents("patient.events", channel);
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
