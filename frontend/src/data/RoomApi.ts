export class RoomApi {
    async createRoom({
        name
    }: CreateRoomRequest): Promise<Room> {
        throw new Error('implement me!');
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