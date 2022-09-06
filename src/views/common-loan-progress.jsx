import 'twin.macro';

import { motion } from 'framer-motion';
import { find, propEq } from 'ramda';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import tw from 'twin.macro';

import carSmall from '@/assets/images/car-small.svg';
import HiddenCarIcon from '@/assets/images/icons/HiddenCarIcon';
import { getVehicleImageByType } from '@/features/application/selectors';
import { carImageTypes } from '@/helper/constants';
import { steps } from '@/helper/steps';

const CommonLoanProgress = () => {
  const [progress, setProgress] = useState(0);
  const [showCar, setShowCar] = useState(false);
  const location = useLocation();
  const carLoader = useSelector(getVehicleImageByType(carImageTypes.SIDE_VIEW_SMALL));

  useEffect(() => {
    const progressItem = find(propEq('route', location.pathname))(steps);

    if (progressItem) {
      setShowCar(progressItem.showCar);
      setProgress(progressItem.progress);
    }
  }, [location]);

  return (
    <div
      tw='flex flex-col w-full space-y-3 bg-secondary pt-9 sm:pt-9 max-w-layout m-auto'
      css={[progress > 0 ? tw`block` : tw`hidden`]}
    >
      <div tw='h-[4px] bg-secondary-inverted relative rounded-full bg-secondary'>
        {showCar ? (
          <motion.img
            src={carLoader ? carLoader : carSmall}
            alt='camry'
            tw='absolute bottom-1.5'
            initial='carStart'
            style={{ left: `calc(${progress}% - ${progress >= 90 && progress <= 100 ? '80px' : '40px'})` }}
          />
        ) : (
          <HiddenCarIcon progress={progress} />
        )}
        <motion.div
          tw='absolute top-0 left-0 bottom-0 h-[4px] bg-green-secondary transition'
          style={{ width: `${progress}%`, zIndex: '1' }}
          initial='start'
          animate='process'
        />
        <motion.div
          tw='absolute top-0 left-0 bottom-0 h-[4px] bg-progress transition w-full'
          style={{ zIndex: '0' }}
          initial='start'
          animate='process'
        />
      </div>
    </div>
  );
};
export default CommonLoanProgress;
