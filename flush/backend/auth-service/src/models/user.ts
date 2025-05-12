import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password_hash!: string;

  @Column("text", { array: true })
  roles!: string[]; // e.g., 'admin', 'doctor', 'staff', 'patient'
}
