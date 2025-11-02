import { Router } from "express";
import {
  registerClient,
  registerArtisan,
  login,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register/client", registerClient);
router.post("/register/artisan", registerArtisan);
router.post("/login", login);

export default router;
