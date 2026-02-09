import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

  if (!headerValue || !headerValue.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = headerValue.substring(7);
  const decoded = authService.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.userId = decoded.userId;
  next();
}
