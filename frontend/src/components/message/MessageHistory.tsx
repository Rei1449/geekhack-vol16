import {
  isMessageContainedArray,
  isQuestion,
  Message,
} from 'src/models/Message';
import styled from 'styled-components';
import { HStack } from '../common/HStack';
import { VStack } from '../common/VStack';

export function MessageHistory({
  messages,
  isOpen,
  onClickOutside,
  onClose,
}: {
  messages: Message[];
  isOpen: boolean;
  onClickOutside: () => void;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <DialogOverlay onClick={onClickOutside}>
      <DialogWrapper>
        <Dialog onClick={(e) => e.stopPropagation()}>
          <HStack
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <DialogTitle>メッセージ履歴</DialogTitle>
            <CloseButton onClick={onClose}>X</CloseButton>
          </HStack>
          <VStack
            style={{
              flex: 1,
              gap: 12,
              marginTop: 16,
              overflowY: 'scroll',
            }}
          >
            {messages
              .filter(
                (messages) =>
                  !isMessageContainedArray(messages, [
                    '👍',
                    '😁',
                    '🤩',
                    '🤯',
                    '😑',
                    '🤔',
                    'わかる',
                    'ざわざわ',
                  ]),
              )
              .filter((messages) => isQuestion(messages))
              .map((message) => (
                <VStack style={{ gap: 0 }} key={message.id}>
                  <MessageText
                    style={{
                      fontSize: 12,
                      color: 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    匿名さん
                  </MessageText>
                  <MessageText>{message.message}</MessageText>
                </VStack>
              ))}
          </VStack>
        </Dialog>
      </DialogWrapper>
    </DialogOverlay>
  );
}

const DialogOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 16px;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const DialogWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: white;
  border-radius: 8px;
  height: 100%;
  max-height: 100%;
  width: 400px;
  max-width: 100%;
  padding: 16px;
  overflow: hidden;
`;

const DialogTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const MessageText = styled.div`
  font-family: 'Noto Sans JP', sans-serif;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 100%;
  height: 40px;
  width: 40px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.6);
  padding: 8px;
  margin: 0;
  appearance: none;
  user-select: none;
  outline: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
