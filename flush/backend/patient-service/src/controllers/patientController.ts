import { Request, Response, NextFunction } from "express";
import { PatientService } from "../services/patientService";

export class PatientController {
  private patientService: PatientService;

  constructor(patientService: PatientService) {
    this.patientService = patientService;
  }

  createPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patient = await this.patientService.createPatient(req.body);
      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  };

  getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await this.patientService.getAllPatients();
      res.json(patients);
    } catch (error) {
      next(error);
    }
  };

  getPatientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patient = await this.patientService.getPatientById(
        parseInt(req.params.id)
      );
      if (!patient) res.status(404).json({ error: "Patient not found" });
      res.json(patient);
    } catch (error) {
      next(error);
    }
  };

  getPatientByPhone = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patient = await this.patientService.getPatientByPhone(
        req.params.phone
      );
      if (!patient) res.status(404).json({ error: "Patient not found" });
      res.json(patient);
    } catch (error) {
      next(error);
    }
  };

  updatePatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patient = await this.patientService.updatePatient(
        parseInt(req.params.id),
        req.body
      );
      if (!patient) res.status(404).json({ error: "Patient not found" });
      res.json(patient);
    } catch (error) {
      next(error);
    }
  };

  deletePatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.patientService.deletePatient(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
