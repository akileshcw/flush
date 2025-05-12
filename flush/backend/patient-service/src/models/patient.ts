import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  member_id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ unique: true })
  phone_number!: string;

  @Column({ nullable: true })
  date_of_birth!: Date;

  @Column({ nullable: true })
  preconditions!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column()
  branch_id!: number;
}
