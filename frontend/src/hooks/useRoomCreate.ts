export const useRoomCreate = () => {
  // TODO: UNCOMMENT ME!
  // const router = useRouter();

  const createRoom = ({ name }: { name: string }) => {
    console.log(name);

    // TODO: ルームを作成したら、作成したルームに遷移する
    // router.push(`/rooms/${room.id}`);
  };

  return { createRoom };
};
