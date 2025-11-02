import express from "express";
import cors from "cors";
import { ENV } from "./config/env";

import authRoutes from "./routes/auth.routes";
import artisansRoutes from "./routes/artisans.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import reviewsRoutes from "./routes/reviews.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// CORS : autorise les appels du front local
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// route test pour vérifier que l'API tourne
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// nos vraies routes
app.use("/auth", authRoutes);
app.use("/artisans", artisansRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/admin", adminRoutes);

const port = ENV.PORT || "4000";

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`API running on port ${port}`);
});
