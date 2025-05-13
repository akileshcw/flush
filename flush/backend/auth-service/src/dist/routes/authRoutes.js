"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const express_1 = require("express");
function authRoutes(controller) {
    const router = (0, express_1.Router)();
    router.post("/register", controller.register.bind(controller));
    router.post("/login", controller.login.bind(controller));
    router.get("/get-users", controller.getUsers.bind(controller));
    return router;
}
