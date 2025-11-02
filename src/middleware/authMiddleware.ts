import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function requireAuth(
  allowedRoles?: ("CLIENT" | "ARTISAN" | "ADMIN")[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const token = header.split(" ")[1];

    try {
      const decoded = verifyToken(token) as any;
      (req as any).user = decoded;

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      next();
    } catch {
      return res.status(401).json({ error: "Token invalide" });
    }
  };
}
