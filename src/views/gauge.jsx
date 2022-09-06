import { __, compose, curry, multiply, pathOr, unfold } from 'ramda';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { Arc, Layer, Stage, Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import tw from 'twin.macro';

import Speedometer from '@/assets/images/Speedometer';
import { BodyText } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { ThemeContext } from '@/contexts/theme-context';
import { throughNByValue } from '@/helper';

const getGaugeIndicatorColor = theme => (theme === 'dark' ? '#ffffffd9' : '#17191a');

/* -------------------------- */

const calcOnePercentByRange = (max, min) => (max - min) / 100;

const calcValueByPercent = compose(multiply, calcOnePercentByRange);

const getRangeGaugeItemsByPercent = curry((max, min, percentage) =>
  compose(unfold(__, min), throughNByValue(max), calcValueByPercent(max, min))(percentage)
);

/* -------------------------- */

const gaugeItem = item => Number(item / 1000000).toFixed(0);

const generatePositionForGaugeItems = (indicatorColor, x, y, radius, points) => {
  return points.map((item, index) => {
    let xText = x + (radius - 17) * Math.cos(-49.5 * (index + 1) * (Math.PI / 180) + 1.4722222222 * Math.PI);
    let yText = y - (radius - 17) * Math.sin(-49.5 * (index + 1) * (Math.PI / 180) + 1.4722222222 * Math.PI);
    return <Text key={index} text={gaugeItem(item)} x={xText - 5} y={yText + 10} fontSize={10} fill={indicatorColor} />;
  });
};

/* -------------------------- */

const checkValueRange = curry((max, min, value) => {
  if (value >= min && value <= max) {
    return value;
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
});

const convertValueToPercent = curry((max, min, value) => ((value - min) * 100) / (max - min));

const convertPercentToDegree = curry((maxDegree, percent) => (maxDegree * percent) / 100);

const mapValueToDegree = (max, min, maxDegree) =>
  compose(convertPercentToDegree(maxDegree), convertValueToPercent(max, min), checkValueRange(max, min));

/* -------------------------- */

const displayPriceValue = value => {
  if (value.toString().length >= 7) {
    return {
      price: Number(value / 1000000).toFixed(1),
      text: 'млн. ₸'
    };
  } else {
    return {
      price: Number(value / 1000).toFixed(0),
      text: 'тыс. ₸'
    };
  }
};

/* -------------------------- */

const styles = {
  container: ({ isMobile }) => [tw`relative scale-125 pr-1.5`, isMobile && tw`scale-110`]
};

const Gauge = ({ min, max, name, control }) => {
  const container = useRef(null);
  const { theme } = useContext(ThemeContext);
  const { isMobile } = useContext(DeviceInfoContext);
  const value = useWatch({ control, name });

  const indicatorColor = getGaugeIndicatorColor(theme);

  const [radiusGauge, setRadiusGauge] = useState(0);
  const [yCenterGauge, setYCenterGauge] = useState(0);
  const [xCenterGauge, setXCenterGauge] = useState(0);

  const percent = 20; // Циферблаты спидемотра без начальной точки это 5 дольки, соответственно 20 процентов
  const gaugeMaxDegree = 270; // Максимальная шкала для спидометра

  const currentDegree = mapValueToDegree(max, min, gaugeMaxDegree)(value);

  const { price, text } = displayPriceValue(value);

  useEffect(() => {
    setRadiusGauge(pathOr(0, ['current', 'attrs', 'width'], container) / 2 - 6);
    setYCenterGauge(pathOr(0, ['current', 'attrs', 'width'], container) / 2);
    setXCenterGauge(pathOr(0, ['current', 'attrs', 'height'], container) / 2);
  }, [container]);

  const gaugePoints = getRangeGaugeItemsByPercent(max, min, percent);
  return (
    <div css={styles.container({ isMobile })}>
      <Stage width={120} height={120} ref={container}>
        <Layer offsetY={13} offsetX={0}>
          {generatePositionForGaugeItems(indicatorColor, xCenterGauge, yCenterGauge, radiusGauge, gaugePoints)}
        </Layer>
        <Layer>
          {/*Зеленная полоска процеса*/}
          <Arc
            x={xCenterGauge}
            y={yCenterGauge}
            innerRadius={radiusGauge}
            outerRadius={radiusGauge + 3}
            fill='#4F9D3A'
            shadowColor='#4F9D3A'
            shadowBlur={3}
            lineCap='round'
            angle={currentDegree}
            rotation={135}
          />
          {/*Индикатор*/}
          <Arc
            x={xCenterGauge}
            y={yCenterGauge}
            offsetX={39}
            offsetY={-39}
            rotation={currentDegree}
            innerRadius={0}
            outerRadius={3}
            angle={360}
            fill={indicatorColor}
            shadowColor='#fff'
            shadowBlur={2}
          />
        </Layer>
        <Layer>
          <Html>
            <Speedometer tw='absolute top-2.5 left-2.5' />
          </Html>
        </Layer>
      </Stage>
      <div tw='flex flex-col justify-center absolute top-[60px] right-[3px] my-auto -translate-y-1/2 text-center w-full h-full'>
        <BodyText text={price} variant='bold' twStyle={tw`text-center`} />
        <span tw='text-s10 text-secondary font-normal'> {text}</span>
      </div>
    </div>
  );
};

export default Gauge;
