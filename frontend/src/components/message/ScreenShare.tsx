import { ILocalVideoTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import styled from 'styled-components';

export function ScreenShare({
  screenTrack,
  opacity = 1,
}: {
  screenTrack: ILocalVideoTrack | IRemoteVideoTrack | null;
  opacity?: number;
}) {
  return (
    <Container>
      {screenTrack && (
        <VideoWrapper
          style={{ opacity }}
          ref={(video) => {
            if (!video) return;
            screenTrack.play(video);
          }}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const VideoWrapper = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain !important;
`;
