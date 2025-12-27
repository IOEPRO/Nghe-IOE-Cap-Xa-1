import React, { useState, useRef } from 'react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-lg border border-slate-200">
      <button 
        type="button" 
        onClick={togglePlay} 
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        {isPlaying ? '❚❚' : '▶'}
      </button>
      <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Nghe câu hỏi</span>
      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={handleEnded} 
        className="hidden" 
      />
    </div>
  );
};

export default AudioPlayer;