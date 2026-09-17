import "./Benefits.css";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const benefits = [
	{
		id: "creative-block",
		title: "Fim do bloqueio criativo:",
		text: "Não sabe o que gravar? Eu tenho formações em marketing e formatos virais. Crio os guiões e roteiros exatos para o seu nicho.",
		icon: "✦",
	},
	{
		id: "no-stress",
		title: "Gravação sem stress:",
		text: "Nada de tentar equilibrar o telemóvel na janela. Eu vou até si com o olhar clínico de quem já gravou dezenas de nichos diferentes e dirijo a sua gravação.",
		icon: "◎",
	},
	{
		id: "quality-sells",
		title: "Qualidade que vende:",
		text: "Legendas magnéticas, cortes precisos, som limpo e imagem profissional. O seu conteúdo vai destacar-se da concorrência e prender a atenção logo nos primeiros 3 segundos.",
		icon: "▣",
	},
];

function Benefits() {
	const { t } = useLanguage();
	return (
		<section className="benefits" id="beneficios" aria-labelledby="beneficios-title">
			<div className="container">
				<div className="section-heading">
					<h2 id="beneficios-title">
						{t("Mais clareza.")} <span className="benefits__presence-label">{t("Mais presença")}</span>
						<br />
						{t("Mais resultados.")}
					</h2>
				</div>

				<div className="benefits__grid">
					{benefits.map((benefit) => (
						<article key={benefit.id} className="benefit-card scroll-highlight">
							<div className="benefit-card__icon" aria-hidden="true">{benefit.icon}</div>
							<h3>{t(benefit.title)}</h3>
							<p>{t(benefit.text)}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default Benefits;
