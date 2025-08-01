'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BingoCard } from '@/components/BingoCard';
import { ShareDialog } from '@/components/ShareDialog';
import { BingoGame, GameState } from '@/lib/types';
import { getGame, saveGame } from '@/lib/storage';
import { decodeGameFromUrl, isValidEncodedGame } from '@/lib/urlEncoding';
import { createGame } from '@/lib/storage';

interface UnifiedPlayPageProps {
  encodedData?: string;
  gameId?: string;
}

export function UnifiedPlayPage({ encodedData, gameId }: UnifiedPlayPageProps) {
  const router = useRouter();
  const [game, setGame] = useState<BingoGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [lastWin, setLastWin] = useState<GameState | null>(null);
  const [isSharedGame, setIsSharedGame] = useState(false);

  useEffect(() => {
    const loadGame = () => {
      try {
        console.log('loadGame: encodedData', encodedData);
        // Priority 1: Load shared game from URL data
        if (encodedData) {
          if (!isValidEncodedGame(encodedData)) {
            setError('Invalid game data');
            return;
          }

          const shareableGame = decodeGameFromUrl(encodedData);
          const importedGame = createGame(shareableGame.title, shareableGame.items, true);
          
          // Save the imported game to local storage
          saveGame(importedGame);

          // Redirect to the imported game
          router.replace(`/play/${importedGame.id}`);
          return;
        }

        // Priority 2: Load saved game by ID
        if (gameId) {
          const savedGame = getGame(gameId);
          if (!savedGame) {
            setError('Game not found');
            return;
          }
          setGame(savedGame);
          setIsSharedGame(false);
          return;
        }

        // No game specified
        setError('No game specified');
      } catch (error) {
        console.error('Error loading game:', error);
        setError('Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [encodedData, gameId]);

  const handleWin = (gameState: GameState) => {
    setLastWin(gameState);
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

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">{isSharedGame ? '❌' : '🎲'}</div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {isSharedGame ? 'Invalid Game Link' : 'Game Not Found'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error || (isSharedGame
              ? 'The shared game link is invalid or corrupted.'
              : 'The game you\'re looking for doesn\'t exist or has been deleted.'
            )}
          </p>
          <div className="space-y-2">
            {isSharedGame && (
              <p className="text-sm text-muted-foreground">
                Try asking the sender for a new link, or create your own game.
              </p>
            )}
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
            ← {isSharedGame ? 'Create Your Own Games' : 'Back to Games'}
          </Link>

          {/* Shared Game Notice */}
          {isSharedGame && (
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
          )}
        </div>

        {/* Bingo Card */}
        <BingoCard
          game={game}
          onWin={handleWin}
          className="mb-8"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!isSharedGame && (
            <Button
              onClick={() => setShowShareDialog(true)}
              variant="outline"
            >
              Share Game
            </Button>
          )}
          <Link href="/new">
            <Button variant={isSharedGame ? "default" : "outline"}>
              Create {isSharedGame ? 'Your Own' : 'New'} Game
            </Button>
          </Link>
          {isSharedGame && (
            <Link href="/">
              <Button variant="outline">
                Browse Games
              </Button>
            </Link>
          )}
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
      {showShareDialog && !isSharedGame && (
        <ShareDialog
          game={game}
          open={showShareDialog}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}