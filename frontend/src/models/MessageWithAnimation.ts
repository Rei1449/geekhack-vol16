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
  scale: number;
  blur: number;
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
  scale?: number;
  blur?: number;
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
      scale: 1,
      blur: 0,
    },
  };
}

export function updateAnimationParams(message: MessageWithAnimation) {
  message.animationParams.opacity = getOpacity(message);
  message.animationParams.scale = getScale(message);
  message.animationParams.blur = getBlur(message);
  return message;
}

function getOpacity(message: MessageWithAnimation) {
  const duration = 5 * 1000;
  const elapsedTime = Date.now() - message.createdAt;
  const opacity = 1 - elapsedTime / duration;
  return opacity;
}

function getScale(message: MessageWithAnimation) {
  const duration = 5 * 1000;
  const elapsedTime = Date.now() - message.createdAt;
  const scale = 1 - elapsedTime / duration;
  return Math.max(0, scale);
}

function getBlur(message: MessageWithAnimation) {
  const maxBlur = 5;
  const duration = 5 * 1000;
  const elapsedTime = Date.now() - message.createdAt;
  const blur = maxBlur - (maxBlur * (1 - elapsedTime / duration));
  return Math.min(maxBlur, blur);
}
