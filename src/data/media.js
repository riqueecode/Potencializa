import imgDestaque from "../assets/images/imgDestaque.jpeg";
import imgEscuro from "../assets/images/imgEscuro.jpg";
import imgProfile from "../assets/images/imgProfile.jpeg";
import imgWhite from "../assets/images/imgwhite.jpeg";

const portfolioVideos = import.meta.glob("../assets/VideoPortfolios/*.mp4", {
  eager: true,
  import: "default",
  query: "?url",
});

const testimonialVideos = import.meta.glob("../assets/Depoimentos/*.mp4", {
  eager: true,
  import: "default",
  query: "?url",
});

const getVideoFiles = (videos) => Object.entries(videos).sort(([pathA], [pathB]) => pathA.localeCompare(pathB));
const getVideoType = (video) => (video.toLowerCase().endsWith(".mp4") ? "video/mp4" : "video/quicktime");

export const mediaCatalog = {
  vsl: {
    id: "vsl-fundadora",
    kind: "video",
    title: "VSL da fundadora",
    source: null,
    poster: null,
    status: "pending",
    description: "Vídeo principal da landing page. Substituir quando o arquivo real for enviado.",
  },
  reels: {
    source: "local",
    kind: "video_collection",
    items: getVideoFiles(portfolioVideos).map(([path, video], index) => ({
      id: `portfolio-${index + 1}`,
      title: `Vídeo de portfólio ${index + 1}`,
      video,
      videoType: getVideoType(video),
    })),
  },
  testimonials: {
    kind: "video_collection",
    items: getVideoFiles(testimonialVideos).map(([path, video], index) => ({
      id: `testimonial-${index + 1}`,
      title: `Depoimento ${index + 1}`,
      video,
      videoType: getVideoType(video),
    })),
  },
  storymaker: {
    kind: "video_collection",
    items: [],
    status: "pending",
  },
};
