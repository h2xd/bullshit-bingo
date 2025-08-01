'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BingoGame } from '@/lib/types';
import { getGames, deleteGame } from '@/lib/storage';
import { createShareableUrl } from '@/lib/urlEncoding';

export function HomePage() {
  const [games, setGames] = useState<BingoGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = () => {
      try {
        const savedGames = getGames();
        setGames(savedGames.sort((a, b) => b.lastPlayed - a.lastPlayed));
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleDeleteGame = (gameId: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      deleteGame(gameId);
      setGames(games.filter(game => game.id !== gameId));
    }
  };

  const handleShareGame = (game: BingoGame) => {
    const shareUrl = createShareableUrl(game);
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(() => {
      alert(`Share this URL: ${shareUrl}`);
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🎯 Bullshit Bingo
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Create and share custom bingo games instantly
          </p>
          <Link href="/new">
            <Button size="lg" className="text-lg px-8 py-6">
              + Create New Game
            </Button>
          </Link>
        </div>

        {/* Games List */}
        {games.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">🎲</div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                No games yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Create your first bingo game to get started. Perfect for meetings, 
                conferences, or any situation requiring lighthearted engagement.
              </p>
              <Link href="/new">
                <Button>Create Your First Game</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Your Saved Games ({games.length})
              </h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <div 
                  key={game.id}
                  className="bg-card text-card-foreground rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 truncate" title={game.title}>
                      {game.title}
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Created: {formatDate(game.createdAt)}</p>
                      <p>Last played: {formatDate(game.lastPlayed)}</p>
                      <p>Played {game.playCount} time{game.playCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/play/${game.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        Play
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShareGame(game)}
                      className="flex-1"
                    >
                      Share
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteGame(game.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}