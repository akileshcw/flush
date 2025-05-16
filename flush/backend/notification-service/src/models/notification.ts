import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from "typeorm";
@Entity()
@Index(["fcmToken", "phoneNumber", "topics"])
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  message!: string;

  @Column({ default: false })
  type!: string;

  @Column({ default: false })
  status!: string;
  // e.g., 'unread', 'read', 'archived'

  @Column({ nullable: true })
  fcmToken?: string; // FCM token for push notifications

  @Column({ nullable: true })
  phoneNumber?: string; // For SMS or WhatsApp

  @Column({ nullable: true })
  lastUpdated?: Date; // Last time FCM token was updated

  @Column("simple-array", { nullable: true })
  topics?: string[]; // FCM topics the user is subscribed to
}
