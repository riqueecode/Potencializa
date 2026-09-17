import { useEffect, useState } from "react";
import "./Navbar.css";
import logoDark from "../../../assets/imgEscuro.jpeg";
import logoWhite from "../../../assets/imgWhiteBlack.jpg";
import logoOrange from "../../../assets/imgOrange.jpg";
import flagPortugal from "flag-icons/flags/4x3/pt.svg";
import flagUnitedStates from "flag-icons/flags/4x3/us.svg";
import flagSpain from "flag-icons/flags/4x3/es.svg";
import flagFrance from "flag-icons/flags/4x3/fr.svg";
import flagGermany from "flag-icons/flags/4x3/de.svg";
import { navigationItems } from "../../data/navigation.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function Navbar({ onOpenContact }) {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [theme, setTheme] = useState("dark");
	const { language, setLanguage, languages, t } = useLanguage();
	const languageOptions = [
		{ code: "pt", flag: flagPortugal },
		{ code: "en", flag: flagUnitedStates },
		{ code: "es", flag: flagSpain },
		{ code: "fr", flag: flagFrance },
		{ code: "de", flag: flagGermany },
	];

	useEffect(() => {
		const updateNavbar = () => {
			setScrolled(window.scrollY > 20);

			const plans = document.getElementById("plans");
			const contact = document.getElementById("contact");
			const marker = window.scrollY + 88;
			const nextTheme =
				contact && marker >= contact.offsetTop
					? "contact"
					: plans && marker >= plans.offsetTop
						? "light"
						: "dark";

			setTheme(nextTheme);
		};

		updateNavbar();
		window.addEventListener("scroll", updateNavbar, { passive: true });
		window.addEventListener("resize", updateNavbar);
		return () => {
			window.removeEventListener("scroll", updateNavbar);
			window.removeEventListener("resize", updateNavbar);
		};
	}, []);

	const closeMenu = () => setOpen(false);
	const openContactFromMenu = () => {
		closeMenu();
		onOpenContact?.();
	};
	return (
		<header className={`navbar navbar--theme-${theme} ${scrolled ? "navbar--scrolled" : ""}`} id="top">
			<div className="container navbar__content">
				<a
					href="#top"
					className="navbar__brand"
					aria-label="Potencializa - Início"
				>
					<span className="navbar__brand-logo" aria-hidden="true">
						<img className="navbar__brand-logo-image navbar__brand-logo-image--dark" src={logoDark} alt="" />
						<img className="navbar__brand-logo-image navbar__brand-logo-image--light" src={logoWhite} alt="" />
						<img className="navbar__brand-logo-image navbar__brand-logo-image--contact" src={logoOrange} alt="" />
					</span>
					<span>Potencializa</span>
				</a>

				<nav
					className={`navbar__nav ${open ? "is-open" : ""}`}
					aria-label={t("Menu principal")}
				>
					<ul>
						{navigationItems.map((item) => (
							<li key={item.href}>
								<a href={item.href} onClick={closeMenu}>{t(item.label)}</a>
							</li>
						))}
					</ul>
					{onOpenContact && (
						<button
							type="button"
							className="btn btn--transparent navbar__menu-contact-button"
							onClick={openContactFromMenu}
						>
							{t("Falar com especialista")}
						</button>
					)}
					<div className="navbar__language-options navbar__language-options--interactive" aria-label="Available languages">
						{languageOptions.map(({ code, flag }) => (
							<button
								key={code}
								type="button"
								className={`navbar__language-option${language === code ? " is-active" : ""}`}
								onClick={() => setLanguage(code)}
								aria-label={languages[code].label}
								title={languages[code].label}
								aria-pressed={language === code}
							>
								<img src={flag} alt="" />
							</button>
						))}
					</div>
				</nav>

				<div className="navbar__actions">
					{onOpenContact && (
						<button
							type="button"
							className="btn btn--transparent navbar__contact-button"
							onClick={onOpenContact}
						>
							{t("Falar com especialista")}
						</button>
					)}
					<div className="navbar__language-options" aria-label="Idiomas disponíveis">
						<span className="navbar__language-option" role="img" aria-label="Português" title="Português"><img src={flagPortugal} alt="" /></span>
						<span className="navbar__language-option" role="img" aria-label="English" title="English"><img src={flagUnitedStates} alt="" /></span>
						<span className="navbar__language-option" role="img" aria-label="Español" title="Español"><img src={flagSpain} alt="" /></span>
						<span className="navbar__language-option" role="img" aria-label="Français" title="Français"><img src={flagFrance} alt="" /></span>
					</div>
				</div>

				<button
					className={`navbar__toggle ${open ? "is-active" : ""}`}
					aria-expanded={open}
					aria-label={t(open ? "Fechar menu" : "Abrir menu")}
					onClick={() => setOpen((currentOpen) => !currentOpen)}
				>
					<span />
					<span />
					<span />
				</button>
			</div>

			<div
				className={`navbar__overlay ${open ? "is-active" : ""}`}
				onClick={closeMenu}
				aria-hidden={!open}
			/>
		</header>
	);
}

export default Navbar;
