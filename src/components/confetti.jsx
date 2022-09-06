import 'twin.macro';

import React, { useContext } from 'react';
import Confetti from 'react-confetti';

import { DeviceInfoContext } from '@/contexts/device-info-context';

const ShowConfetti = () => {
  const { width, height } = useContext(DeviceInfoContext);

  return <Confetti width={width} height={height} recycle={true} />;
};
export default ShowConfetti;
