/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';
import { GameState } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';

interface SnakeGameProps {
  onStatsChange?: (stats: { speed: number; multiplier: number; apples: number; length: number }) => void;
}

export default function SnakeGame({ onStatsChange }: SnakeGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState(400);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: 'UP',
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState((prev) => {
      const head = prev.snake[0];
      const newHead = { ...head };

      switch (prev.direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        return { ...prev, isGameOver: true };
      }

      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          },
          score: prev.score + 10,
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, [gameState.isGameOver, gameState.isPaused]);

  useEffect(() => {
    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - (gameState.score / 10) * SPEED_INCREMENT);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, gameState.score]);

  useEffect(() => {
    if (onStatsChange) {
      const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (gameState.score / 10) * SPEED_INCREMENT);
      const speedMultiplier = Math.round((INITIAL_SPEED / currentSpeed) * 10) / 10;
      onStatsChange({
        speed: speedMultiplier,
        multiplier: Math.floor(gameState.score / 50) + 1,
        apples: gameState.score / 10,
        length: gameState.snake.length
      });
    }
  }, [gameState.score, gameState.snake.length, onStatsChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const size = Math.min(width, height) - 32;
      setCanvasSize(Math.max(200, size));
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowup':
        case 'w': if (gameState.direction !== 'DOWN') setGameState(p => ({ ...p, direction: 'UP' })); break;
        case 'arrowdown':
        case 's': if (gameState.direction !== 'UP') setGameState(p => ({ ...p, direction: 'DOWN' })); break;
        case 'arrowleft':
        case 'a': if (gameState.direction !== 'RIGHT') setGameState(p => ({ ...p, direction: 'LEFT' })); break;
        case 'arrowright':
        case 'd': if (gameState.direction !== 'LEFT') setGameState(p => ({ ...p, direction: 'RIGHT' })); break;
        case ' ': setGameState(p => ({ ...p, isPaused: !p.isPaused })); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.direction, gameState.isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff007f';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff007f';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      const opacity = Math.max(0.1, 1 - (index / gameState.snake.length));
      
      ctx.fillStyle = isHead ? '#ffffff' : `rgba(57, 255, 20, ${opacity})`;
      ctx.shadowBlur = isHead ? 20 : 15 * opacity;
      ctx.shadowColor = '#39ff14';
      
      const padding = isHead ? 1 : 2;
      const currentCellSize = cellSize - padding * 2;
      
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        currentCellSize,
        currentCellSize
      );
    });

    ctx.shadowBlur = 0;
  }, [gameState]);

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: { x: 5, y: 5 },
      direction: 'UP',
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  return (
    <div id="snake-game-container" ref={containerRef} className="w-full h-full flex items-center justify-center relative group">
      <canvas
        id="snake-canvas"
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="relative rounded-lg bg-black cursor-none"
      />

      <AnimatePresence>
        {(gameState.isGameOver || gameState.isPaused) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg z-10"
          >
            <div id="game-overlay-panel" className="text-center p-8 border border-border bg-surface rounded-2xl">
              {gameState.isGameOver ? (
                <>
                  <h2 id="game-over-title" className="text-3xl font-mono font-bold mb-2 text-secondary neon-text-secondary">GAME OVER</h2>
                  <p id="game-over-score" className="text-text-dim mb-6 font-mono text-sm uppercase tracking-widest">Score: {gameState.score}</p>
                  <button
                    id="btn-restart-game"
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent/10 transition-colors mx-auto"
                  >
                    <RotateCcw size={16} /> REBOOT_SYSTEM
                  </button>
                </>
              ) : (
                <>
                  <h2 id="game-paused-title" className="text-3xl font-mono font-bold mb-6 text-accent neon-text-accent">PAUSED</h2>
                  <button
                    id="btn-resume-game"
                    onClick={() => setGameState(p => ({ ...p, isPaused: false }))}
                    className="flex items-center gap-2 px-8 py-4 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent/10 transition-colors mx-auto"
                  >
                    <Play size={20} fill="currentColor" /> RESUME_SESSION
                  </button>
                  <p id="game-paused-hint" className="mt-4 text-[0.6rem] text-text-dim uppercase tracking-widest font-mono">Press SPACE to toggle</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
