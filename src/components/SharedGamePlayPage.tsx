'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BingoCard } from '@/components/BingoCard';
import { BingoGame } from '@/lib/types';
import { decodeGameFromUrl, isValidEncodedGame } from '@/lib/urlEncoding';
import { createGame } from '@/lib/storage';

interface SharedGamePlayPageProps {
  encodedData?: string;
}

export function SharedGamePlayPage({ encodedData }: SharedGamePlayPageProps) {
  const [game, setGame] = useState<BingoGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedGame = () => {
      try {
        if (!encodedData) {
          setError('No game data provided');
          return;
        }

        if (!isValidEncodedGame(encodedData)) {
          setError('Invalid game data');
          return;
        }

        const shareableGame = decodeGameFromUrl(encodedData);
        
        // Create a temporary game object for playing
        const tempGame = createGame(shareableGame.title, shareableGame.items);
        // Use a consistent ID based on the content for shared games
        tempGame.id = 'shared-' + btoa(JSON.stringify(shareableGame)).substring(0, 8);
        
        setGame(tempGame);
      } catch (error) {
        console.error('Error loading shared game:', error);
        setError('Failed to load shared game');
      } finally {
        setLoading(false);
      }
    };

    loadSharedGame();
  }, [encodedData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shared game...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Invalid Game Link
          </h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The shared game link is invalid or corrupted.'}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Try asking the sender for a new link, or create your own game.
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Link href="/">
                <Button variant="outline">Go Home</Button>
              </Link>
              <Link href="/new">
                <Button>Create New Game</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block">
            ← Create Your Own Games
          </Link>
          
          {/* Shared Game Notice */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <span>🔗</span> Shared Game
            </div>
            <p className="text-sm text-muted-foreground">
              You&apos;re playing a shared game. Your progress won&apos;t be saved permanently. 
              <Link href="/new" className="text-primary hover:underline ml-1">
                Create your own account
              </Link> to save games.
            </p>
          </div>
        </div>

        {/* Bingo Card */}
        <BingoCard 
          game={game}
          className="mb-8"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/new">
            <Button>
              Create Your Own Game
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Browse Games
            </Button>
          </Link>
        </div>

        {/* Game Info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium text-foreground mb-2">How to Play</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Click squares to mark them when you hear/see the item</li>
            <li>• Get 5 in a row (horizontal, vertical, or diagonal) to win</li>
            <li>• The center &ldquo;FREE&rdquo; square is automatically marked</li>
            <li>• You can have multiple winning patterns at once</li>
          </ul>
        </div>
      </div>
    </div>
  );
}