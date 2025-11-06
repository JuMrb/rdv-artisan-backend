import express from "express";
import cors from "cors";
import { ENV } from "./config/env";

import authRoutes from "./routes/auth.routes";
import artisansRoutes from "./routes/artisans.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import reviewsRoutes from "./routes/reviews.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// ✅ CORS (sans app.options("*", ...))
const corsOptions: cors.CorsOptions = {
  origin: [
    "https://rdv-artisan-frontend.vercel.app",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204, // pour certains navigateurs anciens
};
app.use(cors(corsOptions));

app.use(express.json());

// Santé
app.get("/health", (_req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://rdv-artisan-frontend.vercel.app"
  );
  res.json({ ok: true });
});

// Routes métier
app.use("/auth", authRoutes);
app.use("/artisans", artisansRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/admin", adminRoutes);

const port = ENV.PORT || "4000";
app.listen(Number(port), "0.0.0.0", () => {
  console.log(`✅ API running on port ${port}`);
});
