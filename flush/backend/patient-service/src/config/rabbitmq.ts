import amqp from "amqplib";

export async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("patient.events", { durable: true });
  return channel;
}
