import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function createAppointment(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user || user.role !== "CLIENT") {
    return res.status(403).json({ error: "Réservé aux clients" });
  }

  const { artisanId, start, end, address, problemType, descriptionClient } =
    req.body;

  const appointment = await prisma.appointment.create({
    data: {
      artisanId,
      clientId: user.id,
      start: new Date(start),
      end: new Date(end),
      address,
      problemType,
      descriptionClient,
      status: "PENDING",
    },
  });

  res.json(appointment);
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  const user = (req as any).user;
  const { id } = req.params;
  const { status } = req.body;

  const appt = await prisma.appointment.findUnique({ where: { id } });
  if (!appt) return res.status(404).json({ error: "Rendez-vous introuvable" });

  if (user.role !== "ARTISAN" || user.id !== appt.artisanId) {
    return res.status(403).json({ error: "Non autorisé" });
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status },
  });

  res.json(updated);
}

export async function getMyAppointments(req: Request, res: Response) {
  const user = (req as any).user;

  if (user.role === "CLIENT") {
    const list = await prisma.appointment.findMany({
      where: { clientId: user.id },
      orderBy: { start: "asc" },
    });
    return res.json(list);
  }

  if (user.role === "ARTISAN") {
    const list = await prisma.appointment.findMany({
      where: { artisanId: user.id },
      orderBy: { start: "asc" },
    });
    return res.json(list);
  }

  res.status(403).json({ error: "Rôle non supporté" });
}
