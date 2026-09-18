import imgDestaque from "../assets/images/imgDestaque.jpeg";
import imgEscuro from "../assets/images/imgEscuro.jpg";
import imgWhite from "../assets/images/imgwhite.jpeg";

const portfolioPosterFiles = import.meta.glob("../assets/VideoPortfolios/posters/*.jpg", {
  eager: true,
  import: "default",
});
const testimonialPosterFiles = import.meta.glob("../assets/Depoimentos/posters/*.jpg", {
  eager: true,
  import: "default",
});

const normalizePosterKey = (value = "") => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/\.[^.]+$/, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const buildPosterLookup = (posterFiles) => Object.fromEntries(
  Object.entries(posterFiles).map(([path, url]) => {
    const fileName = path.split("/").pop();
    return [normalizePosterKey(fileName), url];
  })
);

const portfolioPosterLookup = buildPosterLookup(portfolioPosterFiles);
const testimonialPosterLookup = buildPosterLookup(testimonialPosterFiles);

const resolvePosterForVideo = (videoPath, posterLookup) => {
  const fileName = videoPath.split("/").pop();
  const normalized = normalizePosterKey(fileName);
  return posterLookup[normalized] || null;
};

const portfolioVideos = import.meta.glob("../assets/VideoPortfolios/*.{mp4,mov}", {
  eager: true,
  import: "default",
  query: "?url",
});

const testimonialVideos = import.meta.glob("../assets/Depoimentos/*.{mp4,mov}", {
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
      poster: resolvePosterForVideo(path, portfolioPosterLookup),
      videoType: getVideoType(video),
    })),
  },
  testimonials: {
    kind: "video_collection",
    items: getVideoFiles(testimonialVideos).map(([path, video], index) => {
      const poster = resolvePosterForVideo(path, testimonialPosterLookup);

      return {
        id: `testimonial-${index + 1}`,
        title: `Depoimento ${index + 1}`,
        video,
        poster,
        videoType: getVideoType(video),
      };
    }),
  },
  storymaker: {
    kind: "video_collection",
    items: [],
    status: "pending",
  },
};
