import { SubmitHandler, useForm } from 'react-hook-form';
import { useRoomCreate } from 'src/hooks/room';
import styled from 'styled-components';

type CreateRoomNameField = {
  roomName: string;
};
export default function CreateRoomPage() {
  const { createRoom } = useRoomCreate();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateRoomNameField>({ mode: 'onChange' });

  const handleCreateRoom: SubmitHandler<CreateRoomNameField> = (input) => {
    console.log(input.roomName);
    createRoom({ name: input.roomName });
  };

  return (
    <Container>
      <Form id="roomNameForm" onSubmit={handleSubmit(handleCreateRoom)}>
        <Flex>
          <FlexItem></FlexItem>
          <FlexItem>
            <Label>
              <Input
                id="roomName"
                type="text"
                autoComplete="off"
                placeholder='"ぎゅわ〜ん"な部屋の名前を書いてね！'
                {...register('roomName', { required: true, minLength: 1 })}
              />
              {errors.roomName && (
                <ErrorMessage>1文字以上入力してね</ErrorMessage>
              )}
            </Label>
          </FlexItem>
          <FlexItem>
            <ButtonContainer>
              <ButtonArea>
                <SubmitButton
                  type="submit"
                  value="はじめる"
                  disabled={!isValid || isSubmitting}
                />
              </ButtonArea>
            </ButtonContainer>
          </FlexItem>
        </Flex>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  background-image: url('/img/new-room-bg.png');
  background-size: contain;
  background-position: center;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
  }
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 30%;
  background: rgba(56, 75, 112, 0.3);
  padding: 4rem;
  border-radius: 16px;

  backdrop-filter: blur(10px);
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
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

const Label = styled.label`
  position: relative;
`;

const Input = styled.input`
  position: relative;
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  outline: none;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;

  color: rgb(56, 75, 112);
  background: #146c94;
  background: rgba(80, 118, 135, 0.3);
`;

const ErrorMessage = styled.span`
  position: absolute;
  top: 250%;
  left: 50%;
  transform: translateX(-50%);
  color: #f7f4ea;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const ButtonArea = styled.div`
  width: 30%;
`;
const SubmitButton = styled.input`
  width: 100%;
  padding-block: 0.2rem;
  padding-inline: 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  color: #f5efff;
  background: #363062;
  background: ${(props: React.InputHTMLAttributes<HTMLInputElement>) =>
    props.disabled ? 'rgba(56, 75, 112, 0.2)' : 'rgba(56, 75, 112, 0.8)'};
  box-sizing: border-box;
  cursor: ${(props: React.InputHTMLAttributes<HTMLInputElement>) =>
    props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.4s;
`;
