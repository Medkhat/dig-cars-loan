import React, { useContext } from 'react';

import { ThemeContext } from '@/contexts/theme-context';

const CloseIcon = ({ onClick }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <i className='cursor-pointer' onClick={onClick} onKeyDown={onClick} aria-hidden='true'>
      <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M1.16191 0.25531C0.94866 0.25531 0.72566 0.326982 0.56291 0.489482C0.237493 0.815315 0.237493 1.36197 0.56291 1.6878L5.79733 6.92198L0.56291 12.1561C0.237493 12.482 0.237493 13.0286 0.56291 13.3545C0.88841 13.6795 1.43541 13.6795 1.76091 13.3545L6.99524 8.12031L12.2296 13.3545C12.5551 13.6795 13.1021 13.6795 13.4276 13.3545C13.753 13.0286 13.753 12.482 13.4276 12.1561L8.19316 6.92198L13.4276 1.6878C13.753 1.36197 13.753 0.815315 13.4276 0.489482C13.2648 0.326982 13.0417 0.25531 12.8286 0.25531C12.6153 0.25531 12.3924 0.326982 12.2296 0.489482L6.99524 5.72364L1.76091 0.489482C1.59816 0.326982 1.37516 0.25531 1.16191 0.25531Z'
          fill={theme === 'light' ? 'black' : 'white'}
          fillOpacity='0.87'
        />
      </svg>
    </i>
  );
};
export default CloseIcon;
