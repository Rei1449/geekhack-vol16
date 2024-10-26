import { useMemo } from 'react';
import styled from 'styled-components';

export function MoodGage({ percentage }: { percentage: number }) {
  const tickColors: string[] = useMemo(
    () => [
      '#7c50ed',
      '#7c50ed',
      '#7c50ed',
      '#5687dc',
      '#5687dc',
      '#5687dc',
      '#5687dc',
      '#d85bc8',
      '#d85bc8',
      '#d85bc8',
    ],
    [],
  );

  return (
    <Wrapper>
      <MaxText
        style={{
          color:
            percentage == 100 ? tickColors[tickColors.length - 1] : '#D0D0D0',
        }}
      >
        Max
      </MaxText>
      <GageStack>
        {new Array(10).fill(0).map((_, index) => {
          const isFilled = index < percentage / 10;
          return (
            <GageTick
              key={index}
              tickColor={isFilled ? tickColors[index] : '#D0D0D0'}
            />
          );
        })}
      </GageStack>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 100px;
`;

const MaxText = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.1);
`;

const GageStack = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
  width: 100%;
`;

const GageTick = styled.div<{ tickColor?: string }>`
  width: 100%;
  height: 10px;
  border-radius: 10px;
  background-color: ${({ tickColor }) => tickColor || '#d0d0d0'};
  box-shadow: 0 0 2px ${({ tickColor }) => tickColor || '#d0d0d0'};
`;
