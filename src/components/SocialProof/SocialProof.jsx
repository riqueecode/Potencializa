import "./SocialProof.css";
import ReelsCarousel from "../Reels/ReelsCarousel.jsx";
import { mediaCatalog } from "../../data/media.js";

function SocialProof() {
	const reels = mediaCatalog.reels.items;
	const testimonialReels = mediaCatalog.testimonials.items;
	const screenshots = [
		{ id: "screen-1", label: "Print de conversa 1", placeholder: "Print do WhatsApp em preparação" },
		{ id: "screen-2", label: "Print de conversa 2", placeholder: "Print do WhatsApp em preparação" },
		{ id: "screen-3", label: "Print de conversa 3", placeholder: "Print do WhatsApp em preparação" },
	];

	return (
		<section className="social-proof" id="prova-social" aria-labelledby="prova-social-title">
			<div className="container social-proof__container">
				<div className="section-heading">
					<span className="section-kicker">Prova social</span>
					<h2 id="prova-social-title">Trabalho real, marca forte e conteúdo que sustenta a percepção de valor.</h2>
				</div>

				<div className="social-proof__group">
					<div className="social-proof__panel social-proof__panel--reels">
						<h3>Portfólio de vídeos</h3>
						<ReelsCarousel reels={reels} />
					</div>

					<div className="social-proof__panel">
						<h3>Prints de WhatsApp</h3>
						<div className="social-proof__screenshots reels-carousel" aria-label="Galeria de prints de WhatsApp">
							<div className="social-proof__screenshots-track reels-carousel-track" role="list">
							{screenshots.map((item) => (
								<article key={item.id} className="social-proof__screenshot reels-carousel-card" role="listitem" aria-label={item.label} />
							))}
							</div>
						</div>
					</div>

					<div className="social-proof__panel social-proof__panel--reels social-proof__panel--testimonials">
						<h3>Depoimentos em vídeo</h3>
						<ReelsCarousel reels={testimonialReels} />
					</div>
				</div>
			</div>
		</section>
	);
}

export default SocialProof;
