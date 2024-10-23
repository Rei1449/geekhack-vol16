import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import SendIcon from 'src/components/svg/send.svg';
import { useRoom } from 'src/hooks/useRoom';
import { Message } from 'src/models/Message';
import styled from 'styled-components';

export default function RoomPage() {
  const router = useRouter();
  const { id } = router.query;
  const [inputText, setInputText] = useState('');
  const { room, sendMessage } = useRoom({ roomId: id as string });

  // TODO: DELETE ME
  const [messages, setMessages] = useState<Message[]>([]);

  const emojis = ['🤯', '😑', '🤔', '👍', '🥹', '🤩'];

  const onSendMessage = useCallback(() => {
    if (inputText === '') return;

    // TODO: DELETE ME
    setMessages((prev) => {
      return [
        ...prev,
        {
          message: inputText,
          createdAt: Date.now(),
          id: Date.now().toString(),
        },
      ];
    });

    sendMessage({ message: inputText });
    setInputText('');
  }, [inputText]);

  const onSendEmoji = useCallback(({ emoji }: { emoji: string }) => {
    // TODO: DELETE ME
    setMessages((prev) => {
      return [
        ...prev,
        { message: emoji, createdAt: Date.now(), id: Date.now().toString() },
      ];
    });

    sendMessage({ message: emoji });
  }, []);

  return (
    <Wrapper>
      <RoomName>Room: {room?.name}</RoomName>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message.message}</div>
        ))}
      </div>
      <FormWrapper>
        <EmojiWrapper>
          {emojis.map((emoji, index) => (
            <EmojiContainer key={index} onClick={() => onSendEmoji({ emoji })}>
              {emoji}
            </EmojiContainer>
          ))}
        </EmojiWrapper>
        <MessageFormWrapper>
          <MessageFormInputArea>
            <MessageFormInput
              placeholder="メッセージを入力"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </MessageFormInputArea>
          <MessageSendButton onClick={onSendMessage}>
            <SendIcon color="#444444" style={{ userSelect: 'none' }} />
          </MessageSendButton>
        </MessageFormWrapper>
      </FormWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
`;

const RoomName = styled.div`
  font-size: 24px;
  font-weight: 500;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 8px;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

const MessageFormWrapper = styled.div`
  display: flex;
  gap: 16px;
  width: 600px;
  max-width: 100%;
`;

const MessageFormInputArea = styled.div`
  flex: 1;
  height: 50px;
  display: flex;

  background-color: white;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 10px 10px 0 rgb(156 160 160 / 40%);
  padding: 0 16px;
`;

const MessageFormInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;

  &:focus {
    outline: none;
  }
`;

const MessageSendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  transition: all 0.3s;

  background-color: white;
  box-shadow: 10px 10px 0 rgb(156 160 160 / 40%);
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 24px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    transform: scale(0.5);
  }
`;

const EmojiWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const EmojiContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  width: 48px;
  height: 48px;
  border-radius: 20px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  user-select: none;
  transition: all 0.3s;

  &:active {
    transform: scale(0.7);
  }
`;
