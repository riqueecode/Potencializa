import "./CTA.css";
import ContactForm from "../ContactForm/ContactForm.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function CTA() {
	const { t } = useLanguage();
	return (
		<section
			className="cta"
			id="contact"
			aria-labelledby="cta-title"
		>
			<div className="container cta__content">
				<div className="cta__copy">
					<h2 className="cta__title" id="cta-title">
						{t("Pronto para impulsionar sua marca com autoridade?")}
					</h2>
					<h4 className="cta__subtitle">{t("Conecte-se com nosso time de especialistas e acelere conversões com campanhas inteligentes e conteúdo de Impacto")}</h4>
				</div>

				<div className="cta__form-wrap">
					<ContactForm />
				</div>
			</div>
		</section>
	);
}

export default CTA;
