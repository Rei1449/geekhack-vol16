import { useCallback, useEffect, useState } from 'react';
import { RoomApi } from 'src/data/RoomApi';
import { calcMoodPercentage, Message } from 'src/models/Message';
import { Room } from 'src/models/Room';
import { v4 as uuidv4 } from 'uuid';

export const useRoom = ({ roomId }: { roomId: string }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [moodPercentage, setMoodPercentage] = useState<number>(0);
  const [isTutorialDone, setIsTutorialDone] = useState(false);

  const sendMessage = useCallback(
    async ({ value }: { value: string }) => {
      const message: Message = {
        id: uuidv4(),
        message: value,
        createdAt: Date.now(),
      };
      setMessages((prev) => {
        return [...prev, message];
      });

      const api = new RoomApi();
      await api.sendMessage({
        id: message.id,
        message: message.message,
        roomId,
      });
    },
    [roomId],
  );

  const pushMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      // 自分で送信したメッセージはすでに追加されている
      const isAlreadyExist = prev.some((m) => m.id === message.id);
      if (isAlreadyExist) {
        return prev;
      }
      return [...prev, message];
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
  }, [room]);

  // 盛り上がり度を1秒間隔で計算
  useEffect(() => {
    setMoodPercentage(
      calcMoodPercentage({
        messages,
      }),
    );

    const interval = setInterval(() => {
      setMoodPercentage(calcMoodPercentage({ messages }));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [messages]);

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
    messages,
    sendMessage,
    isTutorialDone,
    moodPercentage,
  };
};
