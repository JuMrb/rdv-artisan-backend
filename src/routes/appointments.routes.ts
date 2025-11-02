import { Router } from "express";
import {
  createAppointment,
  updateAppointmentStatus,
  getMyAppointments,
} from "../controllers/appointments.controller";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", requireAuth(["CLIENT"]), createAppointment);

router.patch(
  "/:id/status",
  requireAuth(["ARTISAN"]),
  updateAppointmentStatus
);

router.get("/me", requireAuth(["CLIENT", "ARTISAN"]), getMyAppointments);

export default router;
