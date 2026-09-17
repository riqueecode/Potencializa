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

app.use(cors());
app.use(express.json());

app.get("/api/instagram/reels", async (req, res) => {
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
