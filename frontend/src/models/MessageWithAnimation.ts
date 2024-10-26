import { Size } from 'src/constants/Size';
import { Message } from 'src/models/Message';
import { Position } from 'src/models/Positive';
import { Size as SizeType } from 'src/models/Size';

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
  windowSize: SizeType;
  enterAt?: number;
  opacity?: number;
  scale?: number;
  blur?: number;
}): MessageWithAnimation {
  const padding = 64;
  const formHeight =
    Size.Room.Form.MessageArea.height +
    Size.Room.Form.ReactionButton.height +
    Size.Room.Form.gap +
    padding;

  return {
    id: message.id,
    message: message.message,
    createdAt: message.createdAt,
    animationParams: {
      enterAt,
      opacity,
      position: {
        x: Math.random() * (windowSize.width - padding) + padding,
        y: Math.random() * (windowSize.height - padding - formHeight) + padding,
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
  const elapsedTime = Date.now() - message.animationParams.enterAt;
  const opacity = 1 - elapsedTime / duration;
  return Math.max(0, opacity);
}

function getScale(message: MessageWithAnimation) {
  const duration = 5 * 1000;
  const elapsedTime = Date.now() - message.animationParams.enterAt;
  const scale = 1 - elapsedTime / duration;
  return Math.max(0, scale);
}

function getBlur(message: MessageWithAnimation) {
  const maxBlur = 5;
  const duration = 5 * 1000;
  const elapsedTime = Date.now() - message.animationParams.enterAt;
  const blur = maxBlur - maxBlur * (1 - elapsedTime / duration);
  return Math.min(maxBlur, blur);
}
