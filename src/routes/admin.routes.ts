import { Router } from "express";
import {
  listPendingArtisans,
  updateArtisanStatus,
  hideReview,
} from "../controllers/admin.controller";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/artisans-pending",
  requireAuth(["ADMIN"]),
  listPendingArtisans
);

router.patch(
  "/artisans/:id/status",
  requireAuth(["ADMIN"]),
  updateArtisanStatus
);

router.patch("/reviews/:id/hide", requireAuth(["ADMIN"]), hideReview);

export default router;
