import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, roles } = req.body;
      const user = await this.authService.register(username, password, roles);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      console.log("the username and password is", username, password);
      const userDetails = await this.authService.login(username, password);
      console.log("the user details is", userDetails);
      res.json(userDetails);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      await this.authService.logout(token);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await this.authService.getUsers();
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}
