import { RoomApi } from 'src/data/RoomApi';
import { useRouter } from 'next/router';

export const useRoomCreate = () => {
  const router = useRouter();
  const createRoom = async ({ name }: { name: string }) => {
    const api = new RoomApi();
    const createdRoom = await api.createRoom({ name: name });
    router.push(`/rooms/${createdRoom.id}`);
  };

  return { createRoom };
};
