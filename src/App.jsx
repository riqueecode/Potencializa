import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Reels from "./components/Reels/Reels.jsx";
import Benefits from "./components/Benefits/Benefits.jsx";
import HowItWorks from "./components/HowItWorks/HowItWorks.jsx";
import Included from "./components/Included/Included.jsx";
import SocialProof from "./components/SocialProof/SocialProof.jsx";
import Plans from "./components/Plans/Plans.jsx";
import Storymaker from "./components/Storymaker/Storymaker.jsx";
import Authority from "./components/Authority/Authority.jsx";
import FAQ from "./components/FAQ/FAQ.jsx";
import CTA from "./components/CTA/CTA.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ContactModal from "./components/ContactModal/ContactModal.jsx";
import "./styles/theme-overrides.css";

function App() {
	const [isContactOpen, setContactOpen] = useState(false);

	useEffect(() => {
		const cards = document.querySelectorAll(".scroll-highlight");
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-highlighted");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2 }
		);

		cards.forEach((card) => observer.observe(card));
		return () => observer.disconnect();
	}, []);

	const openContact = () => setContactOpen(true);
	const closeContact = () => setContactOpen(false);

	return (
		<div className="app-root">
				<Navbar onOpenContact={openContact} />
				<main>
					<Hero onOpenContact={openContact} />
					<Reels />
					<Benefits />
					<HowItWorks />
					<Included />
					<SocialProof />
					<Plans onOpenContact={openContact} />
					<Storymaker />
					<Authority />
					<FAQ />
					<CTA />
				</main>
				<Footer onOpenContact={openContact} />
				<ContactModal isOpen={isContactOpen} onClose={closeContact} />
		</div>
	);
}

export default App;
