'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createGame, saveGame } from '@/lib/storage';
import { createShareableUrl } from '@/lib/urlEncoding';

export function GameCreationForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [itemsText, setItemsText] = useState('');
  const [items, setItems] = useState<string[]>(Array(25).fill(''));
  const [inputMode, setInputMode] = useState<'list' | 'textarea'>('list');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value.slice(0, 100));
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value.slice(0, 200);
    setItems(newItems);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setItemsText(text);
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const newItems = Array(25).fill('');
    
    for (let i = 0; i < Math.min(lines.length, 25); i++) {
      newItems[i] = lines[i].slice(0, 200);
    }
    
    setItems(newItems);
  };

  const switchToTextarea = () => {
    const validItems = items.filter(item => item.trim().length > 0);
    setItemsText(validItems.join('\n'));
    setInputMode('textarea');
  };

  const switchToList = () => {
    setInputMode('list');
  };

  const handlePreview = () => {
    // Validate form
    if (!title.trim()) {
      alert('Please enter a game title');
      return;
    }

    const validItems = items.filter(item => item.trim().length > 0);
    if (validItems.length !== 25) {
      alert(`Please enter exactly 25 items (you have ${validItems.length})`);
      return;
    }

    // For preview, we can show the BingoCard component here
    // For now, just validate and continue to save
    handleSave();
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      if (!title.trim()) {
        throw new Error('Please enter a game title');
      }

      const validItems = items.filter(item => item.trim().length > 0);
      if (validItems.length !== 25) {
        throw new Error(`Please enter exactly 25 items (you have ${validItems.length})`);
      }

      const game = createGame(title.trim(), validItems);
      saveGame(game);
      
      const url = createShareableUrl(game);
      setShareUrl(url);

      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Game created and share link copied to clipboard!');
      } catch {
        alert('Game created! Share link: ' + url);
      }

      // Redirect to the game
      router.push(`/play/${game.id}`);
      
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const fillExampleData = () => {
    setTitle('Meeting Bingo');
    const exampleItems = [
      'Synergy', 'ROI', 'Pivot', 'Scale', 'Agile',
      'Touch base', 'Bandwidth', 'Circle back', 'Deep dive', 'Low-hanging fruit',
      'Think outside the box', 'Move the needle', 'Best practice', 'Value-add', 'Streamline',
      'Leverage', 'Ideate', 'Paradigm shift', 'Game changer', 'Disruptive',
      'Holistic approach', 'Core competency', 'Strategic alignment', 'Win-win', 'Action item'
    ];
    setItems(exampleItems);
    setItemsText(exampleItems.join('\n'));
  };

  const clearForm = () => {
    setTitle('');
    setItems(Array(25).fill(''));
    setItemsText('');
    setShareUrl('');
  };

  const filledItems = items.filter(item => item.trim().length > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Bingo Game
          </h1>
          <p className="text-muted-foreground">
            Create a custom 25-item bingo card to share with others
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="space-y-6">
            {/* Game Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                Game Title *
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter game title (e.g., Meeting Bingo)"
                value={title}
                onChange={handleTitleChange}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>

            {/* Input Mode Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Enter 25 Bingo Items * ({filledItems}/25)
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={inputMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={switchToList}
                >
                  Individual Fields
                </Button>
                <Button
                  type="button"
                  variant={inputMode === 'textarea' ? 'default' : 'outline'}
                  size="sm"
                  onClick={switchToTextarea}
                >
                  Text Area
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={fillExampleData}
                >
                  Fill Example
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearForm}
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Items Input */}
            {inputMode === 'list' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <Input
                      type="text"
                      placeholder={`Item ${index + 1}`}
                      value={item}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea
                  placeholder="Enter one item per line (25 items total)\nExample:\nSynergy\nROI\nPivot\n..."
                  value={itemsText}
                  onChange={handleTextareaChange}
                  rows={15}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter one item per line. First 25 non-empty lines will be used.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePreview}
                disabled={loading || !title.trim() || filledItems !== 25}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Preview & Save'}
              </Button>
            </div>

            {shareUrl && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">
                  Share URL (copied to clipboard):
                </p>
                <p className="text-xs text-muted-foreground break-all">
                  {shareUrl}
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Preview</h3>
            
            {title && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground">{title}</h4>
              </div>
            )}

            <div className="grid grid-cols-5 gap-1 p-4 bg-muted rounded-lg">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center text-xs p-1 rounded text-center
                    ${index === 12 
                      ? 'bg-highlight text-foreground font-semibold' 
                      : item.trim() 
                        ? 'bg-card text-card-foreground border' 
                        : 'bg-secondary/50 text-muted-foreground border-dashed border'
                    }
                  `}
                  title={item || `Item ${index + 1}`}
                >
                  {index === 12 ? 'FREE' : item || (index + 1)}
                </div>
              ))}
            </div>

            <div className="text-xs text-muted-foreground">
              <p>• Items will be randomly arranged when playing</p>
              <p>• Center square is always &ldquo;FREE&rdquo;</p>
              <p>• Players mark squares to complete rows, columns, or diagonals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}