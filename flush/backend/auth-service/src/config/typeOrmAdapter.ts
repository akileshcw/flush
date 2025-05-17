import { createAdapter, type AdapterDebugLogs } from "better-auth/adapters";
import { Repository } from "typeorm";
import { User, Session, Account, Verification } from "../models/user";
import { AppDataSource } from "../config/database";
import { connectToRabbitMQ } from "./rabbitmq";

interface TypeOrmAdapterConfig {
  debugLogs?: AdapterDebugLogs;
  usePlural?: boolean;
}

export const TypeOrmAdapter = (config: TypeOrmAdapterConfig) =>
  createAdapter({
    config: {
      adapterId: "typeorm-adapter",
      adapterName: "TypeOrm Adapter",
      usePlural: config.usePlural || false,
      debugLogs: config.debugLogs || false,
      supportsBooleans: true,
      supportsDates: true,
      supportsJSON: false,
      supportsNumericIds: true,
    },
    adapter: ({}) => {
      const userRepo = AppDataSource.getRepository(User);
      const sessionRepo = AppDataSource.getRepository(Session);
      const accountRepo = AppDataSource.getRepository(Account);
      const verificationRepo = AppDataSource.getRepository(Verification);

      const publishEvent = async (event: string, data: any) => {
        const channel = await connectToRabbitMQ();
        if (!channel) return;
        channel.publish(
          "auth.events.fanout",
          "",
          Buffer.from(JSON.stringify({ event, data })),
          { persistent: true }
        );
      };

      return {
        create: async ({ data, model, select }) => {
          let repo: Repository<any>;
          switch (model) {
            case "user":
              repo = userRepo;
              break;
            case "session":
              repo = sessionRepo;
              break;
            case "account":
              repo = accountRepo;
              break;
            case "verification":
              repo = verificationRepo;
              break;
            default:
              throw new Error(`Unsupported model: ${model}`);
          }
          console.log("the create part is running with data", data, model);
          const entity = repo.create(data);
          const result = await repo.save(entity);
          if (model === "user") {
            publishEvent("user.registered", result);
          }
          return select
            ? repo.findOne({ where: { id: result.id }, select })
            : result;
        },
        update: async ({ model, where, update: data }) => {
          let repo: Repository<any>;
          switch (model) {
            case "user":
              repo = userRepo;
              break;
            case "session":
              repo = sessionRepo;
              break;
            case "account":
              repo = accountRepo;
              break;
            case "verification":
              repo = verificationRepo;
              break;
            default:
              throw new Error(`Unsupported model: ${model}`);
          }
          await repo.update(where, data as any);
          const result = await repo.findOne({ where });
          if (model === "user" && result) {
            publishEvent("user.updated", result);
          }
          return result;
        },
        delete: async ({ where, model }) => {
          let repo: Repository<any>;
          switch (model) {
            case "user":
              repo = userRepo;
              break;
            case "session":
              repo = sessionRepo;
              break;
            case "account":
              repo = accountRepo;
              break;
            case "verification":
              repo = verificationRepo;
              break;
            default:
              throw new Error("Cannot delete the data");
          }
          const result = await repo.delete(where);
          return;
        },
        findOne: async ({ where, model, select }) => {
          let repo: Repository<any>;
          switch (model) {
            case "user":
              repo = userRepo;
              break;
            case "session":
              repo = sessionRepo;
              break;
            case "account":
              repo = accountRepo;
              break;
            case "verification":
              repo = verificationRepo;
              break;
            default:
              throw new Error(`Unsupported model: ${model}`);
          }
          return repo.findOne({ where, select });
        },
        findMany: async ({ where, model }) => {
          let repo: Repository<any>;
          switch (model) {
            case "user":
              repo = userRepo;
              break;
            case "session":
              repo = sessionRepo;
              break;
            case "account":
              repo = accountRepo;
              break;
            case "verification":
              repo = verificationRepo;
              break;
            default:
              throw new Error(`Unsupported model: ${model}`);
          }
          return repo.find({ where });
        },
        updateMany: async ({ model, where, update: data }) => {
          let repo: Repository<any>;
          switch (model) {
            case "user":
              repo = userRepo;
              break;
            case "session":
              repo = sessionRepo;
              break;
            case "account":
              repo = accountRepo;
              break;
            case "verification":
              repo = verificationRepo;
              break;
            default:
              throw new Error(`Unsupported model: ${model}`);
          }
          const result = await repo.update(where, data as any);
          return Number(result.affected);
        },
        deleteMany: async ({ where, model }) => {
          let repo: Repository<any>;
          switch (model) {
            case "user":
              repo = userRepo;
              break;
            case "session":
              repo = sessionRepo;
              break;
            case "account":
              repo = accountRepo;
              break;
            case "verification":
              repo = verificationRepo;
              break;
            default:
              throw new Error(`Unsupported model: ${model}`);
          }
          const result = await repo.delete(where);
          return Number(result.affected);
        },
        count: async ({ where, model }) => {
          let repo: Repository<any>;
          switch (model) {
            case "user":
              repo = userRepo;
              break;
            case "session":
              repo = sessionRepo;
              break;
            case "account":
              repo = accountRepo;
              break;
            case "verification":
              repo = verificationRepo;
              break;
            default:
              throw new Error(`Unsupported model: ${model}`);
          }
          const count = await repo.count({ where });
          return count;
        },
      };
    },
  });
