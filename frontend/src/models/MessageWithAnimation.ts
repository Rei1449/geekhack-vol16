import { Message } from 'src/models/Message';

export type MessageWithAnimation = {
  id: string;
  message: string;
  createdAt: number;
  animationParams: AnimationParams;
};

export type AnimationParams = {
  // 描画開始タイミング
  enterAt: number;
  opacity: number;
};

export function createMessageWithAnimation({
  message,
  enterAt = Date.now(),
  opacity = 1,
}: {
  message: Message;
  enterAt?: number;
  opacity?: number;
}): MessageWithAnimation {
  return {
    id: message.id,
    message: message.message,
    createdAt: message.createdAt,
    animationParams: {
      enterAt,
      opacity,
    },
  };
}

export function updateAnimationParams(message: MessageWithAnimation) {
  message.animationParams.opacity = getOpacity(message);
  return message;
}

function getOpacity(message: MessageWithAnimation) {
  const duration = 5 * 1000;
  const elapsedTime = Date.now() - message.createdAt;
  const opacity = 1 - elapsedTime / duration;
  return opacity;
}
