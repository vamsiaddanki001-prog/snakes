/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      if (dur) {
        setProgress((current / dur) * 100);
        setCurrentTime(formatTime(current));
        setDuration(formatTime(dur));
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div id="music-player-container" className="h-full flex flex-col lg:grid lg:grid-cols-[1fr_2fr_1fr] items-center px-4 lg:px-10 gap-4 lg:gap-0">
      <audio
        id="audio-element"
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Now Playing */}
      <div id="now-playing-info" className="flex items-center gap-4 w-full lg:w-auto">
        <div id="track-cover-container" className="w-[50px] h-[50px] shrink-0 bg-surface border border-accent rounded flex items-center justify-center overflow-hidden">
          <img
            id="track-cover-image"
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div id="track-details" className="overflow-hidden">
          <div id="track-title" className="text-sm font-medium truncate text-text">{currentTrack.title}</div>
          <div id="track-artist" className="text-[0.7rem] text-text-dim truncate font-mono">{currentTrack.artist}</div>
        </div>
      </div>

      {/* Controls & Progress */}
      <div id="player-controls-section" className="flex flex-col items-center gap-2 w-full">
        <div id="playback-buttons" className="flex items-center gap-6 lg:gap-8">
          <button id="btn-prev" onClick={prevTrack} className="p-3 text-text-dim hover:text-accent transition-colors">
            <SkipBack size={18} fill="currentColor" className="neon-icon-accent" />
          </button>
          <button 
            id="btn-play-pause"
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center border border-accent rounded-full text-accent hover:bg-accent/10 transition-colors neon-border-accent"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" className="neon-icon-accent" /> : <Play size={20} fill="currentColor" className="ml-1 neon-icon-accent" />}
          </button>
          <button id="btn-next" onClick={nextTrack} className="p-3 text-text-dim hover:text-accent transition-colors">
            <SkipForward size={18} fill="currentColor" className="neon-icon-accent" />
          </button>
        </div>
        
        <div id="progress-bar-container" className="w-full flex items-center gap-4 font-mono text-[0.7rem] text-text-dim">
          <span id="time-current">{currentTime}</span>
          <div id="progress-track" className="flex-1 h-1 bg-border rounded-full relative overflow-hidden">
            <motion.div 
              id="progress-fill"
              className="absolute left-0 top-0 h-full bg-accent"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            />
          </div>
          <span id="time-duration">{duration}</span>
        </div>
      </div>

      {/* Volume */}
      <div id="volume-section" className="flex justify-end items-center gap-3 w-full lg:w-auto hidden lg:flex">
        <Volume2 id="volume-icon" size={16} className="text-accent neon-icon-accent" />
        <div id="volume-track" className="w-20 h-1 bg-border rounded-full">
          <div id="volume-fill" className="w-[70%] h-full bg-text rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
