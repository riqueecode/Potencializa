import "./VideoPackages.css";
import videoPackages from "../../data/videoPackages.js";

function VideoPackages({ onOpenContact }) {
	return (
		<section
			id="video-packages"
			className="video-packages"
			aria-labelledby="video-packages-title"
		>
			<div className="container video-packages__wrapper">
				<div className="video-packages__header">
					<span className="video-packages__eyebrow">Pacotes de Vídeo</span>
					<h2 className="video-packages__title" id="video-packages-title">
						Produção audiovisual que potencializa campanhas e redes sociais.
					</h2>
					<p className="video-packages__description">
						Escolha o pacote ideal para ativar sua marca em formatos que geram
						atenção, engajamento e conversão.
					</p>
				</div>

				<div className="video-packages__grid">
					{videoPackages.map((pack) => (
						<article key={pack.id} className="video-package-card scroll-highlight">
							<h2 className="video-package-card__name">{pack.name}</h2>
							<p className="video-package-card__text">{pack.description}</p>
							<ul className="video-package-card__list">
								{pack.benefits.map((benefit, index) => (
									<li key={index}>{benefit}</li>
								))}
							</ul>
							<button
								type="button"
								className="btn btn--ghost"
								onClick={onOpenContact}
							>
								{pack.cta}
							</button>
						</article>
					))}
				</div>

				<div className="video-packages__extras">
					<div className="video-packages__extra-item">
						<div className="video-packages__marquee video-packages__marquee--left" aria-label="E ainda temos">
							<div className="video-packages__marquee-track">
								<h2>E ainda temos</h2>
								<h2 aria-hidden="true">E ainda temos</h2>
							</div>
						</div>
						<div className="video-packages__marquee video-packages__marquee--right" aria-label="Captação em real time">
							<div className="video-packages__marquee-track">
								<h3>Captação em real time</h3>
								<h3 aria-hidden="true">Captação em real time</h3>
							</div>
						</div>
						<p>Você que é empresário e precisa de cobertura no seu evento, Temos o que precisa.</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default VideoPackages;
