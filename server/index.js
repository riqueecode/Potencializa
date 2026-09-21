import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  fetchInstagramReels,
  InstagramApiError,
} from "./services/instagram.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = new Set(
  [
    process.env.CORS_ORIGIN,
    process.env.FRONTEND_ORIGIN,
    "https://riqueecode.github.io",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean)
);

const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.has(origin) ||
      origin.endsWith(".github.io") ||
      origin.endsWith(".pages.dev")
    ) {
      callback(null, true);
      return;
    }

    callback(new Error("Origem não autorizada pelo CORS."));
  },
  credentials: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/instagram/reels", async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    res.json(await fetchInstagramReels());
  } catch (error) {
    if (error instanceof InstagramApiError && error.metaError) {
      console.error("Erro da API do Instagram:", {
        status: error.status,
        ...error.metaError,
      });
    } else {
      console.error("Erro ao buscar Reels do Instagram:", error.message);
    }

    res.status(error.status || 502).json({
      error: "Erro ao buscar Reels do Instagram",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
