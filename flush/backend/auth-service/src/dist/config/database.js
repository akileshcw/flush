"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../models/user");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "auth-db",
    port: 5432,
    username: "auth_user",
    password: "your_pass",
    database: "auth_db",
    entities: [user_1.User],
    synchronize: true, // Set to false in production
});
