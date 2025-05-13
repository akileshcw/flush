import { Router } from "express";
import { AuthController } from "../controllers/authController";

export function authRoutes(controller: AuthController): Router {
  const router = Router();
  router.post("/register", controller.register.bind(controller));
  router.post("/login", controller.login.bind(controller));
  router.get("/get-users", controller.getUsers.bind(controller));
  return router;
}
