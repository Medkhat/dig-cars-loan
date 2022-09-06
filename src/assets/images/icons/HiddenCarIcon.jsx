/* eslint-disable prettier/prettier */
import 'twin.macro';

import React, { useContext } from 'react';

import carDark from '@/assets/images/hidden-car-dark.svg';
import carLight from '@/assets/images/hidden-car-light.svg';
import { ThemeContext } from '@/contexts/theme-context';

const HiddenCarIcon = ({ progress }) => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <>
      {theme === 'dark' ? (
        <img tw='absolute bottom-1.5' style={{ left: `calc(${progress}% - 15px)` }} src={carDark} alt='dark' />
      ) : (
        <img tw='absolute bottom-1.5' style={{ left: `calc(${progress}% - 15px)` }} src={carLight} alt='light' />
      )}
    </>
  );
};
export default HiddenCarIcon;
