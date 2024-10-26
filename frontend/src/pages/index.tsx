import { SubmitHandler, useForm } from 'react-hook-form';
import { HStack } from 'src/components/common/HStack';
import { VStack } from 'src/components/common/VStack';
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
    createRoom({ name: input.roomName });
  };

  return (
    <Container>
      <HeroStack>
        <HeroItemLeft>
          <Form id="roomNameForm" onSubmit={handleSubmit(handleCreateRoom)}>
            <Flex>
              <FlexItem>
                <HeroHeading>
                  <HeroImage src="/img/hero-icon.png" />
                  <Heading>ぎゅわ〜ん</Heading>
                </HeroHeading>
              </FlexItem>
              <FlexItem>
                <Text>な空間を作ります。</Text>
                <Text>質問をジェットコースターのように。</Text>
              </FlexItem>
              <FlexItem>
                <Label>
                  <Input
                    id="roomName"
                    type="text"
                    autoComplete="off"
                    placeholder="部屋の名前を入力"
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
        </HeroItemLeft>
        <HeroItemRight>
          <ImageContent>
            <Image src="/img/hero-image.png" />
          </ImageContent>
        </HeroItemRight>
      </HeroStack>
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
`;

const HeroStack = styled(HStack)`
  width: 100%;
  height: 100%;
`;

const HeroItem = styled(VStack)`
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`;
const HeroItemLeft = styled(HeroItem)`
  align-items: flex-end;
  margin-right: 1rem;
`;
const HeroItemRight = styled(HeroItem)`
  align-items: flex-start;
  margin-left: 1rem;
`;

const HeroHeading = styled.div`
  display: flex;
`;

const HeroImage = styled.img`
  width: 76px;
  height: 76px;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 80%;
  padding: 2rem;
`;

const Flex = styled(VStack)`
  flex-wrap: wrap;
  gap: 1rem;

  width: 100%;
  max-width: 30rem;
`;

const FlexItem = styled.div`
  width: 100%;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 3.2rem;
  font-weight: bold;

  background: linear-gradient(135deg, #e639f5, #005dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Text = styled.p`
  margin: 0;
  font-size: 1.2rem;
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
  border: 1px solid;
  border-color: rgba(179, 179, 179, 1);
  border-radius: 8px;

  color: rgb(56, 75, 112);
  background: transparent;

  &::placeholder {
    color: rgba(179, 179, 179, 1);
  }
`;

const ErrorMessage = styled.span`
  position: absolute;
  top: 200%;
  left: 0%;

  color: rgba(56, 75, 112, 0.8);
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
  font-size: 1.2rem;

  border: none;
  border-radius: 20px;
  color: #ffffff;
  background: ${(props: React.InputHTMLAttributes<HTMLInputElement>) =>
    props.disabled ? 'rgba(56, 75, 112, 0.2)' : '#e639f5'};
  box-sizing: border-box;
  cursor: ${(props: React.InputHTMLAttributes<HTMLInputElement>) =>
    props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.4s;
`;

const ImageContent = styled.div`
  display: flex;
  align-items: center;

  width: 80%;
  max-width: 640px;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: min-content;
  border-radius: 60px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
`;
