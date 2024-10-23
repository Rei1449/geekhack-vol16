import { useEffect, useState } from 'react';
import { Room } from 'src/models/Room';

export const useRoom = ({ roomId }: { roomId: string }) => {
  const [room, setRoom] = useState<Room | null>(null);

  const sendMessage = ({ message }: { message: string }) => {
    console.log(message);
  };

  // ルームを取得
  useEffect(() => {
    // TODO: ルームを取得する処理
    setRoom(null);

    return () => {
      setRoom(null);
    };
  }, [roomId]);

  useEffect(() => {
    if (!room) {
      return;
    }

    // TODO: roomのメッセージをobserveする処理
  }, [room]);

  return {
    room,
    sendMessage,
  };
};
