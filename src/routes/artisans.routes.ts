import { Router } from "express";
import {
  searchArtisans,
  getArtisanDetails,
} from "../controllers/artisans.controller";

const router = Router();

router.get("/", searchArtisans);
router.get("/:id", getArtisanDetails);

export default router;
