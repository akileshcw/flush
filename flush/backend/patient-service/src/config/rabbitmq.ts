import amqp from "amqplib";

export async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue("patient.events", { durable: true });
  return channel;
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
      await channel.assertQueue("patient.events", { durable: true });
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
