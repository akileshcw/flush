import { Request, Response, NextFunction } from "express";
import { PatientPortalService } from "../services/patientPortalService";

export class PatientPortalController {
  private patientPortalService: PatientPortalService;

  constructor(patientPortalService: PatientPortalService) {
    this.patientPortalService = patientPortalService;
  }

  async getPatientProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = parseInt(req.params.id);
      const profile = await this.patientPortalService.getPatientProfile(
        patientId
      );
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async getPatientAppointments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const patientId = parseInt(req.params.id);
      const appointments =
        await this.patientPortalService.getPatientAppointments(patientId);
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }
}
