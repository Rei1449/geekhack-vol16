import { Message } from 'src/model/Message';

export type Room = {
  id: string;
  name: string;
  messages: Message[];
};
