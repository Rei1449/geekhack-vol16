import { useMemo } from 'react';
import styled from 'styled-components';
import { VStack } from '../common/VStack';

export function Tutorial({
  isVisible,
  moodPercentage = 0,
}: {
  isVisible: boolean;
  moodPercentage?: number;
}) {
  const circleGradationColors = useMemo(() => {
    if (moodPercentage < 20) {
      return {
        colorStart: '#E639F5',
        colorEnd: '#005DFF',
      };
    } else if (moodPercentage < 40) {
      return {
        colorStart: '#de8500',
        colorEnd: '#FFD700',
      };
    } else if (moodPercentage < 80) {
      return {
        colorStart: '#85FFBD',
        colorEnd: '#FFFB7D',
      };
    } else if (moodPercentage < 100) {
      return {
        colorStart: '#2AF598',
        colorEnd: '#08AEEA',
      };
    }

    return {
      colorStart: '#FFE53B',
      colorEnd: '#FF2525',
    };
  }, [moodPercentage]);

  const tutorialText = useMemo(() => {
    if (moodPercentage < 10) {
      return 'まずは、👍️ を押してみよう！';
    } else if (moodPercentage < 40) {
      return 'まだまだ行ける！';
    } else if (moodPercentage < 80) {
      return 'そんなもんじゃない！';
    } else if (moodPercentage < 100) {
      return 'あと、もう少し！';
    } else {
      return 'ゲージがMAXになりました';
    }
  }, [moodPercentage]);

  const tutorialTitle = useMemo(() => {
    if (moodPercentage < 10) {
      return 'WELCOME!';
    } else if (moodPercentage < 40) {
      return 'ゲージを4メモリまで上げよう！';
    } else if (moodPercentage < 80) {
      return 'そのままMAXまで行こう！';
    } else if (moodPercentage < 100) {
      return 'その調子！';
    } else {
      return '最高！！！';
    }

    return 'その調子！';
  }, [moodPercentage]);

  return (
    <Wrapper style={{ opacity: isVisible ? 1 : 0 }}>
      <VStack style={{ alignItems: 'center', position: 'relative' }}>
        <GradationCircle
          $colorStart={circleGradationColors.colorStart}
          $colorEnd={circleGradationColors.colorEnd}
        />
        <VStack style={{ alignItems: 'center', zIndex: 1 }}>
          <Title>{tutorialTitle}</Title>
          <Text>{tutorialText}</Text>
        </VStack>
      </VStack>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  user-select: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 16px;
`;

const Text = styled.div`
  font-size: 18px;
  line-height: 1;
  background-clip: text;
`;

const GradationCircle = styled.div<{ $colorStart: string; $colorEnd: string }>`
  @keyframes scaleInScaleOut {
    0% {
      width: 200px;
      height: 200px;
    }
    50% {
      width: 300px;
      height: 300px;
    }
    100% {
      width: 200px;
      height: 200px;
    }
  }

  animation: scaleInScaleOut 10s infinite cubic-bezier(0.22, 0.61, 0.36, 1);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(
    45deg,
    ${({ $colorStart }) => $colorStart} 0%,
    ${({ $colorEnd }) => $colorEnd} 100%
  );
  transition: all 0.3s;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
`;
