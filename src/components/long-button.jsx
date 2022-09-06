import { motion } from 'framer-motion';
import React from 'react';
import tw from 'twin.macro';

import { SubBody } from '@/components/sub-body';

const LongButton = ({ children, prefix, suffix, disabled }) => {
  return (
    <motion.button
      whileTap={{ scale: !disabled ? 0.97 : 1 }}
      tw='flex justify-between items-center space-x-2 p-5 bg-secondary rounded-s14 max-w-button min-w-button w-full'
    >
      <span>{prefix}</span>
      <SubBody text={children} variant='bold' twStyle={tw`flex-1 text-left`} />
      <span tw='w-6 bg-input rounded-full p-1'>{suffix}</span>
    </motion.button>
  );
};

export { LongButton };
