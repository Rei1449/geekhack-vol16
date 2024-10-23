import { useRoomCreate } from 'src/hooks/useRoomCreate';

export default function CreateRoomPage() {
  const { createRoom } = useRoomCreate();
  return (
    <div>
      <button
        onClick={() => {
          // TODO: ちゃんとした処理に書き換える
          createRoom({ name: 'Room HELLO WORLD' });
        }}
      >
        Create Room
      </button>
    </div>
  );
}
