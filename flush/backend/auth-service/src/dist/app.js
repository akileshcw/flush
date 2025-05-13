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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = require("./config/database");
const authService_1 = require("./services/authService");
const authController_1 = require("./controllers/authController");
const authRoutes_1 = require("./routes/authRoutes");
const errorHandler_1 = require("./utils/errorHandler");
const rabbitmq_1 = require("./config/rabbitmq");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const app = (0, express_1.default)();
            app.use(body_parser_1.default.json());
            const channel = yield (0, rabbitmq_1.connectToRabbitMQ)();
            yield database_1.AppDataSource.initialize();
            console.log("Database connected");
            const authService = new authService_1.AuthService(channel);
            const authController = new authController_1.AuthController(authService);
            app.use("/", (0, authRoutes_1.authRoutes)(authController));
            app.use(errorHandler_1.errorHandler);
            app.listen(3000, () => {
                console.log("Auth Service running on port 3000");
            });
        }
        catch (error) {
            console.error("Error starting auth service:", error);
            process.exit(1);
        }
    });
}
startServer();
