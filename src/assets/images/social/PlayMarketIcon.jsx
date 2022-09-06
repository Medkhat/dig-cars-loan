import React, { useContext } from 'react';

import { ThemeContext } from '@/contexts/theme-context';

const PlayMarketIcon = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <svg width='30' height='33' viewBox='0 0 30 33' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M1.47178 0.021804C2.07418 -0.0564092 2.68505 0.0772164 3.19978 0.399804L20.7498 10.3763L16.3083 14.8718L1.47178 0.021804ZM0.121777 1.3718C0.0371406 1.66571 -0.00379784 1.97048 0.000276746 2.2763V30.1673C-0.00379784 30.4731 0.0371406 30.7779 0.121777 31.0718L14.9718 16.2218L0.121777 1.3718ZM16.3218 17.5718L1.47178 32.4218C2.07447 32.5071 2.68774 32.3729 3.19978 32.0438L20.7498 22.0673L16.3218 17.5718ZM27.8238 14.4128L22.5048 11.3888L17.6448 16.2218L22.4913 21.0683L27.8103 18.0443C29.5653 17.0453 29.5653 15.3983 27.8103 14.3993L27.8238 14.4128Z'
        fill={theme === 'dark' ? '#FFFFFFDE' : 'black'}
      />
    </svg>
  );
};
export default PlayMarketIcon;
