import { Message } from 'src/models/Message';
import styled from 'styled-components';

export const MessageDisplay = ({ messages }: { messages: Message[] }) => {
  return (
    <Wrapper>
      {messages.map((message, index) => (
        <div key={index}>{message.message}</div>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  background-color: #f0f0f0;
`;
