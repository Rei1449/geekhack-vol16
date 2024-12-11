import axios from 'axios';
import { Message } from 'src/models/Message';
import { Room } from 'src/models/Room';

export class RoomApi {
  private readonly baseUrl = `${process.env.BACKEND_PLOTOCOL}://${process.env.BACKEND_HOST}`;
  async createRoom({ name }: CreateRoomRequest): Promise<Room> {
    const response = await axios.post(`${this.baseUrl}/rooms`, {
      name: name,
    });
    return {
      id: response.data['id'],
      name: response.data['name'],
      messages: [],
    };
  }

  async getRoom({ roomId }: GetRoomsRequest): Promise<Room | null> {
    const response = await axios.get(`${this.baseUrl}/rooms/${roomId}`);
    return {
      id: response.data['id'],
      name: response.data['name'],
      messages: response.data['messages'],
    };
  }

  async sendMessage({
    id,
    message,
    roomId,
  }: SendMessageRequest): Promise<Message> {
    const response = await axios.post(
      `${this.baseUrl}/rooms/${roomId}/messages`,
      {
        id: id,
        message: message,
      },
    );
    return {
      id: response.data['id'],
      message: response.data['message'],
      score: response.data['score'],
      createdAt: response.data['createdAt'],
    };
  }

  observeRoom({ roomId, onMessage }: ObserveRoom) {
    const connection = new WebSocket(
      `${process.env.BACKEND_WEBSOCKET_PROTOCOL}://${process.env.BACKEND_HOST}/rooms/${roomId}`,
    );

    // TODO: 接続時の処理
    connection.onopen = function () {
      console.log(`${roomId}に接続`);
    };

    //エラー発生
    connection.onerror = function (error) {
      console.error('エラー', error);
    };

    //メッセージ受信
    connection.onmessage = function (event) {
      const messageData = JSON.parse(event.data);
      if (messageData['type'] === 'messages/new') {
        onMessage({ message: messageData });
      }
    };

    // TODO: 切断
    connection.onclose = function () {
      console.log('切断');
    };

    return {
      close: () => {
        connection.close();
      },
    };
  }
}

type CreateRoomRequest = {
  name: string;
};

type GetRoomsRequest = {
  roomId: string;
};

type SendMessageRequest = {
  id: string;
  message: string;
  roomId: string;
};

type ObserveRoom = {
  roomId: string;
  onMessage: ({ message }: { message: Message }) => void;
};
