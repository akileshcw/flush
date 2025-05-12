// models/appointment.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @Column()
  doctorId!: number;

  @Column()
  dateTime!: Date;

  @Column()
  status!: string; // e.g., 'scheduled', 'completed', 'canceled'

  @Column({ nullable: true })
  notes!: string;
}
