import { useMemo } from 'react';

type Reaction = {
  type: 'emoji' | 'phrase';
  text: '🤯' | '😑' | '🤔' | '👍' | '🥹' | '🤩' | 'わかる' | 'わからん';
  emotion: 'positive' | 'negative';
};
function useReaction() {
  const reactions: Reaction[] = useMemo(
    () => [
      {
        text: 'わからん',
        emotion: 'negative',
        type: 'phrase',
      },
      {
        text: '🤯',
        emotion: 'negative',
        type: 'emoji',
      },
      {
        text: '😑',
        emotion: 'negative',
        type: 'emoji',
      },
      {
        text: '🤔',
        emotion: 'negative',
        type: 'emoji',
      },
      {
        text: '👍',
        emotion: 'positive',
        type: 'emoji',
      },
      {
        text: '🥹',
        emotion: 'positive',
        type: 'emoji',
      },
      {
        text: '🤩',
        emotion: 'positive',
        type: 'emoji',
      },
      {
        text: 'わかる',
        emotion: 'positive',
        type: 'phrase',
      },
    ],
    []
  );

  return { reactions };
}

export { useReaction };
