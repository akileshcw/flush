// controllers/appointmentController.ts
import { Request, Response, NextFunction } from "express";
import { AppointmentService } from "../services/appointmentService";

export class AppointmentController {
  private appointmentService: AppointmentService;

  constructor(appointmentService: AppointmentService) {
    this.appointmentService = appointmentService;
  }

  async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, doctorId, dateTime, notes } = req.body;
      const appointment = await this.appointmentService.createAppointment(
        patientId,
        doctorId,
        new Date(dateTime),
        notes
      );
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const appointments = await this.appointmentService.getAppointments();
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async getAppointmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await this.appointmentService.getAppointmentById(
        parseInt(req.params.id)
      );
      if (!appointment)
        return res.status(404).json({ error: "Appointment not found" });
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async updateAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await this.appointmentService.updateAppointment(
        parseInt(req.params.id),
        req.body
      );
      if (!appointment)
        return res.status(404).json({ error: "Appointment not found" });
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      await this.appointmentService.cancelAppointment(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
