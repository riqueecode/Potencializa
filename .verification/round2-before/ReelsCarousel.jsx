import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./ReelsCarousel.css";
import VideoModal, { pauseOtherVideos } from "./VideoModal.jsx";

export default function ReelsCarousel({ reels = [] }) {
  const trackRef = useRef(null);
  const videoRefs = useRef(new Map());
  const dragStart = useRef(null);
  const suppressClick = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(reels.length > 1 ? 1 : 0);
  const focusedIndexRef = useRef(focusedIndex);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [errors, setErrors] = useState({});

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
      behavior: "instant",
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
    return () => {
      resizeObserver.disconnect();
    };
  }, [reels.length]);

  const handlePointerDown = (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    suppressClick.current = false;
    dragStart.current = { x: event.clientX, y: event.clientY, scrollLeft: track.scrollLeft };
  };

  const handlePointerMove = (event) => {
    if (event.pointerType !== "touch" && event.buttons !== 1) {
      dragStart.current = null;
      setIsDragging(false);
      return;
    }
    const start = dragStart.current;
    if (!start || !trackRef.current) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) {
      suppressClick.current = true;
      if (event.pointerType !== "touch") {
        trackRef.current.setPointerCapture(event.pointerId);
        setIsDragging(true);
        trackRef.current.scrollLeft = start.scrollLeft - (event.clientX - start.x);
      }
    }
  };

  const stopDragging = (event) => {
    const track = trackRef.current;
    if (!track) return;

    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    setIsDragging(false);
    if (event.type === "pointercancel") suppressClick.current = true;
    dragStart.current = null;
  };

  const playReel = (index) => {
    const video = videoRefs.current.get(index);
    if (!video) return;
    centerReel(index);

    videoRefs.current.forEach((currentVideo, currentIndex) => {
      if (currentIndex !== index) currentVideo.pause();
    });

    if (video.paused) {
      pauseOtherVideos(video);
      setErrors(current => ({ ...current, [index]: false }));
      if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) video.load();
      video.play().catch(error => {
        if (error.name !== "AbortError") setErrors(current => ({ ...current, [index]: true }));
      });
    } else {
      video.pause();
    }
  };

  const expandReel = (index) => {
    const video = videoRefs.current.get(index);
    const playback = { time: video.currentTime, playing: !video.paused, volume: video.volume, muted: video.muted };
    pauseOtherVideos();
    setExpanded({ reel: reels[index], playback });
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
        onLostPointerCapture={() => { dragStart.current = null; setIsDragging(false); }}
        onClickCapture={event => {
          if (event.detail !== 0 && suppressClick.current) { event.preventDefault(); event.stopPropagation(); }
        }}
        onScroll={updateFocusedReel}
      >
        {reels.map((reel, index) => (
          <article
            className={`reels-carousel-card${index === focusedIndex ? " is-focused" : ""}`}
            data-reel-id={reel.id}
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
                preload={reel.poster || reel.thumbnail ? "none" : "metadata"}
                muted={false}
                aria-label={reel.title}
                onPlay={(event) => {
                  // A queued play event can arrive after a newer gesture paused
                  // this video. It must not pause the new active player.
                  if (!event.currentTarget.paused) pauseOtherVideos(event.currentTarget);
                }}
                onPlaying={(event) => {
                  if (event.currentTarget.paused) return;
                  if (index !== focusedIndexRef.current) {
                    event.currentTarget.pause();
                    return;
                  }
                  setPlayingIndex(index);
                }}
                onPause={() => setPlayingIndex((current) => current === index ? null : current)}
                onEnded={() => setPlayingIndex((current) => current === index ? null : current)}
                onError={(event) => {
                  event.currentTarget.setAttribute("data-media-error", "true");
                  setPlayingIndex((current) => current === index ? null : current);
                  setErrors(current => ({ ...current, [index]: true }));
                }}
                ref={(video) => {
                  if (video) videoRefs.current.set(index, video);
                  else videoRefs.current.delete(index);
                }}
              >
                <source src={reel.video} type={reel.videoType || undefined}
                  onError={() => setErrors(current => ({ ...current, [index]: true }))} />
              </video>
            ) : reel.thumbnail ? (
              <img className="reels-carousel-media" src={reel.thumbnail || undefined} alt={reel.title} draggable="false" />
            ) : null}
            <div className="reels-carousel-overlay" aria-hidden="true" />
            {reel.video ? (
              <>
              <button
                className="reels-carousel-hit"
                type="button"
                aria-label={`${playingIndex === index ? "Pausar" : "Reproduzir"} vídeo: ${reel.title}`}
                onClick={() => playReel(index)}
              >
                {playingIndex !== index && <span className="reels-carousel-play">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13l10-6.5-10-6.5Z" fill="currentColor" /></svg>
                </span>}
              </button>
              <button className="reels-carousel-expand" type="button" aria-label={`Expandir vídeo: ${reel.title}`} onClick={() => expandReel(index)}>⛶</button>
              {errors[index] && <div className="reels-carousel-error" role="status">Não foi possível reproduzir. Tente novamente.
                {reel.permalink && <a href={reel.permalink} target="_blank" rel="noopener noreferrer">Assistir no Instagram</a>}
              </div>}
              </>
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
      <button className="reels-carousel-arrow reels-carousel-arrow--prev" type="button" aria-label="Vídeo anterior" disabled={focusedIndex === 0} onClick={() => centerReel(focusedIndex - 1)}>‹</button>
      <button className="reels-carousel-arrow reels-carousel-arrow--next" type="button" aria-label="Próximo vídeo" disabled={focusedIndex === reels.length - 1} onClick={() => centerReel(focusedIndex + 1)}>›</button>
      {expanded && <VideoModal {...expanded} onClose={() => setExpanded(null)} />}
    </div>
  );
}
