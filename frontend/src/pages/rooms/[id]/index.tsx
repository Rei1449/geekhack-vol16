import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { MessageDisplay } from 'src/components/message/MessageDisplay';
import { MessageForm } from 'src/components/message/MessageForm';
import { MessageHistory } from 'src/components/message/MessageHistory';
import { MoodGage } from 'src/components/message/MoodGage';
import { Tutorial } from 'src/components/message/Tutorial';
import { UserName } from 'src/components/message/UserName';
import { useRoom } from 'src/hooks/room';
import { REACTION_TEXT } from 'src/models/Message';
import styled from 'styled-components';

export default function RoomPage() {
  const router = useRouter();
  const { id } = useMemo(() => router.query, [router.query]);
  const { room, messages, sendMessage, isTutorialDone, moodPercentage } =
    useRoom({
      roomId: id as string,
    });
  const reactions = [...REACTION_TEXT.NEGATIVE, ...REACTION_TEXT.POSITIVE];
  const [isOpenMessageDialog, setIsOpenMessageDialog] = useState(false);
  const [userName, setUserName] = useState<string | undefined>();

  const handleSendMessage = useCallback(
    (value: string) => {
      sendMessage({ value });
    },
    [sendMessage],
  );

  const handleSendReaction = useCallback(
    ({ reaction }: { reaction: string }) => {
      sendMessage({ value: reaction });
    },
    [sendMessage],
  );

  return (
    <Wrapper>
      {room && isTutorialDone && (
        <RoomNameWrapper>
          <RoomName>{room.name}</RoomName>
        </RoomNameWrapper>
      )}
      <MessageDisplay messages={messages} />
      <Tutorial
        isVisible={!!room && !isTutorialDone}
        moodPercentage={moodPercentage}
      />
      <MessageForm
        reactions={reactions}
        onOpenMessageHistory={() => setIsOpenMessageDialog(true)}
        onSendMessage={handleSendMessage}
        onSendReaction={handleSendReaction}
      />
      <UserNameWrapper>
        <UserName name={userName} onChangeName={setUserName} />
      </UserNameWrapper>
      <MoodGageWrapper>
        <MoodGage percentage={moodPercentage} />
      </MoodGageWrapper>
      <MessageHistory
        messages={messages}
        isOpen={isOpenMessageDialog}
        onClickOutside={() => setIsOpenMessageDialog(false)}
        onClose={() => setIsOpenMessageDialog(false)}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f0f0f0;
`;

const MoodGageWrapper = styled.div`
  position: absolute;
  top: 8px;
  left: 16px;
`;

const RoomNameWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const RoomName = styled.div`
  font-size: 64px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const UserNameWrapper = styled.div`
  padding: 16px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;
