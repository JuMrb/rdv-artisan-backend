import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function createReview(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user || user.role !== "CLIENT") {
    return res.status(403).json({ error: "Réservé aux clients" });
  }

  const { appointmentId, rating, comment } = req.body;

  const appt = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });
  if (!appt) return res.status(404).json({ error: "Rendez-vous introuvable" });
  if (appt.clientId !== user.id) {
    return res.status(403).json({ error: "Vous n'êtes pas le client" });
  }
  if (appt.status !== "DONE") {
    return res
      .status(400)
      .json({ error: "Le rendez-vous n'est pas terminé" });
  }

  const review = await prisma.review.create({
    data: {
      appointmentId,
      artisanId: appt.artisanId,
      clientId: appt.clientId,
      rating,
      comment,
    },
  });

  // recalcul note moyenne artisan
  const stats = await prisma.review.groupBy({
    by: ["artisanId"],
    where: { artisanId: appt.artisanId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const avg = stats[0]?._avg.rating || 0;
  const count = stats[0]?._count.rating || 0;

  await prisma.artisanProfile.update({
    where: { userId: appt.artisanId },
    data: {
      avgRating: avg,
      reviewCount: count,
    },
  });

  res.json(review);
}
