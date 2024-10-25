export type Message = {
  id: string;
  message: string;
  createdAt: number;
};

export const REACTION_TEXT = {
  POSITIVE: ['👍', '🥹', '🤩', 'わかる'] as const,
  NEGATIVE: ['わからん', '🤯', '😑', '🤔'] as const,
};

export function isPositiveReaction(message: Message): boolean {
  return (REACTION_TEXT.POSITIVE as readonly string[]).includes(
    message.message,
  );
}

export function isNegativeReaction(message: Message): boolean {
  return (REACTION_TEXT.NEGATIVE as readonly string[]).includes(
    message.message,
  );
}

export function isEmoji(reactionText: string) {
  // INFO: 特定用途（絵文字一覧表示に使う絵文字だけ検知できればOK）で作りました
  // cf. https://corycory.hateblo.jp/entry/javascript/javascrip-reg-emoji/
  const regEmoji = new RegExp(
    /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/,
    'g',
  );
  return regEmoji.test(reactionText);
}
