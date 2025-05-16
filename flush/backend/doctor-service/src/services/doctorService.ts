import { AppDataSource } from "./../config/database";
import { Repository } from "typeorm";
import { Doctor } from "../models/doctor";
import { Channel } from "amqplib";

export class DoctorService {
  private doctorRepository: Repository<Doctor>;
  private channel: Channel;

  constructor(channel: Channel) {
    this.doctorRepository = AppDataSource.getRepository(Doctor);
    this.channel = channel;
  }

  async createDoctor(data: Partial<Doctor>): Promise<Doctor> {
    if (!data.name || !data.specialization || !data.contactInfo) {
      throw new Error("Name,specialization and contactInfo are required");
    }
    const doctor = this.doctorRepository.create(data);
    await this.doctorRepository.save(doctor);
    this.publishEvent("doctor.created", doctor);
    return doctor;
  }

  async getDoctorById(id: number): Promise<Doctor> {
    const doctor = null;
    // await this.doctorRepository.findById(id);
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  }

  private publishEvent(event: string, data: any) {
    this.channel.publish(
      "doctor.events.fanout",
      "",
      Buffer.from(JSON.stringify({ event, data }))
    );
  }

  async handleEvent(event: string, data: any) {
    switch (event) {
      case "user.registered":
        if (data.roles.includes("admin") || data.roles.include("doctors")) {
          const dataFromAuth = {
            name: data.username,
            specialization: "dental",
            contactInfo: "123456789",
          };
          const doctor = this.createDoctor(dataFromAuth);
          this.publishEvent("doctor.created", doctor);
        }
        break;

      default:
        console.log("No matching action to excute based on the received event");
    }
  }
}
