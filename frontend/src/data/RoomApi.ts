import axios from "axios"

export class RoomApi {
    async createRoom({
        name
    }: CreateRoomRequest): Promise<Room> {
        const response = await axios.post("http://localhost:8080/rooms",{
            name:name
        });
        return {
            "id": response.data["id"],
            "name": response.data["name"],
            "messages":[],
        }
    }

    async getRoom({
        roomId
    }: GetRoomsRequest): Promise<Room | null> {
        throw new Error('implement me!');
    }

    async sendMessage({
        id,
        message,
        roomId,
    }: SendMessageRequest): Promise<Message> {
        throw new Error('implement me!');
    }

    observeRoom({ }: ObserveRoom): void {
        throw new Error('implement me!');
    }
}

type CreateRoomRequest = {
    name: string
}

type GetRoomsRequest = {
    roomId: string
}

type SendMessageRequest = {
    id: string;
    message: string;
    roomId: string;
}

type ObserveRoom = {
    roomId: string
    onMessage: ({ message }: { message: Message }) => void
}