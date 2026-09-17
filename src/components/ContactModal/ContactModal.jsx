import { useEffect, useRef } from "react";
import "./ContactModal.css";
import ContactForm from "../ContactForm/ContactForm.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function ContactModal({ isOpen, onClose }) {
	const { t } = useLanguage();
	const closeButtonRef = useRef(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		closeButtonRef.current?.focus();

		return () => {
			document.body.style.overflow = originalOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="contact-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="contact-modal-title"
		>
			<div className="contact-modal__backdrop" onClick={onClose} aria-hidden="true" />
			<div className="contact-modal__panel">
				<button
					type="button"
					className="contact-modal__close"
					onClick={onClose}
					aria-label={t("Fechar modal de contato")}
					ref={closeButtonRef}
				>
					×
				</button>
				<div className="contact-modal__content">
					<h2 id="contact-modal-title">{t("Fale com um especialista")}</h2>
					<p>{t("Preencha seus dados para iniciar o contato via WhatsApp.")}</p>
					<ContactForm showTitle={false} onSuccess={onClose} />
				</div>
			</div>
		</div>
	);
}

export default ContactModal;
