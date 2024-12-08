import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { MessageDisplay } from 'src/components/message/MessageDisplay';
import { MessageForm } from 'src/components/message/MessageForm';
import { MessageHistory } from 'src/components/message/MessageHistory';
import { MoodGage } from 'src/components/message/MoodGage';
import { ScreenShare } from 'src/components/message/ScreenShare';
import { Tutorial } from 'src/components/message/Tutorial';
import { useRoom } from 'src/hooks/room';
import { useScreenShare } from 'src/hooks/room/useScreenShare';
import { REACTION_TEXT } from 'src/models/Message';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

export default function RoomPage() {
  const router = useRouter();
  const { id } = useMemo(() => router.query, [router.query]);
  const { isSharing, screenTrack, startScreenShare, stopScreenShare } = useScreenShare({
    roomId: id as string,
    uid: uuidv4(), 
  });

  const { room, messages, sendMessage, isTutorialDone, moodPercentage } =
    useRoom({
      roomId: id as string,
    });
  const reactions = [...REACTION_TEXT.NEGATIVE, ...REACTION_TEXT.POSITIVE];
  const [isOpenMessageDialog, setIsOpenMessageDialog] = useState(false);

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
      <div style={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }}>
        <ScreenShare 
          screenTrack={screenTrack} 
          opacity={0.3}
        />
      </div>
      <MessageDisplay messages={messages} />
      <Tutorial
        isVisible={!!room && !isTutorialDone}
        moodPercentage={moodPercentage}
      />
      <MessageForm
        reactions={reactions}
        isSharingScreen={isSharing}
        onStartScreenShare={startScreenShare}
        onStopScreenShare={stopScreenShare}
        onOpenMessageHistory={() => setIsOpenMessageDialog(true)}
        onSendMessage={handleSendMessage}
        onSendReaction={handleSendReaction}
      />
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
