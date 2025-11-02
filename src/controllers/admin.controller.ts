import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function listPendingArtisans(req: Request, res: Response) {
  const list = await prisma.user.findMany({
    where: {
      role: "ARTISAN",
      statusValidation: "PENDING",
    },
    include: {
      profile: true,
    },
  });

  res.json(
    list.map((a) => ({
      id: a.id,
      companyName: a.companyName,
      trades: a.profile?.trades || [],
      radiusKm: a.profile?.radiusKm,
      emergency24h: a.profile?.emergency24h,
      hasInsuranceDecennale: a.profile?.hasInsuranceDecennale,
    }))
  );
}

export async function updateArtisanStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await prisma.user.update({
    where: { id },
    data: {
      statusValidation: status,
    },
  });

  res.json({
    ok: true,
    artisanId: updated.id,
    newStatus: updated.statusValidation,
  });
}

export async function hideReview(req: Request, res: Response) {
  const { id } = req.params;
  const { hidden } = req.body;

  const updated = await prisma.review.update({
    where: { id },
    data: {
      isVisible: hidden ? false : true,
    },
  });

  res.json({
    ok: true,
    reviewId: updated.id,
    isVisible: updated.isVisible,
  });
}
