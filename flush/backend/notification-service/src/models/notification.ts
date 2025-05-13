import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  receiverId!: number;

  @Column()
  message!: string;

  @Column({ default: false })
  type!: string;

  @Column({ default: false })
  status!: string;
  // e.g., 'unread', 'read', 'archived'
}
