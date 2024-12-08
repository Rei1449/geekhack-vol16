import { useCallback, useEffect, useRef, useState } from 'react';
import SendIcon from 'src/components/svg/send.svg';
import { Size } from 'src/constants/Size';
import { isEmoji } from 'src/models/Message';
import styled from 'styled-components';

export function MessageForm({
  reactions,
  onSendReaction,
  onSendMessage,
}: {
  reactions: string[];
  onSendReaction: (params: { reaction: string }) => void;
  onSendMessage: (value: string) => void;
}) {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputText === '') return;
      onSendMessage(inputText);
      setInputText('');
      inputRef.current?.focus();
    },
    [inputText, onSendMessage],
  );

  // 常にinput要素にfocusが当たるように
  useEffect(() => {
    inputRef.current?.focus();
    // inputからfocusが外れたとき、tabキーを押したらinput要素にfocusが戻るようにする
    const handleTabPress = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        inputRef.current?.focus(); // input要素にfocusを戻す
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleTabPress);
    return () => {
      window.removeEventListener('keydown', handleTabPress);
    };
  }, []);

  return (
    <FormWrapper>
      <ReactionButtonStack>
        {reactions.map((reaction, index) =>
          isEmoji(reaction) ? (
            <EmojiReactionButton
              key={index}
              onClick={() => onSendReaction({ reaction })}
            >
              {reaction}
            </EmojiReactionButton>
          ) : (
            <PhraseReactionButton
              key={index}
              onClick={() => onSendReaction({ reaction })}
            >
              {reaction}
            </PhraseReactionButton>
          ),
        )}
      </ReactionButtonStack>
      <MessageFormWrapper>
        <MessageFormComponent onSubmit={handleSendMessage}>
          <MessageFormInput
            ref={inputRef}
            type="text"
            placeholder="メッセージを入力"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <MessageFormSubmitButton type="submit">
            <SendIcon color="#444444" style={{ userSelect: 'none' }} />
          </MessageFormSubmitButton>
        </MessageFormComponent>
      </MessageFormWrapper>
    </FormWrapper>
  );
}

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${Size.Room.Form.padding}px;
  gap: ${Size.Room.Form.gap}px;

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

const MessageFormComponent = styled.form`
  flex: 1;
  display: flex;

  height: ${Size.Room.Form.MessageArea.height}px;
  padding: 4px 16px;

  background-color: white;
  border: 1px solid rgba(100, 100, 100, 0.1);
  border-radius: 50px;
  box-shadow: 10px 10px 0 rgb(156 160 160 / 40%);
`;

const MessageFormInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;

  &:focus {
    outline: none;
  }
`;

const MessageFormSubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 50px;
  height: 50px;

  color: white;
  background-color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  font-weight: 500;
  cursor: pointer;

  transition: all 0.3s;

  &:active {
    transform: scale(0.5);
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const ReactionButtonStack = styled.div`
  display: flex;
  gap: 4px;
`;

const BaseReactionButton = styled.button`
  cursor: pointer;
  width: ${Size.Room.Form.ReactionButton.height}px;
  height: ${Size.Room.Form.ReactionButton.height}px;
  padding: 2px;
  border-radius: 20px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  user-select: none;
  transition: all 0.3s;

  &:active {
    transform: scale(0.7);
  }
`;

const EmojiReactionButton = styled(BaseReactionButton)`
  font-size: 32px;
`;

const PhraseReactionButton = styled(BaseReactionButton)`
  font-size: 16px;
  width: auto;
  white-space: nowrap;
  padding-inline: 6px;
`;
