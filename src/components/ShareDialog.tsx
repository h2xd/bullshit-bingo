'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BingoGame } from '@/lib/types';
import { createShareableUrl } from '@/lib/urlEncoding';

interface ShareDialogProps {
  game: BingoGame;
  open: boolean;
  onClose: () => void;
}

export function ShareDialog({ game, open, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl] = useState(() => createShareableUrl(game));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateQRCode = () => {
    // Simple QR code generation using a public API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
    window.open(qrUrl, '_blank');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card text-card-foreground p-6 rounded-lg max-w-md w-full mx-4 shadow-lg">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Share &ldquo;{game.title}&rdquo;</h3>
          <p className="text-sm text-muted-foreground">
            Anyone with this link can play your bingo game
          </p>
        </div>

        {/* Share URL */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button 
                onClick={handleCopy}
                variant={copied ? "default" : "outline"}
                className="shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <Button 
              onClick={generateQRCode}
              variant="outline"
              size="sm"
            >
              Generate QR Code
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              For easy mobile sharing
            </p>
          </div>

          {/* Share Tips */}
          <div className="p-3 bg-muted/50 rounded text-xs text-muted-foreground">
            <div className="font-medium mb-1">Sharing Tips:</div>
            <ul className="space-y-1">
              <li>• Send via email, text, or chat</li>
              <li>• Works on any device with a web browser</li>
              <li>• No account needed for recipients</li>
              <li>• Link includes the complete game data</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <Button onClick={onClose} className="flex-1">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}