import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text", { nullable: true }) // Make username unique
  name?: string;

  @Column({ type: "text", nullable: true }) // Make username optional
  username?: string;

  @Column("text")
  password!: string; // Important: This should ONLY be used for local auth (e.g., email/password). NEVER store passwords for third-party providers.

  @Column("text", { unique: false, nullable: true })
  phoneNumber?: string;

  @Column("text", { array: true })
  roles!: string[]; // e.g., 'admin', 'doctor', 'staff', 'patient'

  @Column("text", { unique: true, nullable: true }) // Make email optional and unique
  email?: string;

  @Column("text", { nullable: true }) // Make image optional
  image?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  // // Define relationships (if needed)
  // @OneToMany(() => Session, (session) => session.user)
  // sessions?: Session[];

  // @OneToMany(() => Account, (account) => account.user)
  // accounts?: Account[];

  // @OneToMany(() => Verification, (verification) => verification.user)
  // verifications?: Verification[];
}

// @Entity()
// export class Session {
//   @PrimaryColumn("text")
//   id!: string;

//   @Column("text")
//   userId!: string; // Foreign key to User

//   @Column("text")
//   token!: string;

//   @Column({ type: "timestamp" })
//   expiresAt!: Date;

//   @Column("text", { nullable: true })
//   ipAddress?: string;

//   @Column("text", { nullable: true })
//   userAgent?: string;

//   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
//   createdAt!: Date;

//   @Column({
//     type: "timestamp",
//     default: () => "CURRENT_TIMESTAMP",
//     onUpdate: "CURRENT_TIMESTAMP",
//   })
//   updatedAt!: Date;

// Define relationship
// You might not need this if you're not querying sessions from the user side.
//   @ManyToOne(() => User, (user) => user.sessions)
//   user?: User;
// }

// @Entity()
// export class Account {
//   @PrimaryColumn("text")
//   id!: string;

//   @Column("text")
//   userId!: string; // Foreign key to User

//   @Column("text")
//   accountId!: string;

//   @Column("text")
//   providerId!: string;

//   @Column("text", { nullable: true })
//   accessToken?: string;

//   @Column("text", { nullable: true })
//   refreshToken?: string;

//   @Column({ type: "timestamp", nullable: true })
//   accessTokenExpiresAt?: Date;

//   @Column({ type: "timestamp", nullable: true })
//   refreshTokenExpiresAt?: Date;

//   @Column("text", { nullable: true })
//   scope?: string;

//   @Column("text", { nullable: true })
//   idToken?: string;

//   @Column("text", { nullable: true })
//   password?: string; //  Important:  This should ONLY be used for local auth (e.g., email/password).  NEVER store passwords for third-party providers.

//   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
//   createdAt!: Date;

//   @Column({
//     type: "timestamp",
//     default: () => "CURRENT_TIMESTAMP",
//     onUpdate: "CURRENT_TIMESTAMP",
//   })
//   updatedAt!: Date;

//   // Define relationship
//   @ManyToOne(() => User, (user) => user.accounts)
//   user?: User;
// }

// @Entity()
// export class Verification {
//   @PrimaryColumn("text")
//   id!: string;

//   @Column("text")
//   identifier!: string;

//   @Column("text")
//   value!: string;

//   @Column({ type: "timestamp" })
//   expiresAt!: Date;

//   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
//   createdAt!: Date;

//   @Column({
//     type: "timestamp",
//     default: () => "CURRENT_TIMESTAMP",
//     onUpdate: "CURRENT_TIMESTAMP",
//   })
//   updatedAt!: Date;

//   @ManyToOne(() => User, (user) => user.verifications)
//   user?: User;
// }

// @Entity()
// export class Jwks {
//   @PrimaryColumn("text")
//   id!: string;

//   @Column("text")
//   publicKey!: string;

//   @Column("text", { default: "your_jwt_secret" })
//   privateKey!: string;

//   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
//   createdAt!: Date;
// }
