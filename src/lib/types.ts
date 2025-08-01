export interface BingoGame {
  id: string;              // UUID v4
  title: string;           // Max 100 chars
  items: string[];         // Exactly 25 items
  createdAt: number;       // Unix timestamp
  lastPlayed: number;      // Unix timestamp
  playCount: number;       // Times played
  imported?: boolean;      // Whether this game was imported from a share
}

export interface GameState {
  gameId: string;
  markedSquares: number[]; // Indices of marked squares
  wonPatterns: string[];   // ['row-0', 'col-2', 'diag-1']
  startedAt: number;       // Unix timestamp
  completedAt?: number;    // Unix timestamp if won
}

export interface GameStorage {
  games: BingoGame[];
  version: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  highlightColor: string;
}