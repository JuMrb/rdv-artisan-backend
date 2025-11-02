import { Router } from "express";
import { createReview } from "../controllers/reviews.controller";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", requireAuth(["CLIENT"]), createReview);

export default router;
