import { Flex } from '@/packages/ui/src';
import { useEffect, useRef, useState } from 'react';
import {
  StyledMap,
  StyledPos,
  StyledDot,
  StyledLabel,
  StyledNegativeXLabel,
  StyledPositiveXLabel,
  StyledNegativeYLabel,
  StyledPositiveYLabel
} from '@/make/pages/demo/loading/components/CustomComponents/PositioningMap/PositioningMap.style';
import { chartTheme } from '@/make/pages/demo/loading/chartTheme';
import type { ReactPositioningMapRenderProps } from '@/make/pages/demo/loading/components/CustomComponents/PositioningMap/PositioningMap.schema';

const MIN = -10;
const MAX = 10;
const MAP_SIZE = 400;

const getPosValue = (value: number) => {
  return ((value - MIN) / (MAX - MIN)) * (MAP_SIZE * 0.8) + MAP_SIZE * 0.1;
};

export const PositioningMapComponent = ({
  positioningMapProps
}: {
  positioningMapProps: ReactPositioningMapRenderProps;
}) => {
  const {
    title,
    negativeXName,
    positiveXName,
    negativeYName,
    positiveYName,
    data
  } = positioningMapProps;

  const colorKey = 'GRAY';

  const negativeXLabel = useRef<HTMLSpanElement>(null);
  const positiveXLabel = useRef<HTMLSpanElement>(null);
  const negativeYLabel = useRef<HTMLSpanElement>(null);
  const positiveYLabel = useRef<HTMLSpanElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);
  const [marginTop, setMarginTop] = useState(0);

  useEffect(() => {
    if (negativeXLabel.current && positiveXLabel.current) {
      setWidth(
        negativeXLabel.current.offsetWidth +
          positiveXLabel.current.offsetWidth +
          400
      );
    }

    if (negativeYLabel.current && positiveYLabel.current) {
      setHeight(
        negativeYLabel.current.offsetHeight +
          positiveYLabel.current.offsetHeight +
          400
      );
    }

    if (negativeXLabel.current) {
      setMarginLeft(negativeXLabel.current.offsetWidth);
    }

    if (positiveYLabel.current) {
      setMarginTop(positiveYLabel.current.offsetHeight);
    }
  }, [negativeXLabel, positiveXLabel, negativeYLabel, positiveYLabel]);

  return (
    <Flex direction="column" gap={20} padding={12}>
      {title}
      <div style={{ width, height }}>
        <StyledMap marginLeft={marginLeft} marginTop={marginTop}>
          {data.map(
            (item: { name: string; x: number; y: number }, index: number) => (
              <StyledPos
                key={item.name}
                x={getPosValue(item.x)}
                y={getPosValue(-item.y)}
              >
                <StyledDot
                  main={index === 0}
                  color={chartTheme[colorKey].primary1}
                />
                <StyledLabel
                  main={index === 0}
                  color={chartTheme[colorKey].primary1}
                >
                  {item.name}
                </StyledLabel>
              </StyledPos>
            )
          )}
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none">
            <path
              d="M10 200L390 200"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5, 5"
            />
            <path
              d="M200 10L200 390"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5, 5"
            />
          </svg>
          <StyledNegativeXLabel ref={negativeXLabel}>
            {negativeXName}
          </StyledNegativeXLabel>
          <StyledPositiveXLabel ref={positiveXLabel}>
            {positiveXName}
          </StyledPositiveXLabel>
          <StyledNegativeYLabel ref={negativeYLabel}>
            {negativeYName}
          </StyledNegativeYLabel>
          <StyledPositiveYLabel ref={positiveYLabel}>
            {positiveYName}
          </StyledPositiveYLabel>
        </StyledMap>
      </div>
    </Flex>
  );
};
