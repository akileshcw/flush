// controllers/appointmentController.ts
import { Request, Response, NextFunction } from "express";
import { AppointmentService } from "../services/appointmentService";

export class AppointmentController {
  private appointmentService: AppointmentService;

  constructor(appointmentService: AppointmentService) {
    this.appointmentService = appointmentService;
  }

  createAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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
  };

  getAppointments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const appointments = await this.appointmentService.getAppointments();
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  };

  getAppointmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const appointment = await this.appointmentService.getAppointmentById(
        parseInt(req.params.id)
      );
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  };

  updateAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const appointment = await this.appointmentService.updateAppointment(
        parseInt(req.params.id),
        req.body
      );
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  };

  cancelAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.appointmentService.cancelAppointment(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
