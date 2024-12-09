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
  // const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);

  const [isHost, setIsHost] = useState(false);
  const [screenTrack, setScreenTrack] = useState<
    ILocalVideoTrack | IRemoteVideoTrack | null
  >(null);

  const initClient = useCallback(async () => {
    if (clientRef.current) return clientRef.current;

    // Next.jsのSSRでwindowオブジェクトが存在しないため、
    // クライアントサイドでのみ実行する
    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;
    return client;
  }, []);

  const startScreenShare = useCallback(async () => {
    const client = clientRef.current;

    console.log({
      tag: 'useScreenShare',
      action: 'startScreenShare',
      roomId,
      uid,
      client,
      connectionState: client?.connectionState,
    });

    if (!roomId) return;
    if (!client) return;

    // 切断中は接続できない
    const isDisconnecting = client.connectionState === 'DISCONNECTING';
    if (isDisconnecting) {
      return;
    }

    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const screenTrack = (await AgoraRTC.createScreenVideoTrack({
        displaySurface: 'window',
        encoderConfig: '720p_1',
        optimizationMode: 'motion',
      })) as ILocalVideoTrack;
      await client.publish(screenTrack);

      setScreenTrack(screenTrack);
      setIsHost(true);
    } catch (error) {
      console.error({
        tag: 'useScreenShare',
        action: 'startScreenShare',
        error,
      });
      setScreenTrack(null);
      setIsHost(false);
    }
  }, [roomId, uid]);

  const stopScreenShare = useCallback(async () => {
    const client = clientRef.current;
    setIsHost(false);

    if (!client) return;
    if (!screenTrack) return;

    try {
      (screenTrack as ILocalVideoTrack).stop();
      (screenTrack as ILocalVideoTrack).close();
      await client.unpublish(screenTrack as ILocalVideoTrack);
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
      const client = clientRef.current;

      console.log({
        tag: 'useScreenShare',
        action: 'user-published',
        mediaType,
        user,
        isHost,
        client,
      });

      if (!client) return;

      // ホストの場合は何もしない
      if (isHost) return;

      // 画面共有のみを受信する
      if (mediaType !== 'video') return;

      console.log({
        tag: 'useScreenShare',
        action: 'subscribe',
        user,
        mediaType,
      });
      await client.subscribe(user, mediaType);

      const remoteScreenTrack = user.videoTrack;
      if (!remoteScreenTrack) return;

      console.log({
        tag: 'useScreenShare',
        action: 'setScreenTrack',
        remoteScreenTrack,
      });
      setScreenTrack(remoteScreenTrack);
    },
    [isHost],
  );

  const handleUserUnpublished = useCallback(() => {
    console.log({ tag: 'useScreenShare', action: 'user-unpublished' });
    setScreenTrack(null);
  }, []);

  useEffect(() => {
    console.log({ tag: 'useScreenShare', action: 'screenTrack', screenTrack });
  }, [screenTrack]);

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
      console.log({ tag: 'useScreenShare', action: 'joinRoom', roomId, uid });
      if (!roomId || !uid) return;

      try {
        const isJoined = client.connectionState === 'CONNECTED';
        if (isJoined) {
          console.log({
            tag: 'useScreenShare',
            action: 'already-joined-and-leave',
          });
          await client.leave();
        }

        // 入室前に画面共有が始まっていた場合
        for (const user of client.remoteUsers) {
          console.log({ tag: 'useScreenShare', action: 'remoteUsers', user });
          if (user.videoTrack) {
            console.log({
              tag: 'useScreenShare',
              action: 'user-published',
              user,
            });
            setScreenTrack(user.videoTrack);
            break;
          }
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
    return () => {
      const client = clientRef.current;
      if (!client) return;
      console.log({ tag: 'useScreenShare', action: 'cleanup' });
      client.leave();
    };
  }, []);

  useEffect(() => {
    initClient().then((client) => {
      clientRef.current = client;
      joinRoom({ client, roomId, uid });
    });

    return () => {
      const client = clientRef.current;
      if (!client) return;
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
    };
  }, [uid, roomId]);

  return {
    isSharing: isHost,
    screenTrack,
    joinAsViewer: joinRoom,
    startScreenShare,
    stopScreenShare,
  };
};
