import { useCallback } from 'react';
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
  const getScoreColor = useCallback((score?: number) => {
    console.log('getScoreColor', score);
    score = Math.round(score || 0);
    const colors = [
      'rgb(204, 229, 255)', // Light blue
      'rgb(218, 234, 255)',
      'rgb(229, 225, 255)', // Light indigo
      'rgb(243, 225, 255)', // Light purple
      'rgb(255, 223, 248)', // Light magenta
      'rgb(255, 223, 234)', // Light pink
      'rgb(255, 223, 223)',
      'rgb(255, 214, 214)',
      'rgb(255, 204, 204)',
      'rgb(255, 191, 191)',
      'rgb(255, 178, 178)', // Light red
    ];
    if (!score) return colors[0];
    if (score < 0) return colors[0];
    if (score > colors.length) return colors[colors.length - 1];
    return colors[score];
  }, []);

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
                    {message?.userName ?? '匿名さん'}
                  </MessageText>
                  <HStack
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    <MessageText>{message.message}</MessageText>
                    <QuestionScore
                      style={{ backgroundColor: getScoreColor(message.score) }}
                    >
                      {Math.round(message.score || 0)}
                    </QuestionScore>
                  </HStack>
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
  flex: 1;
`;

const QuestionScore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 100%;
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
