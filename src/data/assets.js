import logo from "../assets/images/logo.svg";
import profile from "../assets/images/imgProfile.jpeg";
import highlight from "../assets/images/imgDestaque.jpeg";
import dark from "../assets/images/imgEscuro.jpg";

export const assetStructure = {
  images: {
    logo,
    profile,
    highlight,
    dark,
  },
  videos: {
    vsl: {
      status: "pending",
      path: null,
      description: "Vídeo principal da landing page",
    },
    reels: {
      status: "pending",
      path: null,
      description: "Coleção de Reels da conta Instagram",
    },
    testimonials: {
      status: "pending",
      path: null,
      description: "Depoimentos e entrevistas",
    },
    storymaker: {
      status: "pending",
      path: null,
      description: "Vídeos de Storymaker e case studies",
    },
  },
  notes: {
    instructions: "Substituir somente quando os arquivos reais forem recebidos pela empresa. Não inventar imagens ou vídeos inexistentes.",
  },
};
