import React from 'react';

import forteBlack from '@/assets/images/banks/forte-black.svg';
import forteWhite from '@/assets/images/banks/forte-white.svg';

const ForteLogo = ({ theme }) => {
  return <img src={theme === 'dark' ? forteWhite : forteBlack} alt='forte' />;
};
export default ForteLogo;
