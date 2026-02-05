'use client';

import { useEventListener } from '@liveblocks/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import Confetti from '../confetti';

type EmojiReaction = {
  emoji: string;
  x: number;
  y: number;
  id: string;
  timestamp: number;
};

type ConfettiEffect = {
  emoji: string;
  x: number;
  y: number;
  id: string;
};

const REACTION_DURATION = 3000;

export type EmojiReactionsHandle = {
  addReaction: (emoji: string, x: number, y: number) => void;
  addConfetti: (emoji: string, x: number, y: number) => void;
};

const MAX_CONFETTI_INSTANCES = 3;

const POPULAR_EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '👏', '😮', '😢'];

const EmojiReactions = forwardRef<EmojiReactionsHandle>((_props, ref) => {
  const [reactions, setReactions] = useState<EmojiReaction[]>([]);
  const [confettiEffects, setConfettiEffects] = useState<ConfettiEffect[]>([]);

  const addReaction = useCallback((emoji: string, x: number, y: number) => {
    const newReaction: EmojiReaction = {
      emoji,
      x,
      y,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    setReactions((prev) => [...prev, newReaction]);

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, REACTION_DURATION);
  }, []);

  const addConfetti = useCallback((emoji: string, x: number, y: number) => {
    const newConfetti: ConfettiEffect = {
      emoji,
      x,
      y,
      id: `confetti-${Date.now()}-${Math.random()}`,
    };

    setConfettiEffects((prev) => {
      const updated =
        prev.length >= MAX_CONFETTI_INSTANCES
          ? [...prev.slice(1), newConfetti]
          : [...prev, newConfetti];
      return updated;
    });

    setTimeout(() => {
      setConfettiEffects((prev) => prev.filter((c) => c.id !== newConfetti.id));
    }, 2000);
  }, []);

  useImperativeHandle(ref, () => ({
    addReaction,
    addConfetti,
  }));

  const getToolbarButtonPosition = useCallback((emoji: string) => {
    const emojiIndex = POPULAR_EMOJIS.indexOf(emoji);

    if (emojiIndex === -1) {
      return {
        x: window.innerWidth / 2,
        y: window.innerHeight - 60,
      };
    }

    const toolbarCenterX = window.innerWidth / 2;
    const toolbarY = window.innerHeight - 60;
    const buttonWidth = 32;
    const gap = 4;
    const toolbarPadding = 12;
    const totalWidth =
      POPULAR_EMOJIS.length * buttonWidth +
      (POPULAR_EMOJIS.length - 1) * gap +
      toolbarPadding * 2;
    const startX = toolbarCenterX - totalWidth / 2 + toolbarPadding;
    const buttonX = startX + emojiIndex * (buttonWidth + gap) + buttonWidth / 2;

    return {
      x: buttonX,
      y: toolbarY,
    };
  }, []);

  const handleReaction = useCallback(
    (event: { type: 'REACTION'; emoji: string; x: number; y: number }) => {
      const buttonPos = getToolbarButtonPosition(event.emoji);
      addReaction(event.emoji, buttonPos.x, buttonPos.y);
    },
    [addReaction, getToolbarButtonPosition],
  );

  useEventListener(({ event }) => {
    if (event.type === 'REACTION') {
      handleReaction(
        event as { type: 'REACTION'; emoji: string; x: number; y: number },
      );
    } else if (event.type === 'CONFETTI') {
      const confettiEvent = event as {
        type: 'CONFETTI';
        emoji: string;
        x: number;
        y: number;
      };
      const buttonPos = getToolbarButtonPosition(confettiEvent.emoji);
      addConfetti(confettiEvent.emoji, buttonPos.x, buttonPos.y);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReactions((prev) =>
        prev.filter((r) => now - r.timestamp < REACTION_DURATION),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {reactions.map((reaction) => (
        <EmojiReaction key={reaction.id} reaction={reaction} />
      ))}
      {confettiEffects.map((confetti) => (
        <Confetti
          key={confetti.id}
          x={confetti.x}
          y={confetti.y}
          emoji={confetti.emoji}
          onComplete={() => {
            setConfettiEffects((prev) =>
              prev.filter((c) => c.id !== confetti.id),
            );
          }}
        />
      ))}
    </>
  );
});

const EmojiReaction = ({ reaction }: { reaction: EmojiReaction }) => {
  return (
    <div
      className="fixed pointer-events-none z-50 select-none"
      style={{
        left: `${reaction.x}px`,
        top: `${reaction.y}px`,
        transform: 'translate(-50%, 0)',
      }}
    >
      <div
        className="text-4xl"
        style={{
          animation: 'emojiRise 3s ease-out forwards',
          willChange: 'transform, opacity',
        }}
      >
        {reaction.emoji}
      </div>
    </div>
  );
};

EmojiReactions.displayName = 'EmojiReactions';

export default EmojiReactions;
