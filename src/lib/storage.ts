import { BingoGame, GameState, GameStorage, UserPreferences } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  GAMES: 'bingo-games',
  GAME_STATE: 'bingo-state-',
  PREFERENCES: 'bingo-preferences'
} as const;

const STORAGE_VERSION = 1;

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  soundEnabled: true,
  highlightColor: '#FCD34D'
};

// Game management functions
export function saveGame(game: BingoGame): void {
  const storage = getGameStorage();
  const existingIndex = storage.games.findIndex(g => g.id === game.id);

  if (existingIndex >= 0) {
    storage.games[existingIndex] = game;
  } else {
    storage.games.push(game);
  }

  setGameStorage(storage);
}

export function getGames(): BingoGame[] {
  const storage = getGameStorage();
  return storage.games;
}

export function getGame(gameId: string): BingoGame | null {
  const games = getGames();
  return games.find(game => game.id === gameId) || null;
}

export function deleteGame(gameId: string): void {
  const storage = getGameStorage();
  storage.games = storage.games.filter(game => game.id !== gameId);
  setGameStorage(storage);

  // Also delete associated game state
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE + gameId);
  }
}

export function createGame(title: string, items: string[]): BingoGame {
  if (items.length !== 25) {
    throw new Error('Game must have exactly 25 items');
  }

  if (title.length > 100) {
    throw new Error('Game title must be 100 characters or less');
  }

  const now = Date.now();
  return {
    id: uuidv4(),
    title,
    items,
    createdAt: now,
    lastPlayed: now,
    playCount: 0
  };
}

// Game state management
export function saveGameState(gameId: string, state: GameState): void {
  if (typeof window === 'undefined') return;

  const key = STORAGE_KEYS.GAME_STATE + gameId;
  localStorage.setItem(key, JSON.stringify(state));
}

export function getGameState(gameId: string): GameState | null {
  if (typeof window === 'undefined') return null;

  const key = STORAGE_KEYS.GAME_STATE + gameId;
  const stored = localStorage.getItem(key);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as GameState;
  } catch {
    return null;
  }
}

export function deleteGameState(gameId: string): void {
  if (typeof window === 'undefined') return;

  const key = STORAGE_KEYS.GAME_STATE + gameId;
  localStorage.removeItem(key);
}

export function createGameState(gameId: string): GameState {
  const now = Date.now();
  return {
    gameId,
    markedSquares: [],
    wonPatterns: [],
    startedAt: now
  };
}

// User preferences
export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

  const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  if (!stored) return DEFAULT_PREFERENCES;

  try {
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;

  const current = getPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
}

// Internal helpers
function getGameStorage(): GameStorage {
  if (typeof window === 'undefined') {
    console.log('getGameStorage: window is undefined');
    return { games: [], version: STORAGE_VERSION };
  }

  console.log('getGameStorage: window is defined');
  const stored = localStorage.getItem(STORAGE_KEYS.GAMES);
  console.log('getGameStorage: stored', stored);
  console.log('getGameStorage: window is defined');
  if (!stored) {
    return { games: [], version: STORAGE_VERSION };
  }

  try {
    const parsed = JSON.parse(stored) as GameStorage;
    // Handle version migrations if needed in the future
    return parsed;
  } catch {
    return { games: [], version: STORAGE_VERSION };
  }
}

function setGameStorage(storage: GameStorage): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(storage));
}

// Utility functions
export function updateGamePlayStats(gameId: string): void {
  const game = getGame(gameId);
  if (!game) return;

  const updatedGame: BingoGame = {
    ...game,
    lastPlayed: Date.now(),
    playCount: game.playCount + 1
  };

  saveGame(updatedGame);
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  const keys = Object.keys(localStorage).filter(key =>
    key.startsWith('bingo-')
  );

  keys.forEach(key => localStorage.removeItem(key));
}