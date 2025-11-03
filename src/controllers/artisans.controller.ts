import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function searchArtisans(req: Request, res: Response) {
  try {
    const raw = (req.query.metier as string | undefined)?.trim();
    const term = raw ? raw.toLowerCase() : undefined;

    // Filtre de base : uniquement des artisans validés
    const where: any = { role: "ARTISAN", statusValidation: "APPROVED" };

    // Si on a un terme, filtrer dans la relation 1–1 "profile"
    if (term) {
      where.profile = { is: { trades: { has: term } } };
    } else {
      // sinon renvoyer seulement ceux qui ont un profil
      where.profile = { isNot: null };
    }

    const artisans = await prisma.user.findMany({
      where,
      include: { profile: true },
      take: 20,
      orderBy: [{ createdAt: "desc" }],
    });

    const results = artisans.map((a) => ({
      id: a.id,
      name: a.companyName ?? a.fullName ?? "Artisan",
      trades: a.profile?.trades ?? [],
      note: a.profile?.avgRating ?? 0,
      avisCount: a.profile?.reviewCount ?? 0,
      radiusKm: a.profile?.radiusKm ?? null,
      statusValidation: a.statusValidation,
    }));

    res.json(results);
  } catch (err) {
    console.error("searchArtisans error:", err);
    res.status(500).json({ error: "search_failed" });
  }
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
