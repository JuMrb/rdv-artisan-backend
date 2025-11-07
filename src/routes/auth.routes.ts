import { Router } from "express";
import { registerArtisan, login } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth";
import { prisma } from "../config/prisma";

const router = Router();

router.post("/register/artisan", registerArtisan);
router.post("/login", login);

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: (req as any).userId },
    select: { id: true, email: true, role: true, fullName: true, companyName: true },
  });
  if (!user) return res.status(404).json({ error: "not_found" });
  res.json(user);
});

export default router;
