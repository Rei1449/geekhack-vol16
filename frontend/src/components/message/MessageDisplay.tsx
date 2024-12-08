import { Yusei_Magic } from '@next/font/google';
import { useEffect, useState } from 'react';
import { Message } from 'src/models/Message';
import {
  MessageWithAnimation,
  createMessageWithAnimation,
  updateAnimationParams,
} from 'src/models/MessageWithAnimation';
import styled from 'styled-components';

const yuseimagic = Yusei_Magic({ weight: ['400'], subsets: ['latin'] });

export const MessageDisplay = ({
  messages: defaultMessages,
}: {
  messages: Message[];
}) => {
  const [messages, setMessages] = useState<MessageWithAnimation[]>([]);

  // 新規メッセージを追加
  useEffect(() => {
    setMessages((prev) => {
      const newMessages = defaultMessages.filter((message) => {
        const isExist = prev.find(
          (prevMessage) => prevMessage.id === message.id,
        );
        return !isExist;
      }).filter((message) => {
        return message.createdAt > Date.now()/1000-10;
      });

      prev.push(
        ...newMessages.map((message) =>
          createMessageWithAnimation({
            message,
            windowSize: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
          }),
        ),
      );

      return prev;
    });
  }, [defaultMessages]);

  useEffect(() => {
    // 60FPSでアニメーションを更新
    const interval = setInterval(() => {
      setMessages((prev) => {
        return prev.map((message) => {
          return updateAnimationParams(message);
        });
      });
    }, 1000 / 60);

    return () => {
      clearInterval(interval);
    };
  }, [messages]);

  return (
    <Wrapper>
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            fontSize: 64,
            fontFamily: yuseimagic.style.fontFamily,
            opacity: message.animationParams.opacity,
            position: 'absolute',
            top: message.animationParams.position.y,
            left: message.animationParams.position.x,
            transform: `scale(${message.animationParams.scale})`,
            filter: `blur(${message.animationParams.blur}px)`,
          }}
        >
          {message.message}
        </div>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  position: relative;
  overflow: hidden;
`;
