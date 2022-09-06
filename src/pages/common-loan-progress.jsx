import 'twin.macro';

import { motion } from 'framer-motion';
import React from 'react';

import carSmall from '@/assets/images/car-small.svg';

const CommonLoanProgress = ({ percent = 80 }) => {
  return (
    <div tw='flex flex-col w-full space-y-3 bg-secondary pt-7 sm:hidden'>
      <div tw='h-[4px] bg-secondary-inverted relative rounded-full bg-secondary'>
        <motion.img
          src={carSmall}
          alt='camry'
          width={109}
          height={22}
          tw='absolute bottom-1.5'
          layout
          initial='carStart'
          style={{ left: `calc(${percent}% - 85px)` }}
          animate='car'
        />
        <motion.div
          tw='absolute top-0 left-0 bottom-0 h-[4px] bg-button transition rounded-full'
          style={{ width: `${percent}%`, zIndex: '2' }}
          initial='start'
          animate='process'
        />
        <motion.div
          tw='absolute top-0 left-0 bottom-0 h-[4px] bg-progress transition w-full'
          style={{ zIndex: '1' }}
          initial='start'
          animate='process'
        />
      </div>
    </div>
  );
};
export default CommonLoanProgress;
