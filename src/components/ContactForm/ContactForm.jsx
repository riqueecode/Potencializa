import { useEffect, useMemo, useState } from "react";
import { openWhatsAppLink } from "../../utils/whatsapp.js";
import "./ContactForm.css";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const SERVICE_OPTIONS = [
	"Design Gráfico",
	"Gestão de tráfego",
	"Captação",
	"Criação de Websites",
	"Criação de Landing page",
	"Pacote Starter",
	"Pacote Premium",
	"Pacote Expert",
	"Plano Start",
	"Plano Potência",
	"Plano Autoridade",
	"Plano Escala",
	"Plano Domínio",
	"Outro",
];

const DEFAULT_PHONE_PLACEHOLDER = "Digite seu telefone";
const PHONE_FOCUS_PLACEHOLDER = "Por favor, escolha o país de origem no campo de localização";

const ISO_REGION_CODES = [
	"AD",
	"AE",
	"AF",
	"AG",
	"AI",
	"AL",
	"AM",
	"AO",
	"AQ",
	"AR",
	"AS",
	"AT",
	"AU",
	"AW",
	"AX",
	"AZ",
	"BA",
	"BB",
	"BD",
	"BE",
	"BF",
	"BG",
	"BH",
	"BI",
	"BJ",
	"BL",
	"BM",
	"BN",
	"BO",
	"BQ",
	"BR",
	"BS",
	"BT",
	"BV",
	"BW",
	"BY",
	"BZ",
	"CA",
	"CC",
	"CD",
	"CF",
	"CG",
	"CH",
	"CI",
	"CK",
	"CL",
	"CM",
	"CN",
	"CO",
	"CR",
	"CU",
	"CV",
	"CW",
	"CX",
	"CY",
	"CZ",
	"DE",
	"DJ",
	"DK",
	"DM",
	"DO",
	"DZ",
	"EC",
	"EE",
	"EG",
	"EH",
	"ER",
	"ES",
	"ET",
	"FI",
	"FJ",
	"FK",
	"FM",
	"FO",
	"FR",
	"GA",
	"GB",
	"GD",
	"GE",
	"GF",
	"GG",
	"GH",
	"GI",
	"GL",
	"GM",
	"GN",
	"GP",
	"GQ",
	"GR",
	"GS",
	"GT",
	"GU",
	"GW",
	"GY",
	"HK",
	"HM",
	"HN",
	"HR",
	"HT",
	"HU",
	"ID",
	"IE",
	"IL",
	"IM",
	"IN",
	"IO",
	"IQ",
	"IR",
	"IS",
	"IT",
	"JE",
	"JM",
	"JO",
	"JP",
	"KE",
	"KG",
	"KH",
	"KI",
	"KM",
	"KN",
	"KP",
	"KR",
	"KW",
	"KY",
	"KZ",
	"LA",
	"LB",
	"LC",
	"LI",
	"LK",
	"LR",
	"LS",
	"LT",
	"LU",
	"LV",
	"LY",
	"MA",
	"MC",
	"MD",
	"ME",
	"MF",
	"MG",
	"MH",
	"MK",
	"ML",
	"MM",
	"MN",
	"MO",
	"MP",
	"MQ",
	"MR",
	"MS",
	"MT",
	"MU",
	"MV",
	"MW",
	"MX",
	"MY",
	"MZ",
	"NA",
	"NC",
	"NE",
	"NF",
	"NG",
	"NI",
	"NL",
	"NO",
	"NP",
	"NR",
	"NU",
	"NZ",
	"OM",
	"PA",
	"PE",
	"PF",
	"PG",
	"PH",
	"PK",
	"PL",
	"PM",
	"PN",
	"PR",
	"PS",
	"PT",
	"PW",
	"PY",
	"QA",
	"RE",
	"RO",
	"RS",
	"RU",
	"RW",
	"SA",
	"SB",
	"SC",
	"SD",
	"SE",
	"SG",
	"SH",
	"SI",
	"SJ",
	"SK",
	"SL",
	"SM",
	"SN",
	"SO",
	"SR",
	"SS",
	"ST",
	"SV",
	"SX",
	"SY",
	"SZ",
	"TC",
	"TD",
	"TF",
	"TG",
	"TH",
	"TJ",
	"TK",
	"TL",
	"TM",
	"TN",
	"TO",
	"TR",
	"TT",
	"TV",
	"TW",
	"TZ",
	"UA",
	"UG",
	"UM",
	"US",
	"UY",
	"UZ",
	"VA",
	"VC",
	"VE",
	"VG",
	"VI",
	"VN",
	"VU",
	"WF",
	"WS",
	"YE",
	"YT",
	"ZA",
	"ZM",
	"ZW",
];

const getCountryCodes = () => {
	if (
		typeof Intl === "undefined" ||
		typeof Intl.supportedValuesOf !== "function"
	) {
		return ISO_REGION_CODES;
	}

	try {
		const values = Intl.supportedValuesOf("region");
		return Array.isArray(values) && values.length ? values : ISO_REGION_CODES;
	} catch {
		return ISO_REGION_CODES;
	}
};

const COUNTRY_CODES = getCountryCodes();
const englishDisplay =
	typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
		? new Intl.DisplayNames(["en"], { type: "region" })
		: null;
const portugueseDisplay =
	typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
		? new Intl.DisplayNames(["pt"], { type: "region" })
		: null;

const COUNTRY_OPTIONS = Array.from(
	new Set(
		COUNTRY_CODES.flatMap((code) => {
			if (englishDisplay && portugueseDisplay) {
				return [englishDisplay.of(code), portugueseDisplay.of(code)].filter(
					Boolean,
				);
			}
			if (englishDisplay) {
				return [englishDisplay.of(code)].filter(Boolean);
			}
			if (portugueseDisplay) {
				return [portugueseDisplay.of(code)].filter(Boolean);
			}
			return [code];
		}),
	),
).sort((a, b) => a.localeCompare(b));

function getPhonePlaceholder(country) {
	const value = country?.trim().toLowerCase();
	if (!value) {
		return DEFAULT_PHONE_PLACEHOLDER;
	}

	if (/(portugal|pt)/i.test(value)) {
		return "+351 912 345 678";
	}
	if (/(brasil|brazil)/i.test(value)) {
		return "+55 91 23456-7890";
	}
	if (/(estados unidos|united states|eua)/i.test(value)) {
		return "+1 202 555 0143";
	}
	if (/(espanha|spain)/i.test(value)) {
		return "+34 612 345 678";
	}
	if (/(frança|france)/i.test(value)) {
		return "+33 6 12 34 56 78";
	}
	if (/(alemanha|germany)/i.test(value)) {
		return "+49 1512 3456789";
	}
	if (/(angola)/i.test(value)) {
		return "+244 923 456 789";
	}
	if (/(moçambique|mozambique)/i.test(value)) {
		return "+258 84 123 4567";
	}
	if (/(canadá|canada)/i.test(value)) {
		return "+1 613 555 0123";
	}
	if (/(reino unido|united kingdom|uk)/i.test(value)) {
		return "+44 7911 123456";
	}
	return "+[código] (XX) XXXXX-XXXX";
}

export default function ContactForm({ onSuccess, showTitle = false }) {
	const { t } = useLanguage();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		country: "",
		service: "",
		message: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [phonePlaceholder, setPhonePlaceholder] = useState(
		DEFAULT_PHONE_PLACEHOLDER,
	);
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setPhonePlaceholder(getPhonePlaceholder(formData.country));
	}, [formData.country]);

	const options = useMemo(() => COUNTRY_OPTIONS, []);

	const validateField = (name, value) => {
		switch (name) {
			case "name":
				return value.trim().length >= 2 ? "" : "Informe um nome válido.";
			case "email":
				return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
					? ""
					: "Informe um e-mail válido.";
			case "phone":
				return value.trim().length >= 7 ? "" : "Informe um telefone válido.";
			case "country":
				return value.trim().length >= 2 ? "" : "Selecione ou informe um país.";
			case "service":
				return value.trim() ? "" : "Selecione um serviço.";
			case "message":
				return value.trim().length <= 500 ? "" : "A mensagem deve ter até 500 caracteres.";
			default:
				return "";
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setFormErrors((prev) => ({
			...prev,
			[name]: "",
		}));
	};

	const handlePhoneFocus = () => {
		if (!formData.country) {
			setPhonePlaceholder(
				t(PHONE_FOCUS_PLACEHOLDER),
			);
		}
	};

	const handlePhoneBlur = () => {
		if (!formData.country) {
			setPhonePlaceholder(DEFAULT_PHONE_PLACEHOLDER);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const nextErrors = Object.keys(formData).reduce((accumulator, field) => {
			const error = validateField(field, formData[field]);
			if (error) {
				accumulator[field] = error;
			}
			return accumulator;
		}, {});

		setFormErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) {
			return;
		}

		setIsSubmitting(true);
		const whatsappText = [
			`Nome: ${formData.name}`,
			`Email: ${formData.email}`,
			`Telefone: ${formData.phone}`,
			`Localização: ${formData.country}`,
			`Serviço: ${formData.service}`,
			`Mensagem: ${formData.message}`,
		].join("\n");
		openWhatsAppLink({
			message: whatsappText,
			context: "Formulário de contato",
		});
		setTimeout(() => {
			setIsSubmitting(false);
			setFormErrors({});
			setConfirmationOpen(true);
			onSuccess?.();
			setFormData({
				name: "",
				email: "",
				phone: "",
				country: "",
				service: "",
				message: "",
			});
			setPhonePlaceholder(DEFAULT_PHONE_PLACEHOLDER);
		}, 100);
	};

	const closeConfirmation = () => {
		setConfirmationOpen(false);
	};

	return (
		<>
			{showTitle && (
				<div className="contact-form__header">
					<h3>{t("Fale com a nossa equipe")}</h3>
					<p>
						{t("Preencha os dados abaixo para receber nosso contato via WhatsApp.")}
					</p>
				</div>
			)}
			<form className="contact-form fade-in-bottom" onSubmit={handleSubmit} noValidate>
				<div className="contact-form__grid">
					<label className="contact-form__field">
						<span>{t("Nome")}</span>
						<input
							required
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder={t("Seu nome ou da sua empresa")}
							aria-invalid={Boolean(formErrors.name)}
						/>
						{formErrors.name && (
							<span className="contact-form__error" role="alert">
								{formErrors.name}
							</span>
						)}
					</label>

					<label className="contact-form__field">
						<span>{t("Email")}</span>
						<input
							required
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder={t("Ex: Minhaempresa@gmail.com")}
							aria-invalid={Boolean(formErrors.email)}
						/>
						{formErrors.email && (
							<span className="contact-form__error" role="alert">
								{formErrors.email}
							</span>
						)}
					</label>

					<label className="contact-form__field">
						<span>{t("Localização")}</span>
						<input
							required
							list="country-list"
							name="country"
							value={formData.country}
							onChange={handleChange}
							placeholder={t("Digite seu país")}
							aria-invalid={Boolean(formErrors.country)}
						/>
						<datalist id="country-list">
							{options.map((country) => (
								<option key={country} value={country} />
							))}
						</datalist>
						{formErrors.country && (
							<span className="contact-form__error" role="alert">
								{formErrors.country}
							</span>
						)}
					</label>

					<label className="contact-form__field">
						<span>{t("Telefone")}</span>
						<input
							required
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							onFocus={handlePhoneFocus}
							onBlur={handlePhoneBlur}
							placeholder={formData.country ? phonePlaceholder : t(phonePlaceholder)}
							aria-invalid={Boolean(formErrors.phone)}
						/>
						{formErrors.phone && (
							<span className="contact-form__error" role="alert">
								{formErrors.phone}
							</span>
						)}
					</label>

					<label className="contact-form__field contact-form__field--full">
						<span>{t("Serviços")}</span>
						<select
							required
							name="service"
							value={formData.service}
							onChange={handleChange}
							aria-invalid={Boolean(formErrors.service)}
						>
							<option value="" disabled>
								{t("Selecione um serviço")}
							</option>
							{SERVICE_OPTIONS.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
						{formErrors.service && (
							<span className="contact-form__error" role="alert">
								{formErrors.service}
							</span>
						)}
					</label>
				</div>

				<label className="contact-form__field contact-form__field--full">
					<span>{t("Mensagem")}</span>
					<textarea
						name="message"
						value={formData.message}
						onChange={handleChange}
						placeholder={t("Nos conte mais sobre seu projeto (Opcional)")}
						rows="5"
						aria-invalid={Boolean(formErrors.message)}
					/>
					{formErrors.message && (
						<span className="contact-form__error" role="alert">
							{formErrors.message}
						</span>
					)}
				</label>

				<button
					type="submit"
					className="btn btn--primary btn--specialist contact-form__submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? t("Enviando...") : t("Enviar")}
				</button>
			</form>

			{confirmationOpen && (
				<div className="contact-form__confirmation">
					<div className="contact-form__confirmation-card">
						<button
							className="contact-form__confirmation-close"
							onClick={closeConfirmation}
							aria-label="Fechar"
						>
							×
						</button>
						<p>
							Muito Obrigado Pelo interesse e tempo prestado conosco, Iremos
							Contactar o mais breve possível. E não se Esqueca: Criar é o
							começo. Potencializar é o que nos move.
						</p>
					</div>
				</div>
			)}
		</>
	);
}
