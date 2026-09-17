import "./Storymaker.css";
import storymakerImage from "../../assets/images/imgDestaque.jpeg";
import { openWhatsAppLink } from "../../utils/whatsapp.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function Storymaker() {
	const { t } = useLanguage();
	const handleContactClick = () => openWhatsAppLink({ message: "Olá, quero um Storymaker para o meu próximo evento.", context: "Storymaker section" });
	return <section className="storymaker" id="storymaker" aria-labelledby="storymaker-title"><div className="container storymaker__wrapper"><div className="storymaker__media scroll-highlight"><img src={storymakerImage} alt={t("Bastidores de uma produção Potencializa")} /></div><div className="storymaker__content"><span className="section-kicker">{t("Storymaker")}</span><h2 id="storymaker-title">{t("Vai realizar ou participar num evento? Seremos os seus olhos e a sua câmera")}</h2><p className="storymaker__lead">{t("O serviço premium de Storymaker exclusivo para empresários que não podem perder tempo a segurar no telemóvel.")}</p><div className="storymaker__copy"><p>{t("Se vai dar uma palestra, organizar um evento, participar numa feira ou fazer o lançamento da sua marca, o seu único foco deve ser viver o momento e fazer networking.")}</p><p>{t("O resto é comigo. Com o serviço de Storymaker, acompanho-o presencialmente e atuo como a sua sombra estratégica:")}</p></div><ul className="storymaker__list"><li>{t("Capto os bastidores e os momentos-chave em tempo real.")}</li><li>{t("Gravo conteúdos dinâmicos para os Stories e para o Feed com um olhar cinematográfico.")}</li><li>{t("Transmito a energia e a autoridade do seu evento para quem está a ver de casa, enquanto tudo acontece.")}</li></ul><p className="storymaker__closing">{t("Não deixe que o seu maior evento passe em branco nas redes sociais.")}</p><button type="button" className="btn storymaker__cta" onClick={handleContactClick}>{t("Quero um Storymaker para o meu próximo evento")}</button></div></div></section>;
}

export default Storymaker;
