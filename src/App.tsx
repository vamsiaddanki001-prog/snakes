/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Github, Twitter, ExternalLink, Trophy, Activity, Zap, Ruler } from 'lucide-react';
import { DUMMY_TRACKS } from './constants';

export default function App() {
  const [gameStats, setGameStats] = useState({ speed: 1.0, multiplier: 1, apples: 0, length: 3 });

  return (
    <div id="app-root" className="h-screen w-full flex flex-col bg-bg text-text font-sans selection:bg-accent selection:text-black">
      {/* Top Bar */}
      <header id="top-bar" className="h-[60px] shrink-0 flex items-center justify-between px-4 lg:px-10 bg-surface border-b border-border z-20">
        <div id="app-logo" className="font-digital font-black text-xl lg:text-3xl tracking-[4px] text-accent neon-text-accent glitch" data-text="NEON_GRID v1.0">
          NEON_GRID v1.0
        </div>
        
        <div id="score-board" className="flex gap-4 lg:gap-10 font-mono">
          <div id="high-score" className="flex flex-col items-end">
            <span className="text-[0.5rem] lg:text-[0.6rem] uppercase text-text-dim">High Score</span>
            <span className="text-base lg:text-xl text-text">08,450</span>
          </div>
          <div id="current-score" className="flex flex-col items-end">
            <span className="text-[0.5rem] lg:text-[0.6rem] uppercase text-text-dim">Current Session</span>
            <span className="text-base lg:text-xl text-text">01,420</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main id="main-layout" className="flex-1 flex flex-col lg:grid lg:grid-cols-[280px_1fr_280px] gap-5 p-5 overflow-y-auto lg:overflow-hidden">
        {/* Left Sidebar: Music Queue */}
        <aside id="music-queue-sidebar" className="surface-panel p-5 flex flex-col overflow-hidden min-h-[200px] lg:min-h-0">
          <h2 id="music-queue-title" className="text-[0.7rem] uppercase tracking-[1px] text-text-dim mb-4 pb-2 border-b border-border">
            Music Queue
          </h2>
          <div id="music-queue-list" className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {DUMMY_TRACKS.map((track, idx) => (
              <div 
                key={track.id}
                id={`queue-item-${track.id}`}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors group ${idx === 0 ? 'bg-accent/5 border-l-2 border-accent' : 'hover:bg-white/5'}`}
              >
                <div className="w-10 h-10 bg-border rounded flex items-center justify-center text-[0.7rem] font-mono border border-white/10 group-hover:border-accent/30">
                  {track.id.padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.85rem] font-medium truncate text-text">{track.title}</div>
                  <div className="text-[0.7rem] text-text-dim truncate font-mono">{track.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: Game Container */}
        <section id="game-section" className="bg-black rounded-xl border-2 border-border relative flex items-center justify-center overflow-hidden min-h-[400px] lg:min-h-0">
          <SnakeGame onStatsChange={setGameStats} />
        </section>

        {/* Right Sidebar: Game Stats */}
        <aside id="game-stats-sidebar" className="surface-panel p-5 flex flex-col shrink-0">
          <h2 id="game-stats-title" className="text-[0.7rem] uppercase tracking-[1px] text-text-dim mb-4 pb-2 border-b border-border">
            Game Stats
          </h2>
          
          <div id="game-stats-list" className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-dim flex items-center gap-2"><Zap size={14} className="text-accent neon-icon-accent" /> Speed</span>
              <span id="stat-speed" className="font-mono text-accent">{gameStats.speed.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-dim flex items-center gap-2"><Activity size={14} className="text-accent neon-icon-accent" /> Multiplier</span>
              <span id="stat-multiplier" className="font-mono text-accent">x{gameStats.multiplier}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-dim flex items-center gap-2"><Trophy size={14} className="text-accent neon-icon-accent" /> Apples Eaten</span>
              <span id="stat-apples" className="font-mono text-accent">{gameStats.apples}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-dim flex items-center gap-2"><Ruler size={14} className="text-accent neon-icon-accent" /> Snake Length</span>
              <span id="stat-length" className="font-mono text-accent">{gameStats.length} units</span>
            </div>
          </div>

          <div id="game-directions" className="mt-8 lg:mt-auto text-center">
            <div className="text-[0.6rem] text-text-dim mb-3 uppercase tracking-widest">Directions</div>
            <div className="font-mono text-sm grid grid-cols-3 gap-1.5 w-[120px] mx-auto">
              <div />
              <div id="key-w" className="border border-border p-2 rounded bg-white/5">W</div>
              <div />
              <div id="key-a" className="border border-border p-2 rounded bg-white/5">A</div>
              <div id="key-s" className="border border-border p-2 rounded bg-white/5">S</div>
              <div id="key-d" className="border border-border p-2 rounded bg-white/5">D</div>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Player */}
      <footer id="app-footer" className="h-auto lg:h-[100px] py-4 lg:py-0 bg-surface border-t border-border z-20 shrink-0">
        <MusicPlayer />
      </footer>
    </div>
  );
}
