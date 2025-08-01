import JSONCrush from 'jsoncrush';
import { BingoGame } from './types';

export interface ShareableGame {
  title: string;
  items: string[];
}

export function encodeGameForUrl(game: BingoGame): string {
  const shareableData: ShareableGame = {
    title: game.title,
    items: game.items
  };
  
  try {
    const json = JSON.stringify(shareableData);
    const compressed = JSONCrush.crush(json);
    return encodeURIComponent(compressed);
  } catch (error) {
    console.error('Error encoding game for URL:', error);
    throw new Error('Failed to encode game data');
  }
}

export function decodeGameFromUrl(encodedData: string): ShareableGame {
  try {
    const compressed = decodeURIComponent(encodedData);
    const json = JSONCrush.uncrush(compressed);
    const data = JSON.parse(json) as ShareableGame;
    
    // Validate the decoded data
    if (!data.title || !Array.isArray(data.items) || data.items.length !== 25) {
      throw new Error('Invalid game data structure');
    }
    
    // Sanitize strings
    data.title = data.title.slice(0, 100);
    data.items = data.items.map(item => String(item).slice(0, 200));
    
    return data;
  } catch (error) {
    console.error('Error decoding game from URL:', error);
    throw new Error('Failed to decode game data from URL');
  }
}

export function createShareableUrl(game: BingoGame, baseUrl?: string): string {
  const encoded = encodeGameForUrl(game);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/play?data=${encoded}`;
}

export function isValidEncodedGame(encodedData: string): boolean {
  try {
    const decoded = decodeGameFromUrl(encodedData);
    return decoded.title.length > 0 && decoded.items.length === 25;
  } catch {
    return false;
  }
}