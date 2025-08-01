'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BingoCard } from '@/components/BingoCard';
import { ShareDialog } from '@/components/ShareDialog';
import { BingoGame, GameState } from '@/lib/types';
import { getGame } from '@/lib/storage';

interface GamePlayPageProps {
  gameId: string;
}

export function GamePlayPage({ gameId }: GamePlayPageProps) {
  const router = useRouter();
  const [game, setGame] = useState<BingoGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [lastWin, setLastWin] = useState<GameState | null>(null);

  useEffect(() => {
    const loadGame = () => {
      try {
        const savedGame = getGame(gameId);
        if (!savedGame) {
          router.push('/');
          return;
        }
        setGame(savedGame);
      } catch (error) {
        console.error('Error loading game:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId, router]);

  const handleWin = (gameState: GameState) => {
    setLastWin(gameState);
    // Could add win sound effect here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎲</div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Game Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The game you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
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
            ← Back to Games
          </Link>
        </div>

        {/* Bingo Card */}
        <BingoCard 
          game={game} 
          onWin={handleWin}
          className="mb-8"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            onClick={() => setShowShareDialog(true)}
            variant="outline"
          >
            Share Game
          </Button>
          <Link href="/new">
            <Button variant="outline">
              Create New Game
            </Button>
          </Link>
        </div>

        {/* Win Message */}
        {lastWin && (
          <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-lg text-center">
            <div className="text-success font-medium mb-2">
              🎉 Congratulations! You won with {lastWin.wonPatterns.length} pattern{lastWin.wonPatterns.length !== 1 ? 's' : ''}!
            </div>
            <p className="text-sm text-muted-foreground">
              Patterns: {lastWin.wonPatterns.join(', ')}
            </p>
          </div>
        )}

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

      {/* Share Dialog */}
      {showShareDialog && (
        <ShareDialog 
          game={game}
          open={showShareDialog}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}