import { Request, Response, NextFunction } from "express";
import { DoctorService } from "../services/doctorService";

export class DoctorController {
  private doctorService: DoctorService;

  constructor(doctorService: DoctorService) {
    this.doctorService = doctorService;
  }

  async createDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await this.doctorService.createDoctor(req.body);
      res.status(201).json(doctor);
    } catch (error) {
      next(error);
    }
  }

  async getDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const doctor = await this.doctorService.getDoctorById(id);
      res.json(doctor);
    } catch (error) {
      next(error);
    }
  }
}
