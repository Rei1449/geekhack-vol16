import { useState } from 'react';
import { useRoomCreate } from 'src/hooks/Room';
import styled from 'styled-components';

export default function CreateRoomPage() {
  const { createRoom } = useRoomCreate();
  const [roomName, setRoomName] = useState<string>('');

  const handleCreateRoom = () => createRoom({ name: roomName });

  return (
    <Container>
      <Form id="roomNameForm">
        <Flex>
          <FlexItem></FlexItem>
          <FlexItem>
            <Input
              id="roomName"
              type="text"
              value={roomName}
              placeholder='"ぎゅわーん"な部屋の名前を作ろう'
              onChange={(e) => setRoomName(e.target.value)}
            />
          </FlexItem>
          <FlexItem>
            <ButtonContainer>
              <ButtonArea>
                <SubmitButton form="roomName" onClick={handleCreateRoom}>
                  はじめる
                </SubmitButton>
              </ButtonArea>
            </ButtonContainer>
          </FlexItem>
        </Flex>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 30%;
  background: #a594f9;
  padding: 4rem;
  border-radius: 16px;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6rem;
  max-width: 30rem;
  width: 100%;
`;

const FlexItem = styled.div`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  outline: none;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  color: #363062;
  background: #f5efff;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const ButtonArea = styled.div`
  width: 30%;
`;
const SubmitButton = styled.button`
  width: 100%;
  padding-block: 0.2rem;
  padding-inline: 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 999px;
  color: #f5efff;
  background: #363062;
`;
