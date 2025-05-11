import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, role } = req.body;
      const user = await this.authService.register(username, password, role);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const token = await this.authService.login(username, password);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}
