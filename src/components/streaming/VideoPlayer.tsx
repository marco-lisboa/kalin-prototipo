import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  FastForward,
  Settings,
  CheckCircle2
} from 'lucide-react';

export interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  onEnded,
  onTimeUpdate,
  autoPlay = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Auto hide controls on inactivity
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(current);
    if (onTimeUpdate) {
      onTimeUpdate(current, dur);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.error(err));
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group select-none border border-kalin-darkborder"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        playsInline
      />

      {/* Big Center Play Button (before starting or when paused) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-all duration-300"
        >
          <div className="w-20 h-20 rounded-full bg-kalin-primary/90 text-white flex items-center justify-center shadow-kalin-glow hover:scale-110 hover:bg-kalin-primary transition-all duration-300">
            <Play className="w-8 h-8 ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Top Overlay Badge */}
      <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 flex items-center justify-between ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-kalin-primary animate-pulse" />
          <span className="text-white text-sm font-semibold tracking-wide truncate max-w-md drop-shadow">
            {title}
          </span>
        </div>
        <div className="bg-kalin-dark/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-kalin-light border border-kalin-primary/30">
          Kalin Stream HD
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 py-3 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber / Progress Bar */}
        <div className="relative mb-3 group/scrubber cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-kalin-primary hover:h-2.5 transition-all"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 hover:text-kalin-primary transition-colors focus:outline-none"
              title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Skip -10s / +10s */}
            <button
              onClick={() => skipSeconds(-10)}
              className="p-1.5 hover:text-kalin-primary transition-colors focus:outline-none hidden sm:block"
              title="Voltar 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => skipSeconds(10)}
              className="p-1.5 hover:text-kalin-primary transition-colors focus:outline-none hidden sm:block"
              title="Avançar 10s"
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/volume">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:text-kalin-primary transition-colors focus:outline-none"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded appearance-none cursor-pointer accent-kalin-primary hidden sm:block"
              />
            </div>

            {/* Time Indicator */}
            <span className="text-gray-300 font-mono text-[11px] ml-1">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Speed Control */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md font-semibold text-[11px] transition-colors"
                title="Velocidade"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-28 bg-kalin-dark border border-kalin-darkborder rounded-xl p-1 shadow-2xl text-left z-20">
                  <div className="text-[10px] text-gray-400 px-2 py-1 uppercase font-semibold">Velocidade</div>
                  {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        playbackSpeed === speed ? 'bg-kalin-primary text-white font-bold' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{speed}x</span>
                      {playbackSpeed === speed && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-kalin-primary transition-colors focus:outline-none"
              title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
