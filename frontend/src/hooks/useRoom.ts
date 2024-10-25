import { useEffect, useState } from 'react';
import { RoomApi } from 'src/data/RoomApi';
import { Message } from 'src/models/Message';
import { Room } from 'src/models/Room';
import { v4 as uuidv4 } from 'uuid';

export const useRoom = ({ roomId }: { roomId: string }) => {
  const api = new RoomApi();
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async ({ value }: { value: string }) => {
    const message: Message = {
      id: uuidv4(),
      message: value,
      createdAt: Date.now(),
    };
    setMessages((prev) => {
      return [...prev, message];
    });

    await api.sendMessage({ id: message.id, message: message.message, roomId });
  };

  const pushMessage = (message: Message) => {
    setMessages((prev) => {
      // 自分で送信したメッセージはすでに追加されている
      const isAlreadyExist = prev.some((m) => m.id === message.id);
      if (isAlreadyExist) {
        return prev;
      }
      return [...prev, message];
    });
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
      onMessage: ({ message }) => pushMessage(message),
    });
  }, [room]);

  return {
    room,
    messages,
    sendMessage,
  };
};
