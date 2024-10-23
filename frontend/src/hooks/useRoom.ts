import { useEffect, useState } from 'react';
import { RoomApi } from 'src/data/RoomApi';
import { Message } from 'src/models/Message';
import { Room } from 'src/models/Room';

export const useRoom = ({ roomId }: { roomId: string }) => {
  const [room, setRoom] = useState<Room | null>(null);

  const sendMessage = ({ message }: { message: string }) => {
    console.log(message);
  };

  const api = new RoomApi();

  useEffect(() => {
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
    api.observeRoom({
      roomId: roomId,
      onMessage: ({ message }: { message: Message }) => console.log(message),
    });
  }, [room]);

  return {
    room,
    sendMessage,
  };
};
