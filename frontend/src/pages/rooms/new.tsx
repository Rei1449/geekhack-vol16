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
                placeholder='"ぎゅわーん"な部屋の名前を書いてね！'
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
  color: #363062;
  background: #f5efff;
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
    props.disabled ? '#CDC1FF' : '#363062'};
  box-sizing: border-box;
  cursor: ${(props: React.InputHTMLAttributes<HTMLInputElement>) =>
    props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.4s;
`;
