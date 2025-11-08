import { useRef } from "react";
import egg from "@/assets/egg.mp3";

function Footer(){
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0; // restart if clicked repeatedly
    a.play().catch(() => {
      // ignore play failures
    });
  };


  return (
    <footer className="w-full bg-background text-center p-10">

      <button
        type="button"
        onClick={play}
        className="inline-flex items-center gap-2 rounded px-2 py-1 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        aria-label="Plays a brief sound"
        title="Plays a brief sound"
      >
        <span role="img" aria-hidden="true">©</span>
        <span className="font-medium">A Word</span>
        <span className="sr-only">plays a short sound as an easter egg</span>
      </button>

      <audio
        ref={audioRef}
        src={egg}
        preload="auto"
        aria-hidden="true"
      />
    </footer>
  )
}

export default Footer
