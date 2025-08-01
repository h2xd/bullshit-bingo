'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BingoGame, GameState } from '@/lib/types';
import { 
  toggleSquare, 
  getWinningSquares, 
  isCenterSquare,
  initializeGameState,
  isWinningState 
} from '@/lib/gameLogic';
import { 
  getGameState, 
  saveGameState, 
  updateGamePlayStats 
} from '@/lib/storage';

interface BingoCardProps {
  game: BingoGame;
  onWin?: (gameState: GameState) => void;
  className?: string;
}

export function BingoCard({ game, onWin, className }: BingoCardProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [winningSquares, setWinningSquares] = useState<number[]>([]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  useEffect(() => {
    // Initialize or load game state
    let state = getGameState(game.id);
    if (!state) {
      state = initializeGameState(game.id);
      saveGameState(game.id, state);
      updateGamePlayStats(game.id);
    }
    
    setGameState(state);
    setWinningSquares(getWinningSquares(state));
  }, [game.id]);

  const handleSquareClick = (squareIndex: number) => {
    if (!gameState) return;

    const wasWinning = isWinningState(gameState);
    const newGameState = toggleSquare(gameState, squareIndex);
    const isNowWinning = isWinningState(newGameState);
    
    setGameState(newGameState);
    setWinningSquares(getWinningSquares(newGameState));
    saveGameState(game.id, newGameState);

    // Trigger win animation if this is a new win
    if (!wasWinning && isNowWinning) {
      setShowWinAnimation(true);
      setTimeout(() => setShowWinAnimation(false), 3000);
      onWin?.(newGameState);
    }
  };

  const resetGame = () => {
    if (!confirm('Are you sure you want to reset this game?')) return;
    
    const newState = initializeGameState(game.id);
    setGameState(newState);
    setWinningSquares([]);
    saveGameState(game.id, newState);
    setShowWinAnimation(false);
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isWon = isWinningState(gameState);

  return (
    <div className={cn("relative", className)}>
      {/* Win Animation Overlay */}
      {showWinAnimation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-white mb-2">BINGO!</div>
            <div className="text-white">Congratulations!</div>
          </div>
        </div>
      )}

      {/* Game Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{game.title}</h1>
        {isWon && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-success text-white rounded-full text-sm font-medium">
            <span>🏆</span> WINNER!
          </div>
        )}
      </div>

      {/* Bingo Grid */}
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-6">
        {game.items.map((item, index) => {
          const isMarked = gameState.markedSquares.includes(index);
          const isWinningSquare = winningSquares.includes(index);
          const isFree = isCenterSquare(index);
          
          return (
            <button
              key={index}
              onClick={() => handleSquareClick(index)}
              disabled={isFree}
              className={cn(
                "aspect-square flex items-center justify-center text-xs sm:text-sm p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                {
                  // Free square (center)
                  "bg-highlight text-foreground font-bold border-highlight cursor-default": isFree,
                  
                  // Unmarked squares
                  "bg-card text-card-foreground border-border hover:bg-accent": !isMarked && !isFree,
                  
                  // Marked squares
                  "bg-primary text-primary-foreground border-primary": isMarked && !isWinningSquare && !isFree,
                  
                  // Winning squares
                  "bg-success text-white border-success animate-pulse": isWinningSquare && !isFree,
                  
                  // All won squares get a special glow
                  "shadow-lg shadow-success/50": isWinningSquare,
                }
              )}
              title={isFree ? "FREE" : item}
            >
              <span className="text-center leading-tight break-words">
                {isFree ? "FREE" : item}
              </span>
            </button>
          );
        })}
      </div>

      {/* Game Stats */}
      <div className="text-center space-y-2 mb-6">
        <div className="text-sm text-muted-foreground">
          Marked: {gameState.markedSquares.length}/25
        </div>
        {gameState.wonPatterns.length > 0 && (
          <div className="text-sm text-success font-medium">
            Winning patterns: {gameState.wonPatterns.length}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={resetGame}
          className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}