import "./About.css";
import { aboutData } from "../../data/about.js";
import imgDestaque from "../../assets/images/imgDestaque.jpeg";

function About() {
	return (
		<section className="about" id="about" aria-labelledby="about-title">
			<div className="container about__wrapper">
				<div className="about__copy">
					<span className="about__eyebrow">Sobre a Potencializa</span>
					<h2 className="about__title" id="about-title">
						Agência focada em transformar marcas em referências digitais.
					</h2>
					<p className="about__intro">{aboutData.mainDescription}</p>

					<div className="about__sections">
						{aboutData.sections.map((section, idx) => (
							<article key={idx} className="about__item about__item--highlight">
								<h3 className="about__subtitle">{section.subtitle}</h3>
								<p className="about__paragraph">{section.text}</p>
							</article>
						))}

					</div>
				</div>

				<div className="about__visual">
					<img src={imgDestaque} alt="Destaque Potencializa" />
				</div>
			</div>

			<div className="container about__proof-wrap">
				<div className="about__proof">
					<div className="about__years">
						<strong>+ 6 ANOS NO MERCADO</strong>
						<span>E</span>
						<strong>+ 150 CLIENTES</strong>
					</div>

					<div className="about__marquee" aria-hidden>
						<div className="about__marquee-track">
							<span>Automóveis</span>
							<span>Gastronomia</span>
							<span>Esportes</span>
							<span>Crossfit</span>
							<span>Vestuário</span>
							<span>Estética</span>
							<span>Tecnologia</span>
							<span>Podcast</span>
							<span>Automóveis</span>
							<span>Gastronomia</span>
							<span>Esportes</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default About;
