import express from "express";
import cors from "cors";
import { ENV } from "./config/env";

import authRoutes from "./routes/auth.routes";
import artisansRoutes from "./routes/artisans.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import reviewsRoutes from "./routes/reviews.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// ✅ Autorise ton site Vercel
app.use(
  cors({
    origin: [
      "https://rdv-artisan-frontend.vercel.app", // ton site en ligne
      "http://localhost:3000", // utile pour les tests locaux
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// important : permet aussi le préflight OPTIONS
app.options("*", cors());

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

