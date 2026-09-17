import "./Plans.css";
import { openWhatsAppLink } from "../../utils/whatsapp.js";
import plans from "../../data/plans.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function Plans() {
	const { t } = useLanguage();
	const handlePlanClick = (plan) => {
		openWhatsAppLink({
			plan: plan.title,
			message: `Olá, quero saber mais sobre o plano ${plan.title}.`,
			context: "Plans section",
		});
	};

	const handleEditingClick = () => {
		openWhatsAppLink({
			message: "Olá, quero apenas o serviço de edição premium.",
			context: "Plans editing service",
		});
	};

	return (
		<section className="plans" id="plans" aria-labelledby="plans-title">
			<div className="container plans__wrapper">
				<div className="plans__header">
					<span className="plans__eyebrow">{t("Planos e Pacotes")}</span>
					<h2 className="plans__title" id="plans-title">{t("Escolha o plano ideal para a sua estratégia de conteúdo.")}</h2>
					<p className="plans__description">{t("Todos os pacotes mensais incluem: Roteiro, Gravação Presencial, Edição completa e Entrega em 3 dias úteis.")}</p>
				</div>

				<div className="plans__grid">
					{plans.map((plan) => (
						<article key={plan.id} className={`plan-card scroll-highlight${plan.featured ? " plan-card--featured" : ""}`}>
							{plan.featured && <span className="plan-card__badge">{t("Mais Escolhido")}</span>}
							<div className="plan-card__topline">
								<h3 className="plan-card__tag">{t(plan.title)}</h3>
								<span className="plan-card__subtitle">{t(plan.subtitle)}</span>
							</div>
							<p className="plan-card__highlight">{plan.highlight}</p>
							<ul className="plan-card__features">
								{plan.features.map((feature) => <li key={`${plan.id}-${feature}`}>{t(feature)}</li>)}
							</ul>
							<button type="button" className={`btn ${plan.featured ? "btn--primary" : "btn--ghost btn--transparent btn--sharp btn--specialist"}`} onClick={() => handlePlanClick(plan)}>{t(plan.cta)}</button>
						</article>
					))}
				</div>

				<aside className="plans__editing scroll-highlight" aria-labelledby="plans-editing-title">
					<div>
						<h3 id="plans-editing-title">{t("Precisa apenas da edição?")}</h3>
						<p>{t("Se já grava os seus próprios vídeos e quer apenas a nossa edição premium, fazemos edições unitárias por 60€/vídeo.")}</p>
						<small>{t("O material bruto deve ser enviado previamente para análise técnica.")}</small>
					</div>
					<button type="button" className="btn btn--primary plans__editing-button" onClick={handleEditingClick}>{t("Quero apenas o serviço de edição")}</button>
				</aside>
			</div>
		</section>
	);
}

export default Plans;
