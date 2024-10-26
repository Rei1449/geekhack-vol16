import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { MessageDisplay } from 'src/components/message/MessageDisplay';
import { MoodGage } from 'src/components/message/MoodGage';
import SendIcon from 'src/components/svg/send.svg';
import { Size } from 'src/constants/Size';
import { useRoom } from 'src/hooks/useRoom';
import { isEmoji, REACTION_TEXT } from 'src/models/Message';
import styled from 'styled-components';

export default function RoomPage() {
  const router = useRouter();
  const { id } = useMemo(() => router.query, [router.query]);
  const [inputText, setInputText] = useState('');
  const { messages, sendMessage, moodPercentage } = useRoom({
    roomId: id as string,
  });
  const reactions = [...REACTION_TEXT.NEGATIVE, ...REACTION_TEXT.POSITIVE];

  const handleSendMessage = useCallback(() => {
    if (inputText === '') return;
    sendMessage({ value: inputText });
    setInputText('');
  }, [inputText, sendMessage]);

  const handleSendReaction = useCallback(
    ({ reaction }: { reaction: string }) => {
      sendMessage({ value: reaction });
    },
    [sendMessage],
  );

  return (
    <Wrapper>
      <MessageDisplay messages={messages} />
      <FormWrapper>
        <ReactionButtonStack>
          {reactions.map((reaction, index) =>
            isEmoji(reaction) ? (
              <EmojiReactionButton
                key={index}
                onClick={() => handleSendReaction({ reaction })}
              >
                {reaction}
              </EmojiReactionButton>
            ) : (
              <PhraseReactionButton
                key={index}
                onClick={() => handleSendReaction({ reaction })}
              >
                {reaction}
              </PhraseReactionButton>
            ),
          )}
        </ReactionButtonStack>
        <MessageFormWrapper>
          <MessageFormInputArea>
            <MessageFormInput
              placeholder="メッセージを入力"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </MessageFormInputArea>
          <MessageSendButton onClick={handleSendMessage}>
            <SendIcon color="#444444" style={{ userSelect: 'none' }} />
          </MessageSendButton>
        </MessageFormWrapper>
      </FormWrapper>
      <MoodGageWrapper>
        <MoodGage percentage={moodPercentage} />
      </MoodGageWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const MoodGageWrapper = styled.div`
  position: absolute;
  top: 8px;
  left: 16px;
`;

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

const MessageFormInputArea = styled.div`
  flex: 1;
  height: ${Size.Room.Form.MessageArea.height}px;
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
