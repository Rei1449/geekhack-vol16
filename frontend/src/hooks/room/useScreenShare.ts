import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
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
    if (!roomId) return;
    if (!clientRef.current) return;

    // 切断中は接続できない
    const isDisconnecting = clientRef.current.connectionState === 'DISCONNECTING';
    if (isDisconnecting) {
      return;
    }

    setIsHost(true);

    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const screenTrack = (await AgoraRTC.createScreenVideoTrack({
        displaySurface: 'window',
        encoderConfig: '720p_1',
        optimizationMode: 'motion',
      })) as ILocalVideoTrack;
      setScreenTrack(screenTrack);

      await clientRef.current.publish(screenTrack);
    } catch (error) {
      console.error(error);
      setScreenTrack(null);
      setIsHost(false);
    }
  }, [roomId, uid]);

  const stopScreenShare = useCallback(async () => {
    setIsHost(false);

    if (!clientRef.current) return;
    if (!screenTrack) return;

    try {
      (screenTrack as ILocalVideoTrack).stop();
      (screenTrack as ILocalVideoTrack).close();
      await clientRef.current.unpublish(screenTrack as ILocalVideoTrack);
    } catch (error) {
      console.error({
        tag: 'useScreenShare',
        action: 'stopScreenShare',
        error,
      });
    } finally {
      setScreenTrack(null);
      setIsHost(false);
    }
  }, [isHost, screenTrack]);

  const handleUserPublished = useCallback(
    async (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video' | 'datachannel',
    ) => {
      console.log({ tag: 'useScreenShare', action: 'user-published', isHost });
     
      // ホストの場合は何もしない
      if (isHost) return;

      // 画面共有のみを受信する
      if(mediaType !== 'video') return;

      const client = clientRef.current;
      if (!client) return;
      
      await client.subscribe(user, mediaType);

      const remoteScreenTrack = user.videoTrack;
      if (!remoteScreenTrack) return;
      setScreenTrack(remoteScreenTrack);
    },
    [],
  );

  const handleUserUnpublished = useCallback(() => {
    console.log({ tag: 'useScreenShare', action: 'user-unpublished' });
    setScreenTrack(null);
  }, []);

  const joinRoom = useCallback(
    async ({
      roomId,
      uid,
      client,
    }: {
      roomId: string | null;
      uid: string | null;
      client: IAgoraRTCClient;
    }) => {
      if (!roomId || !uid) return;

      try {
        const isJoined = client.connectionState === 'CONNECTED';
        if (isJoined) {
          console.log({ tag: 'useScreenShare', action: 'already-joined-and-leave' });
          await client.leave();
        }
        
        console.log({ tag: 'useScreenShare', action: 'joinRoom', roomId, uid });
        await client.join(process.env.AGORA_APP_ID!, roomId, null, uid);

        client.removeAllListeners('user-published');
        client.removeAllListeners('user-unpublished');

        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);
      } catch (error) {
        console.error(`Failed to join as viewer: ${error}`);
      }
    },
    [isHost],
  );

  useEffect(() => {
    // Next.jsのSSRでwindowオブジェクトが存在しないため、
    // クライアントサイドでのみ実行する
    (async () => {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;
    })();

    return () => {
      if (!clientRef.current) return;
      console.log({ tag: 'useScreenShare', action: 'cleanup' });
      clientRef.current.leave();
    };
  }, []);

  useEffect(() => {
    if (!clientRef.current) return;
    joinRoom({ client: clientRef.current!, roomId, uid });

    return () => {
      if (!clientRef.current) return;
      clientRef.current.off('user-published', handleUserPublished);
      clientRef.current.off('user-unpublished', handleUserUnpublished);
    }
  }, [uid, roomId]);

  return {
    isSharing: isHost,
    screenTrack,
    joinAsViewer: joinRoom,
    startScreenShare,
    stopScreenShare,
  };
};
