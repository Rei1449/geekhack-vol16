import { useMemo } from 'react';

type Reaction = {
  type: 'emoji' | 'phrase';
  text: '🤯' | '😑' | '🤔' | '👍' | '🥹' | '🤩' | 'わかる' | 'わからん';
  sentiment: 'positive' | 'negative';
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
