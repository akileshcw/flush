import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const jwtSecret = "your_jwt_secret"; // Use environment variable in production
declare module "express" {
  interface Request {
    user?: {
      roles: string; // Adjust this based on your JWT payload structure
      [key: string]: any; // Add other properties if needed
    };
  }
}
export const authenticateToken = (
  req: Request, // Use Request instead of any for better type safety
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return; // Explicitly return void
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded === "object" && decoded !== null && "roles" in decoded) {
      req.user = decoded as { [key: string]: any; roles: string }; // Ensure req.user is typed appropriately
    } else {
      res.status(403).json({ error: "Invalid token payload" });
      return; // Explicitly return void
    }
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
    return; // Explicitly return void
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return; // Explicitly return void
    }
    next();
  };
};
