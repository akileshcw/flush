import amqp from "amqplib";

export async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue("doctor.events", { durable: true });
  return channel;
}

async function consumeEvents() {
  const channel = await connectRabbitMQ();
  channel.consume("auth.events", (msg) => {
    if (msg) {
      const { event, data } = JSON.parse(msg.content.toString());
      if (event === "user.registered") {
        console.log("user registered event received", data);
      }
    }
  });
}

consumeEvents().catch((error) =>
  console.error("Error consuming events:", error)
);
