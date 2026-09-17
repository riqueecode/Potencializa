import "./HowItWorks.css";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const steps = [
	{
		id: "strategy",
		title: "Estratégia e Roteiro",
		text: "Analisamos o seu objetivo e eu crio os roteiros altamente persuasivos e virais. Você só tem de aprovar.",
	},
	{
		id: "recording",
		title: "A Gravação (Eu vou até si)",
		text: "Marcamos o dia, eu vou ao seu espaço físico, ajusto o ambiente, dirijo a cena para ficar confortável e gravamos tudo com alta qualidade.",
	},
	{
		id: "editing",
		title: "A Magia da Edição",
		text: "Pego em todo o material gravado, levo para a ilha de edição e aplico retenção pura: cortes, legendas, efeitos e correção de cor.",
	},
	{
		id: "delivery",
		title: "Vídeos na sua mão",
		text: "Em até 3 dias úteis após a gravação, os seus vídeos estão prontos numa pasta do Google Drive. É só descarregar e publicar.",
	},
];

function HowItWorks() {
	const { t } = useLanguage();
	return (
		<section className="how-it-works" id="como-funciona" aria-labelledby="como-funciona-title">
			<div className="container">
				<div className="section-heading">
					<span className="section-kicker">{t("Como funciona")}</span>
					<h2 id="como-funciona-title">{t("São apenas 4 passos para o conteúdo perfeito.")}</h2>
				</div>

				<div className="how-it-works__grid">
					{steps.map((step, index) => (
						<article key={step.id} className="how-step scroll-highlight">
							<div className="how-step__header">
								<span className="how-step__number">0{index + 1}</span>
								<span className="how-step__line" aria-hidden="true" />
							</div>
							<h3>{t(step.title)}</h3>
							<p>{t(step.text)}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default HowItWorks;
