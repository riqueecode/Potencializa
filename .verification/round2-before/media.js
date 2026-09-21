import imgDestaque from "../assets/images/imgDestaque.jpeg";
import imgEscuro from "../assets/images/imgEscuro.jpg";
import imgWhite from "../assets/images/imgwhite.jpeg";
import elaineVideo from "../assets/Depoimentos/depoimento-elaine.mp4?url";
import repairedVideo4 from "../assets/VideoPortfolios/web/portfolio-video4-web.mp4?url";

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

const portfolioVideos = import.meta.glob([
  "../assets/VideoPortfolios/*.mp4",
  "!../assets/VideoPortfolios/Depoimento Edilaine .mp4",
  "!../assets/VideoPortfolios/Depoimento Elaine .mp4",
  "!../assets/VideoPortfolios/portfolio-2.mp4",
], {
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
const getVideoType = () => "video/mp4";

// Original positions captured before removal. IDs are tied to files, never to
// the current array index. Keep new encodes in web/ so they cannot add slides.
const portfolioManifest = [
  ["portfolio-1", "copy_03E91B91-0B23-455A-84CB-C080C092C19B.mp4", "copy-original"],
  // Original portfolio-2 (Depoimento Edilaine .mp4) removed only here.
  ["portfolio-3", "Depoimento Elaine .mp4", "depoimento-elaine", elaineVideo],
  ["portfolio-4", "portfolio-1.mp4", "portfolio-1"],
  ["portfolio-5", "portfolio-2.mp4", "portfolio-2", repairedVideo4],
  ["portfolio-6", "portfolio-3.mp4", "portfolio-3"],
  ["portfolio-7", "portfolio-4.mp4", "portfolio-4"],
  ["portfolio-8", "portfolio-5.mp4", "portfolio-5"],
  ["portfolio-9", "portfolio-6.mp4", "portfolio-6"],
  ["portfolio-10", "Vídeo 1 .mp4", "video-1"],
  ["portfolio-11", "Vídeo 2.mp4", "video-2"],
  ["portfolio-12", "Vídeo 3 .mp4", "video-3"],
  ["portfolio-13", "Vídeo 6 .mp4", "video-6"],
  ["portfolio-14", "Vídeo 8 mp4.mp4", "video-8"],
];

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
    items: portfolioManifest.map(([id, file, posterKey, repairedSource]) => ({
      id,
      title: `Vídeo de portfólio ${id.replace("portfolio-", "")}`,
      video: repairedSource || portfolioVideos[`../assets/VideoPortfolios/${file}`],
      poster: portfolioPosterLookup[posterKey],
      videoType: "video/mp4",
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
