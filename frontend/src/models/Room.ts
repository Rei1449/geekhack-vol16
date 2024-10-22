import { Message } from 'src/models/Message';

export type Room = {
  id: string;
  name: string;
  messages: Message[];
};
