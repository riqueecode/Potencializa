import "./Results.css";
import results from "../../data/results.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function Results() {
  const { t } = useLanguage();
  return (
    <section className="results" id="results" aria-labelledby="results-title">
      <div className="container results__wrapper">
        <div className="results__header">
          <span className="results__eyebrow">{t("Resultados")}</span>
          <h2 className="results__title" id="results-title">
            {t("Métricas que comprovam crescimento real.")}
          </h2>
          <p className="results__description">
            {t("Trabalhamos para gerar resultados mensuráveis com impacto direto no reconhecimento e nas conversões de seus projetos.")}
          </p>
        </div>

        <div className="results__grid">
          {results.map((item) => (
            <article key={item.id} className="results-card">
              <strong className="results-card__value">{item.value}</strong>
              <p className="results-card__label">{t(item.label)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Results;
