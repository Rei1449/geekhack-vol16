import {
  IAgoraRTCClient,
  ILocalVideoTrack,
  IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useScreenShare = ({
  roomId,
  uid,
}: {
  roomId: string;
  uid: string;
}) => {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  
  const [isHost, setIsHost] = useState(false);
  const [screenTrack, setScreenTrack] = useState<
    ILocalVideoTrack | IRemoteVideoTrack | null
  >(null);

  const startScreenShare = useCallback(async () => {
    if(!roomId) return;
    if(!clientRef.current) return;

    setIsHost(true);

    try {
      clientRef.current.join(process.env.AGORA_APP_ID!, roomId, null, uid);
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default; 
      const screenTrack = (await AgoraRTC.createScreenVideoTrack({
        displaySurface: 'window',
      })) as ILocalVideoTrack;
      setScreenTrack(screenTrack);

      await clientRef.current.publish(screenTrack);
    } catch (error) {
      console.error(error);
    }
  }, [roomId, uid]);

  const stopScreenShare = useCallback(async () => {
    if (!clientRef.current) return;
    if (!screenTrack) return;

    try {
      (screenTrack as ILocalVideoTrack).stop(); 
      (screenTrack as ILocalVideoTrack).close();
      await clientRef.current.unpublish(screenTrack as ILocalVideoTrack);
      setScreenTrack(null);
      setIsHost(false);
    } catch (error) {
      console.error(error);
    }
  }, [isHost, screenTrack]);

  // 参加者として画面共有に参加
  const joinAsViewer = useCallback(async () => {
    if (!clientRef.current) return;

    setIsHost(false);
    try {
      clientRef.current.join(process.env.AGORA_APP_ID!, roomId, null, uid);
      clientRef.current.on('user-published', async (user, mediaType) => {
        console.log('user-published');
        if(clientRef.current === null) return;
        await clientRef.current.subscribe(user, mediaType);
        if (mediaType === 'video') {
          const remoteScreenTrack = user.videoTrack;
          if (!remoteScreenTrack) return;
          setScreenTrack(remoteScreenTrack);
        }
      });

      clientRef.current.on('user-unpublished', () => {
        if (!screenTrack) return;
        setScreenTrack(null);
      });
    } catch (error) {
      console.error(`Failed to join as viewer: ${error}`);
    }
  }, []);

  useEffect(() => {
    // Next.jsのSSRでwindowオブジェクトが存在しないため、
    // クライアントサイドでのみ実行する
    (async () => {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;
    })();

    joinAsViewer();

    return () => {
      if (!clientRef.current) return;
      clientRef.current.leave();
    };
  }, []);

  return {
    isSharing: isHost,
    screenTrack,
    joinAsViewer,
    startScreenShare,
    stopScreenShare,
  };
};
