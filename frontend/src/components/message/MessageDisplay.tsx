import { useEffect, useState } from 'react';
import { Message } from 'src/models/Message';
import {
  MessageWithAnimation,
  createMessageWithAnimation,
  updateAnimationParams,
} from 'src/models/MessageWithAnimation';
import styled from 'styled-components';

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
            fontSize: 32,
            opacity: message.animationParams.opacity,
            position: 'absolute',
            top: message.animationParams.position.y,
            left: message.animationParams.position.x,
            transform: `scale(${message.animationParams.scale})`,
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
  overflow: hidden;

  background-color: #f0f0f0;
`;
