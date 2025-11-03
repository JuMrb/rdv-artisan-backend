import express from "express";
import cors from "cors";

const app = express();

/** ✅ CORS : autorise ton front Vercel (+ localhost pour dev) */
const ALLOWED_ORIGINS = [
  "https://rdv-artisan-frontend.vercel.app",
  "http://localhost:3000",
];

// Si tu utilises une variable d'env CORS_ORIGIN (séparée par des virgules), on la prend :
if (process.env.CORS_ORIGIN) {
  ALLOWED_ORIGINS.push(
    ...process.env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean)
  );
}

app.use(
  cors({
    origin: (origin, cb) => {
      // autorise les outils sans origin (curl, Postman) et ta liste blanche
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// important : répondre aux pré-requêtes
app.options("*", cors());

app.use(express.json());

// ⬇️ ⬇️ tes routes existent déjà en dessous ⬇️ ⬇️
// app.get("/health", (req, res) => res.json({ ok: true }));
// app.use("/artisans", artisansRouter);
// ...

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

