import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function searchArtisans(req: Request, res: Response) {
  const { metier } = req.query;

  const artisans = await prisma.user.findMany({
    where: {
      role: "ARTISAN",
      statusValidation: "APPROVED",
      profile: {
        trades: { has: metier as string },
      },
    },
    include: {
      profile: true,
    },
    take: 20,
  });

  const results = artisans.map((a) => ({
    id: a.id,
    name: a.companyName,
    trades: a.profile?.trades || [],
    note: a.profile?.avgRating || 0,
    avisCount: a.profile?.reviewCount || 0,
    radiusKm: a.profile?.radiusKm,
    statusValidation: a.statusValidation,
  }));

  res.json(results);
}

export async function getArtisanDetails(req: Request, res: Response) {
  const { id } = req.params;

  const artisan = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      reviewsReceived: {
        where: { isVisible: true },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          client: true,
        },
      },
    },
  });

  if (!artisan || artisan.role !== "ARTISAN") {
    return res.status(404).json({ error: "Artisan introuvable" });
  }

  res.json({
    id: artisan.id,
    name: artisan.companyName,
    trades: artisan.profile?.trades || [],
    bio: artisan.profile?.bio || "",
    radiusKm: artisan.profile?.radiusKm,
    emergency24h: artisan.profile?.emergency24h,
    hasInsuranceDecennale: artisan.profile?.hasInsuranceDecennale,
    avgRating: artisan.profile?.avgRating,
    reviewCount: artisan.profile?.reviewCount,
    photos: artisan.profile?.photos || [],
    reviews: artisan.reviewsReceived.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt,
      author: r.client.fullName || "Client",
    })),
  });
}
