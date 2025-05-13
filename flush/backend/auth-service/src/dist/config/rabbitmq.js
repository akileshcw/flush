"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRabbitMQ = connectRabbitMQ;
exports.connectToRabbitMQ = connectToRabbitMQ;
const amqplib_1 = __importDefault(require("amqplib"));
function connectRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield amqplib_1.default.connect("amqp://guest:guest@rabbitmq:5672");
        const channel = yield connection.createChannel();
        yield channel.assertQueue("auth.events", { durable: true });
        return channel;
    });
}
function connectToRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        const rabbitmqUrl = "amqp://guest:guest@rabbitmq:5672";
        let connection;
        let channel;
        const maxRetries = 5;
        const retryDelay = 5000;
        let retries = 0;
        while (!connection && retries < maxRetries) {
            try {
                connection = yield amqplib_1.default.connect(rabbitmqUrl);
                channel = yield connection.createChannel();
                yield channel.assertQueue("auth.events", { durable: true });
                console.log("Connected to RabbitMQ");
            }
            catch (error) {
                console.error("Failed to connect to RabbitMQ, retrying...", error);
                retries++;
                if (retries < maxRetries) {
                    yield new Promise((resolve) => setTimeout(resolve, retryDelay));
                }
                else {
                    console.error("Max retries reached. Exiting...");
                    process.exit(1);
                }
            }
        }
        return channel;
    });
}
