"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_1 = require("../models/user");
const database_1 = require("../config/database");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
class AuthService {
    constructor(channel) {
        this.jwtSecret = "your_jwt_secret"; // Use environment variable in production
        this.channel = channel;
        this.userRepository = database_1.AppDataSource.getRepository(user_1.User);
    }
    register(username, password, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const password_hash = yield bcrypt.hash(password, 10);
            const user = this.userRepository.create({ username, password_hash, roles });
            yield this.userRepository.save(user);
            this.publishEvent("user.registered", {
                id: user.id,
                username,
            });
            return user;
        });
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ username });
            console.log("the username in auth service is", user);
            if (!user)
                throw new Error("User not found");
            const isValid = yield bcrypt.compare(password, user.password_hash);
            if (!isValid)
                throw new Error("Invalid password");
            const token = jwt.sign({ id: user.id, groups: user.roles, iss: "auth-service", expiresIn: "1h" }, this.jwtSecret, {
                expiresIn: "1h",
            });
            this.publishEvent("user.logged_in", { id: user.id, username });
            return token;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find();
            return users;
        });
    }
    publishEvent(event, data) {
        const message = JSON.stringify({ event, data });
        this.channel.sendToQueue("auth.events", Buffer.from(message));
        console.log(`Event published: ${event}`, data);
    }
    verifyToken(token) {
        return jwt.verify(token, this.jwtSecret);
    }
}
exports.AuthService = AuthService;
