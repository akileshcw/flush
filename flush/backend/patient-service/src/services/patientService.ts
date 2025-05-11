import { Repository } from "typeorm";
import { Patient } from "../models/patient";
import { AppDataSource } from "../config/database";
import { Channel } from "amqplib";

export class PatientService {
  private patientRepository: Repository<Patient>;
  private channel: Channel;

  constructor(channel: Channel) {
    this.patientRepository = AppDataSource.getRepository(Patient);
    this.channel = channel;
  }

  async createPatient(data: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create(data);
    await this.patientRepository.save(patient);
    this.publishEvent("patient.created", patient);
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async getPatientById(id: number): Promise<Patient | null> {
    return this.patientRepository.findOneBy({ member_id: id });
  }

  async getPatientByPhone(phone: string): Promise<Patient | null> {
    return this.patientRepository.findOneBy({ phone_number: phone });
  }

  async updatePatient(
    id: number,
    data: Partial<Patient>
  ): Promise<Patient | null> {
    await this.patientRepository.update(id, data);
    const updatedPatient = await this.getPatientById(id);
    if (updatedPatient) {
      this.publishEvent("patient.updated", updatedPatient);
    }
    return updatedPatient;
  }

  async deletePatient(id: number): Promise<void> {
    const patient = await this.getPatientById(id);
    if (patient) {
      await this.patientRepository.delete(id);
      this.publishEvent("patient.deleted", { member_id: id });
    }
  }

  private publishEvent(event: string, data: any) {
    this.channel.sendToQueue(
      "patient.events",
      Buffer.from(JSON.stringify({ event, data }))
    );
  }
}
