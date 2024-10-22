import axios from 'axios';
import { Message } from 'src/model/Message';
import { Room } from 'src/model/Room';

export class RoomApi {
  async createRoom({ name }: CreateRoomRequest): Promise<Room> {
    const response = await axios.post('http://localhost:8080/rooms', {
      name: name,
    });
    return {
      id: response.data['id'],
      name: response.data['name'],
      messages: [],
    };
  }

  async getRoom({ roomId }: GetRoomsRequest): Promise<Room | null> {
    const response = await axios.get(`http://localhost:8080/rooms/${roomId}`);
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
      `http://localhost:8080/rooms/${roomId}/messages`,
      {
        id: id,
        message: message,
      },
    );
    return {
      id: response.data['id'],
      message: response.data['message'],
      createdAt: response.data['createdAt'],
    };
  }

  observeRoom({}: ObserveRoom): void {
    throw new Error('implement me!');
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
