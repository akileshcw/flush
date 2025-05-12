import { Channel } from "amqplib";

export class PatientPortalService {
  private channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;
  }

  async getPatientProfile(patientId: number): Promise<any> {
    const response = await fetch(
      `http://patient-service/patients/${patientId}`
    );
    if (!response.ok) throw new Error("Patient not found");
    return response.json();
  }

  async getPatientAppointments(patientId: number): Promise<any> {
    const response = await fetch(
      `http://appointment-service/appointments?patientId=${patientId}`
    );
    if (!response.ok) throw new Error("Appointments not found");
    return response.json();
  }

  private publishEvent(event: string, data: any) {
    const message = JSON.stringify({ event, data });
    this.channel.sendToQueue("patientportal.events", Buffer.from(message));
  }
}
