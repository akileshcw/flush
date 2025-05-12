import amqp from "amqplib";

export async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue("patientportal.events", { durable: true });
  return channel;
}
