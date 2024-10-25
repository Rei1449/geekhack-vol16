import { useEffect, useState } from 'react';
import { RoomApi } from 'src/data/RoomApi';
import { Message } from 'src/models/Message';
import { Room } from 'src/models/Room';
import { v4 as uuidv4 } from 'uuid';

export const useRoom = ({ roomId }: { roomId: string }) => {
  const api = new RoomApi();
  const [room, setRoom] = useState<Room | null>(null);

  const sendMessage = async ({ message }: { message: string }) => {
    const messageId = uuidv4();
    await api.sendMessage({ id: messageId, message, roomId });
  };

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
