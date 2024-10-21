import { useMemo } from 'react';

const ReactionType = {
  EMOJI: 'emoji',
  PHRASE: 'phrase',
} as const;
type ReactionType = (typeof ReactionType)[keyof typeof ReactionType];

const ReactionText = {
  EMOJI_SET: ['🤯', '😑', '🤔', '👍', '🥹', '🤩'] as const,
  PHRASE_SET: ['わかる', 'わからん'] as const,
};
type EmojiText = (typeof ReactionText.EMOJI_SET)[number];
type PhraseText = (typeof ReactionText.PHRASE_SET)[number];
type ReactionTextType = EmojiText | PhraseText;

const SentimentType = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
} as const;
type SentimentType = (typeof SentimentType)[keyof typeof SentimentType];

type Reaction = {
  type: ReactionType;
  text: ReactionTextType;
  sentiment: SentimentType;
};

function useReaction() {
  const reactions: Reaction[] = useMemo(
    () => [
      {
        text: 'わからん',
        sentiment: 'negative',
        type: 'phrase',
      },
      {
        text: '🤯',
        sentiment: 'negative',
        type: 'emoji',
      },
      {
        text: '😑',
        sentiment: 'negative',
        type: 'emoji',
      },
      {
        text: '🤔',
        sentiment: 'negative',
        type: 'emoji',
      },
      {
        text: '👍',
        sentiment: 'positive',
        type: 'emoji',
      },
      {
        text: '🥹',
        sentiment: 'positive',
        type: 'emoji',
      },
      {
        text: '🤩',
        sentiment: 'positive',
        type: 'emoji',
      },
      {
        text: 'わかる',
        sentiment: 'positive',
        type: 'phrase',
      },
    ],
    []
  );

  return { reactions };
}

export { useReaction };
