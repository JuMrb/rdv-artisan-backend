import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export async function registerArtisan(req: Request, res: Response) {
  try {
    const { companyName, email, password } = req.body as {
      companyName?: string;
      email?: string;
      password?: string;
    };

    if (!companyName || !email || !password) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "email_taken" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "ARTISAN",
        companyName,
        profile: {
          create: {
            trades: [],        // vide au départ
            radiusKm: 20,      // valeur par défaut
            avgRating: 0,
            reviewCount: 0,
          },
        },
      },
      include: { profile: true },
    });

    // ⚠️ JWT_SECRET doit être défini côté Render
    const token = jwt.sign({ sub: user.id, role: user.role }, ENV.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
    });
  } catch (e: any) {
    console.error("registerArtisan error:", e);
    return res.status(500).json({ error: "server_error", detail: String(e?.message ?? e) });
  }
}
