import "./Hero.css";
import { openWhatsAppLink } from "../../utils/whatsapp.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const quickAccessCards = [
	{ label: "Produção de Vídeos", href: "#como-funciona" },
	{ label: "Storymaker", href: "#storymaker" },
	{ label: "Agência Completa", href: "#ecossistema" },
];

function Hero() {
	const { t } = useLanguage();
	const handleWhatsAppClick = () => {
		openWhatsAppLink({
			message: "Olá, quero saber mais sobre a produção audiovisual da Potencializa.",
			context: "Hero CTA",
		});
	};

	return (
		<section className="hero" id="home" aria-label="Apresentação principal">
			<div className="container hero__inner">
				<div className="hero__copy hero__copy--new">
					<h1 className="hero__headline-new">
						{t("Eu crio o roteiro, vou até si gravar e entrego o vídeo pronto.")}
					</h1>
					<p className="hero__lead-new">{t("Produção de conteúdo de alta qualidade de ponta a ponta.")}</p>
					<p className="hero__description-new">{t("Não se preocupe com o que dizer, nem como gravar ou editar. A Potencializa cuida de tudo e entrega os seus vídeos prontos em até 3 dias úteis.")}</p>
					<div className="hero__actions">
						<a className="btn btn--primary hero__action hero__action--plans" href="#plans">
							{t("Quero Potencializar os meus vídeos")}
						</a>
						<button type="button" className="btn btn--ghost hero__action hero__action--contact" onClick={handleWhatsAppClick}>
							{t("FALAR CONOSCO")}
						</button>
					</div>
					<div className="hero__assurances" aria-label="Benefícios da Potencializa">
						<div>{t("Pronto em 3 dias úteis")}</div>
						<div>{t("Sem fidelidade")}</div>
					</div>
				</div>
				<div className="hero__copy" aria-hidden="true">
					<p className="hero__eyebrow">Produção audiovisual que vende</p>
					<h1 className="hero__headline">
						Muita estratégia.
						<span className="hero__headline--strong">Muito vídeo. Resultado real.</span>
					</h1>
					<p className="hero__lead">
						A Potencializa transforma ideias em vídeos que conectam marca, geram autoridade e movem pessoas a agir.
					</p>
					<p className="hero__description">
						Planejamento, gravação, edição e entrega em uma estrutura pensada para marcas que querem presença premium e conteúdo que converte.
					</p>

					<div className="hero__actions">
						<a className="btn btn--primary hero__action" href="#plans">
							Ver planos
						</a>
						<button type="button" className="btn btn--ghost hero__action" onClick={handleWhatsAppClick}>
							Falar no WhatsApp
						</button>
					</div>
				</div>

				<aside className="hero__visual" aria-label="Video Short Lead (placeholder)">
					<div className="hero__video-card" role="img" aria-label="Placeholder do VSL da fundadora">
						<div className="hero__video-placeholder">
							<div className="hero__play-button" aria-hidden="true">
								▶
							</div>
						</div>
						<div className="hero__video-meta">
							<span className="hero__video-tag">VSL</span>
							<p>Vídeo da fundadora em preparação</p>
						</div>
					</div>
				</aside>
			</div>

			<div className="container hero__quick-access" aria-label="Acesso rápido">
				{quickAccessCards.filter((item) => item.href !== "#ecossistema").map((item) => (
					<a key={item.label} href={item.href} className="hero__quick-card">
						<span>{t(item.label)}</span>
					</a>
				))}
			</div>
		</section>
	);
}

export default Hero;
