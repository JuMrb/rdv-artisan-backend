import express from "express";
import cors from "cors";
import { ENV } from "./config/env";

import authRoutes from "./routes/auth.routes";
import artisansRoutes from "./routes/artisans.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import reviewsRoutes from "./routes/reviews.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// ✅ Autorise ton site Vercel (et localhost pour tests)
app.use(
  cors({
    origin: [
      "https://rdv-artisan-frontend.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Gère les pré-requêtes "OPTIONS"
app.options("*", cors());

app.use(express.json());

// ✅ Route test pour vérifier que l'API répond
app.get("/health", (_req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://rdv-artisan-frontend.vercel.app"
  );
  res.json({ ok: true });
});

// ✅ Routes principales
app.use("/auth", authRoutes);
app.use("/artisans", artisansRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/admin", adminRoutes);

const port = ENV.PORT || "4000";

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`✅ API running on port ${port}`);
});


