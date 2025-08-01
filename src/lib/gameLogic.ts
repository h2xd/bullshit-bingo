import { GameState } from './types';

export type WinPattern = 'row' | 'col' | 'diag';

export interface WinInfo {
  pattern: WinPattern;
  index: number;
  squares: number[];
}

// Generate all possible winning patterns for a 5x5 bingo grid
export function getWinningPatterns(): WinInfo[] {
  const patterns: WinInfo[] = [];
  
  // Rows (5 patterns)
  for (let row = 0; row < 5; row++) {
    const squares = [];
    for (let col = 0; col < 5; col++) {
      squares.push(row * 5 + col);
    }
    patterns.push({
      pattern: 'row',
      index: row,
      squares
    });
  }
  
  // Columns (5 patterns)
  for (let col = 0; col < 5; col++) {
    const squares = [];
    for (let row = 0; row < 5; row++) {
      squares.push(row * 5 + col);
    }
    patterns.push({
      pattern: 'col',
      index: col,
      squares
    });
  }
  
  // Diagonals (2 patterns)
  // Top-left to bottom-right
  patterns.push({
    pattern: 'diag',
    index: 0,
    squares: [0, 6, 12, 18, 24]
  });
  
  // Top-right to bottom-left
  patterns.push({
    pattern: 'diag',
    index: 1,
    squares: [4, 8, 12, 16, 20]
  });
  
  return patterns;
}

// Check if a specific pattern is complete
export function isPatternComplete(markedSquares: number[], pattern: WinInfo): boolean {
  return pattern.squares.every(square => markedSquares.includes(square));
}

// Find all completed winning patterns
export function findWinningPatterns(markedSquares: number[]): WinInfo[] {
  const allPatterns = getWinningPatterns();
  return allPatterns.filter(pattern => isPatternComplete(markedSquares, pattern));
}

// Check if a game state represents a win
export function isWinningState(gameState: GameState): boolean {
  const winningPatterns = findWinningPatterns(gameState.markedSquares);
  return winningPatterns.length > 0;
}

// Generate a pattern identifier string
export function getPatternId(pattern: WinInfo): string {
  return `${pattern.pattern}-${pattern.index}`;
}

// Update game state with new marked square
export function toggleSquare(gameState: GameState, squareIndex: number): GameState {
  const newMarkedSquares = gameState.markedSquares.includes(squareIndex)
    ? gameState.markedSquares.filter(square => square !== squareIndex)
    : [...gameState.markedSquares, squareIndex];
  
  const winningPatterns = findWinningPatterns(newMarkedSquares);
  const wonPatterns = winningPatterns.map(getPatternId);
  
  const wasWinning = gameState.wonPatterns.length > 0;
  const isNowWinning = wonPatterns.length > 0;
  
  // Set completion time if this is the first win
  const completedAt = !wasWinning && isNowWinning ? Date.now() : gameState.completedAt;
  
  return {
    ...gameState,
    markedSquares: newMarkedSquares,
    wonPatterns,
    completedAt
  };
}

// Get squares that are part of winning patterns
export function getWinningSquares(gameState: GameState): number[] {
  const winningPatterns = getWinningPatterns();
  const activePatterns = winningPatterns.filter(pattern => 
    gameState.wonPatterns.includes(getPatternId(pattern))
  );
  
  const winningSquares = new Set<number>();
  activePatterns.forEach(pattern => {
    pattern.squares.forEach(square => winningSquares.add(square));
  });
  
  return Array.from(winningSquares);
}

// Utility functions
export function squareIndexToRowCol(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / 5),
    col: index % 5
  };
}

export function rowColToSquareIndex(row: number, col: number): number {
  return row * 5 + col;
}

// Check if a square index is the center (FREE) square
export function isCenterSquare(index: number): boolean {
  return index === 12; // Center of 5x5 grid
}

// Initialize a fresh game state with the center square marked
export function initializeGameState(gameId: string): GameState {
  return {
    gameId,
    markedSquares: [12], // Center square starts marked
    wonPatterns: [],
    startedAt: Date.now()
  };
}