import { useCallback } from 'react';
import { VStack } from 'src/components/common/VStack';
import styled from 'styled-components';

export function UserName({
  name,
  onChangeName,
}: {
  name?: string;
  onChangeName: (name?: string) => void;
}) {
  const handleUpdateUserName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // 空文字の場合はundefinedに変換
      if (event.target.value === '') {
        onChangeName(undefined);
        return;
      }
      onChangeName(event.target.value);
    },
    [],
  );

  return (
    <Container>
      <NameLabel>名前</NameLabel>
      <NameInput
        type="text"
        value={name}
        placeholder="匿名さん"
        onChange={handleUpdateUserName}
      />
    </Container>
  );
}

const Container = styled(VStack)`
  width: 100%;
  background-color: white;
  border-radius: 50px;
  padding: 8px 16px;
  gap: 0;
`;

const NameLabel = styled.p`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin: 0 !important;
  padding: 0;
`;

const NameInput = styled.input`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none !important;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 18px;
  width: 100%;
  outline: none;
  padding: 0;
`;
