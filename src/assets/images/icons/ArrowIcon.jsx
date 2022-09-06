import 'twin.macro';

import React, { useContext } from 'react';

import { ThemeContext } from '@/contexts/theme-context';

const ArrowIcon = ({ setPrevEl, setNextEl }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div tw='flex items-center space-x-[25px]' className='arrow-icon'>
      <div ref={node => setNextEl(node)}>
        <svg width='17' height='14' viewBox='0 0 17 14' fill='none' tw='rotate-180' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M0.0159912 6.98503C0.0159912 6.24903 0.613325 5.65169 1.34932 5.65169H9.34933V0.318359L16.016 6.98503L9.34933 13.6517V8.31836H1.34932C0.613325 8.31836 0.0159912 7.72103 0.0159912 6.98503Z'
            fill={theme === 'dark' ? 'white' : 'black'}
            tw='hover:bg-button'
            fillOpacity='0.87'
          />
        </svg>
      </div>
      <div ref={node => setPrevEl(node)}>
        <svg width='17' height='14' viewBox='0 0 17 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M0.0159912 6.98503C0.0159912 6.24903 0.613325 5.65169 1.34932 5.65169H9.34933V0.318359L16.016 6.98503L9.34933 13.6517V8.31836H1.34932C0.613325 8.31836 0.0159912 7.72103 0.0159912 6.98503Z'
            fill={theme === 'dark' ? 'white' : 'black'}
            fillOpacity='0.87'
          />
        </svg>
      </div>
    </div>
  );
};
export default ArrowIcon;
