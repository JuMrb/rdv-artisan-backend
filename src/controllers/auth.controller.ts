import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { signToken } from "../utils/jwt";

export async function registerClient(req: Request, res: Response) {
  const { fullName, email, password, phone } = req.body;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: "Email déjà utilisé" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      role: "CLIENT",
      fullName,
      email,
      passwordHash,
      phone,
    },
  });

  const token = signToken({
    id: user.id,
    role: user.role,
    name: user.fullName,
  });

  res.json({
    token,
    user: {
      id: user.id,
      role: "client",
      name: user.fullName,
    },
  });
}

export async function registerArtisan(req: Request, res: Response) {
  const {
    companyName,
    email,
    password,
    trades,
    radiusKm,
    latitude,
    longitude,
    phone,
  } = req.body;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: "Email déjà utilisé" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      role: "ARTISAN",
      email,
      passwordHash,
      phone,
      companyName,
      statusValidation: "PENDING",
      profile: {
        create: {
          trades,
          radiusKm,
          latitude,
          longitude,
          emergency24h: false,
          hasInsuranceDecennale: false,
          photos: [],
        },
      },
    },
    include: { profile: true },
  });

  const token = signToken({
    id: user.id,
    role: user.role,
    name: user.companyName,
  });

  res.json({
    token,
    user: {
      id: user.id,
      role: "artisan",
      name: user.companyName,
      statusValidation: user.statusValidation,
    },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

  const token = signToken({
    id: user.id,
    role: user.role,
    name: user.fullName || user.companyName,
    statusValidation: user.statusValidation,
  });

  res.json({
    token,
    user: {
      id: user.id,
      role:
        user.role === "CLIENT"
          ? "client"
          : user.role === "ARTISAN"
          ? "artisan"
          : "admin",
      name: user.fullName || user.companyName,
      statusValidation: user.statusValidation,
    },
  });
}
