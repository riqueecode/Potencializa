import { useEffect, useRef, useState } from "react";
import "./ReelsCarousel.css";

export default function ReelsCarousel({ reels = [] }) {
  const trackRef = useRef(null);
  const videoRefs = useRef(new Map());
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const updateFocusedReel = () => {
    const track = trackRef.current;
    if (!track) return;

    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
    const cards = Array.from(track.querySelectorAll(".reels-carousel-card"));
    const nearestCard = cards.reduce((closest, card, index) => {
      const bounds = card.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - trackCenter);
      return !closest || distance < closest.distance ? { index, distance } : closest;
    }, null);

    if (nearestCard) setFocusedIndex(nearestCard.index);
  };

  useEffect(() => {
    updateFocusedReel();
    window.addEventListener("resize", updateFocusedReel);
    const closeExpandedVideo = (event) => {
      if (event.key === "Escape") setExpandedIndex(null);
    };
    window.addEventListener("keydown", closeExpandedVideo);
    return () => {
      window.removeEventListener("resize", updateFocusedReel);
      window.removeEventListener("keydown", closeExpandedVideo);
    };
  }, []);

  const handlePointerDown = (event) => {
    if (event.pointerType === "touch") return;
    if (event.target.closest("button, a, video")) return;
    const track = trackRef.current;
    if (!track) return;

    dragStart.current = { x: event.clientX, scrollLeft: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || !trackRef.current) return;
    trackRef.current.scrollLeft = dragStart.current.scrollLeft - (event.clientX - dragStart.current.x);
  };

  const stopDragging = (event) => {
    const track = trackRef.current;
    if (!isDragging || !track) return;

    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  };

  const playReel = (index) => {
    const video = videoRefs.current.get(index);
    if (!video) return;

    videoRefs.current.forEach((currentVideo, currentIndex) => {
      if (currentIndex !== index) currentVideo.pause();
    });

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  // Para ativar autoplay futuramente, avance o track em um intervalo desejado.
  // useEffect(() => { const timer = setInterval(() => trackRef.current?.scrollBy({ left: 280, behavior: "smooth" }), 4500); return () => clearInterval(timer); }, []);

  if (!reels.length) {
    return (
      <div className="reels-carousel reels-carousel--empty" aria-label="Sem Reels disponíveis">
        <div className="placeholder-card">Reels em preparação</div>
      </div>
    );
  }

  return (
    <div className="reels-carousel reels-carousel--interactive" aria-label="Últimos Reels">
      <div
        className={`reels-carousel-track${isDragging ? " is-dragging" : ""}`}
        ref={trackRef}
        role="list"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onScroll={updateFocusedReel}
      >
        {reels.map((reel, index) => (
          <article
            className={`reels-carousel-card${index === focusedIndex ? " is-focused" : ""}${index === expandedIndex ? " is-expanded" : ""}`}
            key={reel.id}
            role="listitem"
            aria-current={index === focusedIndex ? "true" : undefined}
          >
            {reel.video ? (
              <video
                className="reels-carousel-media"
                poster={reel.poster || reel.thumbnail || undefined}
                muted
                playsInline
                controls
                controlsList="nofullscreen noremoteplayback"
                disablePictureInPicture
                preload="auto"
                aria-label={reel.title}
                onDoubleClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setExpandedIndex(index === expandedIndex ? null : index);
                }}
                onError={(event) => {
                  event.currentTarget.setAttribute("data-media-error", "true");
                }}
                ref={(video) => {
                  if (video) videoRefs.current.set(index, video);
                  else videoRefs.current.delete(index);
                }}
              >
                <source src={reel.video} type={reel.videoType || undefined} />
              </video>
            ) : (
              <img className="reels-carousel-media" src={reel.thumbnail || undefined} alt={reel.title} draggable="false" />
            )}
            <div className="reels-carousel-overlay" aria-hidden="true" />
            {reel.video ? (
              <button
                className="reels-carousel-play"
                type="button"
                aria-label={`Reproduzir ${reel.title}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => playReel(index)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13l10-6.5-10-6.5Z" fill="currentColor" /></svg>
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
