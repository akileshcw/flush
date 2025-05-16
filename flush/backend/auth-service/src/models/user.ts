import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  username?: string;

  @Column()
  password_hash!: string; // Store the hashed password, not the plain text

  @Column("text", { array: true })
  roles?: string[]; // e.g., 'admin', 'doctor', 'staff', 'patient'

  @Column({ unique: true, nullable: true }) // Make email optional and unique
  email?: string;

  @Column({ default: false })
  emailVerified: boolean = false;

  @Column({ nullable: true }) // Make image optional
  image?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  // Define relationships (if needed)
  @OneToMany(() => Session, (session) => session.user)
  sessions?: Session[];

  @OneToMany(() => Account, (account) => account.user)
  accounts?: Account[];

  @OneToMany(() => Verification, (verification) => verification.user)
  verifications?: Verification[];
}

@Entity()
export class Session {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string; // Foreign key to User

  @Column()
  token!: string;

  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  // Define relationship
  // You might not need this if you're not querying sessions from the user side.
  @ManyToOne(() => User, (user) => user.sessions)
  user?: User;
}

@Entity()
export class Account {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string; // Foreign key to User

  @Column()
  accountId!: string;

  @Column()
  providerId!: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ type: "timestamp", nullable: true })
  accessTokenExpiresAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  refreshTokenExpiresAt?: Date;

  @Column({ nullable: true })
  scope?: string;

  @Column({ nullable: true })
  idToken?: string;

  @Column({ nullable: true })
  password?: string; //  Important:  This should ONLY be used for local auth (e.g., email/password).  NEVER store passwords for third-party providers.

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  // Define relationship
  @ManyToOne(() => User, (user) => user.accounts)
  user?: User;
}

@Entity()
export class Verification {
  @PrimaryColumn()
  id!: string;

  @Column()
  identifier!: string;

  @Column()
  value!: string;

  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.verifications)
  user?: User;
}
