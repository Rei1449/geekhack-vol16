export type Message = {
  id: string;
  message: string;
  createdAt: number;
};

export const REACTION_TEXT = {
  POSITIVE: ['👍', '😁', '🤩', 'わかる'] as const,
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

/**
 * @param durationInSec: 考慮するメッセージの時間範囲（秒） この時間が長いと、盛り上がり度の動きが小さくなる。
 * @param maxMessageCount: 100%とするメッセージ数
 * @returns 盛り上がり度をパーセンテージで返す(0-100)
 */
export function calcMoodPercentage({
  messages,
  durationInSec = 30,
  maxMessageCount = 50,
}: {
  messages: Message[];
  durationInSec?: number;
  maxMessageCount?: number;
}): number {
  const startAt = Date.now() - durationInSec * 1000;
  const messagesInDuration = messages.filter(
    (message) => message.createdAt > startAt,
  );
  return Math.min(messagesInDuration.length / maxMessageCount, 1.0) * 100;
}
