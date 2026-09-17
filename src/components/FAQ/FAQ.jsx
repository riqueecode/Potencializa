import { useState } from "react";
import "./FAQ.css";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const items = [
	{
		question: "1. Eu tenho vergonha das câmaras. Vai funcionar para mim?",
		answer: "Sim! Esse é exatamente o meu diferencial. Ao ir gravar presencialmente consigo, eu faço a direção de cena. Ajudo-o a relaxar, indico a postura certa, o tom de voz e gravamos por partes. Não precisa de decorar nada, estou lá para facilitar tudo.",
	},
	{
		question: "2. Onde são feitas as gravações?",
		answer: "As gravações são feitas no seu espaço (clínica, escritório, loja, casa). Eu desloco-me até ao seu ambiente de trabalho para que o vídeo passe o máximo de autoridade e reflita a sua marca real.",
	},
	{
		question: "3. Vocês criam mesmo o que eu vou dizer?",
		answer: "Sim. Graças à minha formação em marketing e guiões virais, eu estudo o seu nicho e levo os roteiros totalmente prontos para o dia da gravação. Você apenas lê, aprova e gravamos.",
	},
	{
		question: "4. E se eu já gravar sozinho e quiser apenas a edição?",
		answer: "Também fazemos! O valor para vídeos unitários (apenas edição) é de 60€. Basta enviar o material bruto antes para eu analisar a viabilidade e garantir o padrão Potencializa de qualidade.",
	},
	{
		question: "5. Em quanto tempo recebo os vídeos prontos?",
		answer: "Após o dia da nossa gravação, entrego os vídeos 100% editados e prontos a publicar num prazo máximo de 3 dias úteis.",
	},
	{
		question: "6. E se eu não gostar de algum detalhe da edição?",
		answer: "Sem problema. O meu objetivo é que o vídeo fique perfeito e com a identidade da sua marca. Tem direito a pedir ajustes pontuais até ficar 100% satisfeito.",
	},
];

function FAQ() {
	const [openIndex, setOpenIndex] = useState(null);
	const { t } = useLanguage();

	return (
		<section className="faq" id="faq" aria-labelledby="faq-title">
			<div className="container">
				<div className="section-heading">
					<span className="section-kicker">{t("Dúvidas Frequentes (FAQ)")}</span>
					<h2 id="faq-title">{t("As perguntas que todos fazem.")}</h2>
				</div>

				<div className="faq__list">
					{items.map((item, index) => {
						const isOpen = openIndex === index;
						return (
							<article key={item.question} className={`faq__item scroll-highlight${isOpen ? " is-open" : ""}`}>
								<h3>
									<button
										type="button"
										className="faq__question"
										aria-expanded={isOpen}
										onClick={() => setOpenIndex(isOpen ? null : index)}
									>
										<span>{t(item.question)}</span>
										<span className="faq__icon" aria-hidden="true">+</span>
									</button>
								</h3>
								<div className="faq__answer" hidden={!isOpen}>
									<p>{t(item.answer)}</p>
								</div>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default FAQ;
