import "./Included.css";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const included = [
	{
		id: "scripts",
		title: "Roteiros Estratégicos",
		description: "Textos pensados para reter a atenção e converter seguidores em clientes.",
		icon: "✓",
	},
	{
		id: "direction",
		title: "Direção de Gravação",
		description: "Ajudo-o com a postura, tom de voz e naturalidade em frente às câmaras.",
		icon: "✓",
	},
	{
		id: "captions",
		title: "Legendas que prendem",
		description: "As palavras aparecem no ecrã no ritmo certo, com cores e fontes que combinam com a sua marca.",
		icon: "✓",
	},
	{
		id: "audio-visual",
		title: "Som limpo e Imagem tratada",
		description: "Remoção de ruídos de fundo e correção de luz e cor.",
		icon: "✓",
	},
	{
		id: "b-roll",
		title: "Imagens extra (B-rolls)",
		description: "Adicionamos cenas com direitos pagos para ilustrar o que está a dizer e manter o vídeo dinâmico.",
		icon: "✓",
	},
	{
		id: "support",
		title: "Atendimento Direto",
		description: "Fala diretamente comigo no WhatsApp. Sem robôs, sem intermediários.",
		icon: "✓",
	},
];

function Included() {
	const { t } = useLanguage();
	return (
		<section className="included" id="incluido" aria-labelledby="incluido-title">
			<div className="container">
				<div className="section-heading">
					<span className="section-kicker">{t("O que está incluído no preço")}</span>
					<h2 id="incluido-title">{t("Tudo o que precisa para um vídeo profissional. Sem custos surpresa.")}</h2>
				</div>

				<ul className="included__list">
					{included.map((item) => (
						<li key={item.id} className="included__item scroll-highlight">
							<div className="included__icon" aria-hidden="true">{item.icon}</div>
							<div>
								<h3>{t(item.title)}</h3>
								<p>{t(item.description)}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default Included;
