'use client';

import { useBroadcastEvent } from '@liveblocks/react';
import { useCallback, useRef } from 'react';

import { Button } from '@/components/ui/button';

const POPULAR_EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '👏', '😮', '😢'];
const CONFETTI_THRESHOLD = 3;
const CONFETTI_TIME_WINDOW = 1000;
const CONFETTI_COOLDOWN = 500;

type EmojiToolbarProps = {
  onEmojiClick?: (emoji: string) => void;
  getLastScreenPosition?: () => { x: number; y: number } | null;
  onReaction?: (emoji: string, x: number, y: number) => void;
  onConfetti?: (emoji: string, x: number, y: number) => void;
};

const EmojiToolbar = ({
  onEmojiClick,
  onReaction,
  onConfetti,
}: EmojiToolbarProps) => {
  const broadcast = useBroadcastEvent();
  const clickTimestampsRef = useRef<Map<string, number[]>>(new Map());
  const lastConfettiTimeRef = useRef<Map<string, number>>(new Map());

  const getButtonPosition = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    },
    [],
  );

  const handleEmojiClick = useCallback(
    (emoji: string, event: React.MouseEvent<HTMLButtonElement>) => {
      const buttonPos = getButtonPosition(event);
      const x = buttonPos.x;
      const y = buttonPos.y;

      const now = Date.now();
      const timestamps = clickTimestampsRef.current.get(emoji) || [];

      const recentTimestamps = timestamps.filter(
        (timestamp) => now - timestamp < CONFETTI_TIME_WINDOW,
      );

      recentTimestamps.push(now);
      clickTimestampsRef.current.set(emoji, recentTimestamps);

      const lastConfettiTime = lastConfettiTimeRef.current.get(emoji) || 0;
      const timeSinceLastConfetti = now - lastConfettiTime;

      if (
        recentTimestamps.length >= CONFETTI_THRESHOLD &&
        timeSinceLastConfetti > CONFETTI_COOLDOWN
      ) {
        onConfetti?.(emoji, x, y);

        broadcast({
          type: 'CONFETTI',
          emoji,
          x,
          y,
        });

        clickTimestampsRef.current.set(emoji, []);
        lastConfettiTimeRef.current.set(emoji, now);
      } else {
        onReaction?.(emoji, x, y);

        broadcast({
          type: 'REACTION',
          emoji,
          x,
          y,
        });
      }

      onEmojiClick?.(emoji);
    },
    [broadcast, getButtonPosition, onEmojiClick, onReaction, onConfetti],
  );

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-2 shadow-lg border border-neutral-200 flex items-center gap-1 z-50">
      {POPULAR_EMOJIS.map((emoji) => (
        <Button
          key={emoji}
          variant="ghost"
          size="icon-sm"
          className="hover:bg-neutral-100 rounded-full text-xl transition-all hover:scale-110 active:scale-95"
          onClick={(e) => handleEmojiClick(emoji, e)}
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
};

export default EmojiToolbar;
