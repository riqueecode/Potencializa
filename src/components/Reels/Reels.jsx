import { useEffect, useState } from "react";
import ReelsCarousel from "./ReelsCarousel.jsx";
import { fetchInstagramReels } from "../../services/instagram.js";
import "./Reels.css";

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadReels() {
      try {
        const data = await fetchInstagramReels();
        if (isMounted) {
          setReels(data);
        }
      } catch (error) {
        console.error("Erro ao carregar Reels:", error);
        if (isMounted) {
          setReels([]);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReels();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="reels-section">
      <div className="reels-container">
        <header className="reels-header">
          <h2 className="reels-title">Acompanhe nossos últimos Reels</h2>
          <p className="reels-subtitle">
            Conteúdo exclusivo sobre marketing, estratégia e crescimento para empresas.
          </p>
        </header>

        {loading ? (
          <div className="reels-carousel reels-carousel--empty" aria-live="polite" aria-label="Carregando Reels">
            <div className="placeholder-card">Carregando Reels...</div>
          </div>
        ) : error ? (
          <div className="reels-carousel reels-carousel--empty" role="status">
            <div className="placeholder-card">Não foi possível carregar os Reels.</div>
          </div>
        ) : (
          <ReelsCarousel reels={reels} />
        )}

        <div className="reels-cta">
          <a
            className="reels-button"
            href="https://www.instagram.com/potencializa__/reels/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir Instagram da Potencializa"
          >
            <span className="reels-button-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
              </svg>
            </span>
            Ver mais Reels no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
