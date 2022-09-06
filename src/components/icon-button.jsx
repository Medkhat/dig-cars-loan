import { motion } from 'framer-motion';
import React from 'react';
import tw from 'twin.macro';

const styles = {
  button: ({ disabled }) => [
    tw`py-[7px] px-[8px] text-3xl flex justify-center items-center bg-button rounded-2xl text-white w-[51px] h-[49px] flex-shrink-0`,
    disabled && tw`bg-input`
  ]
};

const IconButton = ({ children, disabled = false, onClick }) => {
  return (
    <motion.button
      css={styles.button({ disabled })}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export { IconButton };
