import { Message } from 'src/models/Message';
import { Position } from 'src/models/Positive';
import { Size } from 'src/models/Size';

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
  position: Position; 
};

export function createMessageWithAnimation({
  message,
  windowSize,
  enterAt = Date.now(),
  opacity = 1,
}: {
  message: Message;
  windowSize: Size;
  enterAt?: number;
  opacity?: number;
}): MessageWithAnimation {
  const padding = 64;
  return {
    id: message.id,
    message: message.message,
    createdAt: message.createdAt,
    animationParams: {
      enterAt,
      opacity,
      position: {
        x: Math.random() * (windowSize.width - padding) + padding,
        y: Math.random() * (windowSize.height - padding) + padding,
      },
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
