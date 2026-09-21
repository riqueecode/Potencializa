import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function pauseOtherVideos(active) {
  document.querySelectorAll("video").forEach(video => {
    if (video !== active) video.pause();
  });
}

export default function VideoModal({ reel, playback, onClose }) {
  const dialogRef = useRef(null);
  const videoRef = useRef(null);
  const [error, setError] = useState(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    const previousFocus = document.activeElement;
    const body = document.body;
    const previousStyle = body.getAttribute("style");
    const scrollY = window.scrollY;
    pauseOtherVideos(video);
    Object.assign(body.style, { position: "fixed", top: `-${scrollY}px`, width: "100%", overflow: "hidden" });
    dialog.showModal();
    dialog.querySelector("button").focus();
    if (!video.getAttribute("src")) video.src = reel.video;
    video.volume = playback.volume;
    video.muted = playback.muted;
    // This modal is mounted only by an explicit expand gesture.
    let mounted = true;
    if (playback.playing) video.play().catch(error => {
      if (mounted && error.name !== "AbortError") setError(true);
    });
    const enforceSinglePlayback = event => {
      if (event.target !== video) event.target.pause();
    };
    document.addEventListener("play", enforceSinglePlayback, true);
    return () => {
      mounted = false;
      video.pause();
      video.removeAttribute("src");
      video.load();
      dialog.close();
      document.removeEventListener("play", enforceSinglePlayback, true);
      if (previousStyle === null) body.removeAttribute("style");
      else body.setAttribute("style", previousStyle);
      window.scrollTo({ top: scrollY, behavior: "instant" });
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  const close = () => { videoRef.current?.pause(); onClose(); };
  return createPortal(
    <dialog ref={dialogRef} className="video-modal" aria-modal="true" aria-label={reel.title}
      onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="video-modal__content">
        <div className="video-modal__header">
          <button className="video-modal__close" type="button" aria-label="Fechar vídeo" onClick={close}>×</button>
        </div>
        <video ref={videoRef} src={reel.video} poster={reel.poster || reel.thumbnail || undefined}
          playsInline controls preload="metadata" aria-label={reel.title}
          onLoadedMetadata={event => { event.currentTarget.currentTime = playback.time; }}
          onPlay={event => { if (!event.currentTarget.paused) pauseOtherVideos(event.currentTarget); }}
          onPlaying={() => setError(false)} onError={() => setError(true)} />
        {error && <p className="video-modal__error" role="status">Não foi possível reproduzir o vídeo. Tente novamente pelos controles.
          {reel.permalink && <a href={reel.permalink} target="_blank" rel="noopener noreferrer"> Assistir no Instagram</a>}
        </p>}
      </div>
    </dialog>, document.body
  );
}
