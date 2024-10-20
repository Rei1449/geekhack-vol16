import styled from "styled-components";
import { useEffect } from "react";
import { RoomApi } from "src/data/RoomApi";

export default function Home() {
  useEffect(() => {
    roomApiTest().then(() => {}).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <Message>
      HELLO WORRRRRRRRR😘
    </Message>
  );
}

async function roomApiTest() {
      const api = new RoomApi();

      // ルームを作成
      const createdRoom = await api.createRoom({ roomName: 'room1' });
      console.log({
        "tag": "createdRoom",
        "createdRoom": createdRoom
      })

      // ルームを取得
      const room = await api.getRoom({ roomId: createdRoom.id });
      console.log({
        "tag": "room",
        "room": room
      })

      // メッセージを送信
      const message = await api.sendMessage({
        id: 'message1',
        message: 'hello',
        roomId: createdRoom.id
      });
      console.log({
        "tag": "message",
        "message": message
      })
}

const Message = styled.div`
  color: red;
`;