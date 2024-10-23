import { useEffect, useState } from 'react';
import { Room } from 'src/models/Room';
import { RoomApi } from 'src/data/RoomApi';

export const useRoom = ({ roomId }: { roomId: string }) => {
  const [room, setRoom] = useState<Room | null>(null);

  const sendMessage = ({ message }: { message: string }) => {
    console.log(message);
  };

  const api = new RoomApi();

  // ルームを取得
  useEffect(() => {
    // TODO: ルームを取得する処理
    const fetchRoom = async () => {
      try{
        const room = await api.getRoom({ roomId: roomId });
        console.log({
          tag: 'room',
          room: room,
        });
        setRoom(room);
      }catch (error) {
        console.error(error);
      }
    };
    fetchRoom()
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
