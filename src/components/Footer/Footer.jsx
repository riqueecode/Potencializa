import "./Footer.css";
import { openWhatsAppLink } from "../../utils/whatsapp.js";

function InstagramIcon() {
	return (
		<svg className="footer__social-icon" viewBox="0 0 24 24" aria-hidden="true">
			<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
			<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
		</svg>
	);
}

function WhatsAppIcon() {
	return (
		<svg className="footer__social-icon" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.4-4.4A8.4 8.4 0 1 1 20.5 11.7Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M9 8.2c.2-.4.5-.4.8-.4h.4c.2 0 .4.1.5.4l.6 1.5c.1.2.1.4 0 .6l-.5.7c.5.9 1.2 1.6 2.1 2.1l.7-.5c.2-.1.4-.1.6 0l1.5.6c.3.1.4.3.4.5v.4c0 .3 0 .6-.4.8-.4.2-1.1.3-1.9 0-1-.4-2.2-1.2-3.2-2.2-1-1-1.8-2.2-2.2-3.2-.3-.8-.2-1.5 0-1.9Z" fill="currentColor" />
		</svg>
	);
}

function Footer({ onOpenContact }) {
	return (
		<footer className="footer" id="footer">
			<div className="container footer__content">
				<div className="footer__brand">
					<h2 className="footer__tag">Criar é o começo. Potencializar é o que nos move.</h2>
				</div>

				<div className="footer__countries">
					<h4>Países de atuação</h4>
					<ul>
						<li>Portugal</li>
						<li>Brasil</li>
						<li>Estados Unidos</li>
					</ul>
				</div>

				<div className="footer__contacts">
					<h4>Contato</h4>
					<ul>
						<li>
							<a href="https://www.instagram.com/potencializa_/" target="_blank" rel="noreferrer">
								<InstagramIcon />
								Instagram
							</a>
						</li>
						<li>
							<button
								type="button"
								className="footer__contact-button"
								onClick={() =>
									openWhatsAppLink({
										message: "Olá, quero falar com a Potencializa sobre uma parceria ou projeto.",
										context: "Footer CTA",
									})
								}
							>
								<WhatsAppIcon />
								WhatsApp
							</button>
						</li>
					</ul>
				</div>
			</div>

			<div className="footer__bar">© {new Date().getFullYear()} Potencializa. Todos os direitos reservados.</div>
		</footer>
	);
}

export default Footer;
