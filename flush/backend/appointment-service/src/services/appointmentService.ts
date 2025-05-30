// services/appointmentService.ts
import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Appointment } from "../models/appointment";
import { Channel } from "amqplib";

export class AppointmentService {
  private appointmentRepository: Repository<Appointment>;
  private channel: Channel;

  constructor(channel: Channel) {
    this.appointmentRepository = AppDataSource.getRepository(Appointment);
    this.channel = channel;
  }

  async createAppointment(
    patientId: number,
    doctorId: number,
    dateTime: Date,
    notes?: string
  ): Promise<Appointment> {
    // Mocked integration: Check if patient and doctor exist via their services
    const patientExists = true; // In reality: await fetch('http://patient-service/patients/' + patientId)
    if (!patientExists) throw new Error("Patient does not exist");

    const doctorExists = true; // In reality: await fetch('http://doctor-service/doctors/' + doctorId)
    if (!doctorExists) throw new Error("Doctor does not exist");

    // Check doctor availability
    const isAvailable = await this.checkDoctorAvailability(doctorId, dateTime);
    if (!isAvailable) throw new Error("Doctor is not available at this time");

    // Check patient conflicts
    const patientConflict = await this.checkPatientConflict(
      patientId,
      dateTime
    );
    if (patientConflict)
      throw new Error("Patient already has an appointment at this time");

    const appointment = this.appointmentRepository.create({
      patientId,
      doctorId,
      dateTime,
      status: "scheduled",
      notes,
    });

    await this.appointmentRepository.save(appointment);
    this.publishEvent("appointment.created", {
      id: appointment.id,
      patientId,
      doctorId,
      dateTime,
      notes,
    });
    return appointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  async getAppointmentById(id: number): Promise<Appointment | null> {
    return this.appointmentRepository.findOneBy({ id });
  }

  async updateAppointment(
    id: number,
    data: Partial<Appointment>
  ): Promise<Appointment | null> {
    await this.appointmentRepository.update(id, data);
    this.publishEvent("appointment.updated", {
      id,
      data,
    });
    return this.getAppointmentById(id);
  }

  async cancelAppointment(id: number): Promise<void> {
    await this.appointmentRepository.update(id, { status: "canceled" });
    this.publishEvent("appointment.canceled", { id });
    return;
  }

  async checkDoctorAvailability(
    doctorId: number,
    dateTime: Date
  ): Promise<boolean> {
    const conflictingAppointments = await this.appointmentRepository.find({
      where: { doctorId, dateTime, status: "scheduled" },
    });
    return conflictingAppointments.length === 0;
  }

  async checkPatientConflict(
    patientId: number,
    dateTime: Date
  ): Promise<boolean> {
    const conflictingAppointments = await this.appointmentRepository.find({
      where: { patientId, dateTime, status: "scheduled" },
    });
    return conflictingAppointments.length > 0;
  }

  private publishEvent(event: string, data: any) {
    const message = JSON.stringify({ event, data });
    this.channel.sendToQueue("auth.events", Buffer.from(message));
  }
}
