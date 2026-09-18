import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./ReelsCarousel.css";

export default function ReelsCarousel({ reels = [] }) {
  const trackRef = useRef(null);
  const videoRefs = useRef(new Map());
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(reels.length > 1 ? 1 : 0);
  const focusedIndexRef = useRef(focusedIndex);
  const [playingIndex, setPlayingIndex] = useState(null);
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

    if (nearestCard) {
      focusedIndexRef.current = nearestCard.index;
      setFocusedIndex(nearestCard.index);
      videoRefs.current.forEach((video, index) => {
        if (index !== nearestCard.index) video.pause();
      });
    }
  };

  const centerReel = (index) => {
    const track = trackRef.current;
    const card = track?.querySelectorAll(".reels-carousel-card")[index];
    if (!card || !track) return;

    const bounds = card.getBoundingClientRect();
    const targetLeft = track.scrollLeft + bounds.left + bounds.width / 2 - track.getBoundingClientRect().left - track.clientWidth / 2;

    track.scrollTo({
      left: targetLeft,
      behavior: "auto",
    });
    updateFocusedReel();
  };

  useLayoutEffect(() => {
    if (!reels.length) return;
    const initialIndex = reels.length > 1 ? 1 : 0;
    focusedIndexRef.current = initialIndex;
    setFocusedIndex(initialIndex);
    centerReel(initialIndex);
  }, [reels.length]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => centerReel(focusedIndexRef.current));
    if (trackRef.current) resizeObserver.observe(trackRef.current);
    const pauseOtherVideos = (event) => {
      videoRefs.current.forEach((video) => {
        if (video !== event.target) video.pause();
      });
    };
    document.addEventListener("play", pauseOtherVideos, true);
    const closeExpandedVideo = (event) => {
      if (event.key === "Escape") setExpandedIndex(null);
    };
    window.addEventListener("keydown", closeExpandedVideo);
    return () => {
      resizeObserver.disconnect();
      document.removeEventListener("play", pauseOtherVideos, true);
      window.removeEventListener("keydown", closeExpandedVideo);
    };
  }, [reels.length]);

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
    centerReel(index);

    videoRefs.current.forEach((currentVideo, currentIndex) => {
      if (currentIndex !== index) currentVideo.pause();
    });

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

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
                playsInline
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                preload="metadata"
                muted={false}
                aria-label={reel.title}
                onPlay={(event) => {
                  if (index !== focusedIndexRef.current) {
                    event.currentTarget.pause();
                    return;
                  }
                  setPlayingIndex(index);
                }}
                onPause={() => setPlayingIndex((current) => current === index ? null : current)}
                onEnded={() => setPlayingIndex((current) => current === index ? null : current)}
                onDoubleClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setExpandedIndex(index === expandedIndex ? null : index);
                }}
                onError={(event) => {
                  event.currentTarget.setAttribute("data-media-error", "true");
                  setPlayingIndex((current) => current === index ? null : current);
                }}
                ref={(video) => {
                  if (video) videoRefs.current.set(index, video);
                  else videoRefs.current.delete(index);
                }}
              >
                <source src={reel.video} type={reel.videoType || undefined} />
              </video>
            ) : reel.thumbnail ? (
              <img className="reels-carousel-media" src={reel.thumbnail || undefined} alt={reel.title} draggable="false" />
            ) : null}
            <div className="reels-carousel-overlay" aria-hidden="true" />
            {reel.video ? playingIndex !== index && (
              <button
                className="reels-carousel-play"
                type="button"
                aria-label={`Reproduzir vídeo: ${reel.title}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => playReel(index)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13l10-6.5-10-6.5Z" fill="currentColor" /></svg>
              </button>
            ) : reel.permalink ? (
              <a
                className="reels-carousel-play"
                href={reel.permalink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir ${reel.title} no Instagram`}
                title="Assistir no Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13l10-6.5-10-6.5Z" fill="currentColor" /></svg>
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
