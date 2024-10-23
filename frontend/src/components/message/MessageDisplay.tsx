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
          createMessageWithAnimation({ message }),
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
            opacity: message.animationParams.opacity,
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

  background-color: #f0f0f0;
`;
