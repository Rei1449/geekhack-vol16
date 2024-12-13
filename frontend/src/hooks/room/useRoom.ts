import { useCallback, useEffect, useState } from 'react';
import { RoomApi } from 'src/data/RoomApi';
import { calcMoodPercentage, Message } from 'src/models/Message';
import { Room } from 'src/models/Room';
import { v4 as uuidv4 } from 'uuid';

export const useRoom = ({ roomId }: { roomId: string }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [moodPercentage, setMoodPercentage] = useState<number>(0);
  const [isTutorialDone, setIsTutorialDone] = useState(false);
  const [userName, setUserName] = useState<string | undefined>();

  const sendMessage = useCallback(
    async ({ value, userName }: { value: string; userName?: string }) => {
      const message: Message = {
        id: uuidv4(),
        userName,
        message: value,
        createdAt: Date.now(),
      };

      setRoom((prev) => {
        if (prev) {
          return {
            ...prev,
            messages: [...prev.messages, message],
          };
        }
        return prev;
      });

      const api = new RoomApi();
      await api.sendMessage({
        id: message.id,
        roomId,
        userName,
        message: message.message,
      });
    },
    [roomId],
  );

  const pushMessage = useCallback((message: Message) => {
    setRoom((prev) => {
      if (prev) {
        // 自分で送信したメッセージはすでに追加されている
        const prevSendMessageIdx = prev.messages.findIndex(
          (m) => m.id === message.id,
        );
        const isAlreadyExist = prevSendMessageIdx !== -1;
        if (isAlreadyExist) {
          // すでに存在する場合は値を更新する
          prev.messages[prevSendMessageIdx] = message;
          return prev;
        }
        return {
          ...prev,
          messages: [...prev.messages, message],
        };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const api = new RoomApi();
    api
      .getRoom({ roomId: roomId })
      .then((room) => {
        setRoom(room);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      setRoom(null);
    };
  }, [roomId]);

  useEffect(() => {
    if (!room) {
      return;
    }
    const api = new RoomApi();
    const { close } = api.observeRoom({
      roomId: roomId,
      onMessage: ({ message }) => pushMessage(message),
    });

    return () => {
      close();
    };
  }, [room?.id]);

  // 盛り上がり度を1秒間隔で計算
  useEffect(() => {
    setMoodPercentage(
      calcMoodPercentage({
        messages: room?.messages ?? [],
      }),
    );

    const interval = setInterval(() => {
      setMoodPercentage(calcMoodPercentage({ messages: room?.messages ?? [] }));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [room?.messages]);

  // 盛り上がりが100%を超えたらチュートリアルを終了
  useEffect(() => {
    if (moodPercentage >= 100 && !isTutorialDone) {
      setTimeout(() => {
        setIsTutorialDone(true);
      }, 5000);
    }
  }, [moodPercentage]);

  return {
    room,
    userName,
    messages: room?.messages ?? [],
    sendMessage,
    isTutorialDone,
    moodPercentage,
    setUserName,
  };
};
