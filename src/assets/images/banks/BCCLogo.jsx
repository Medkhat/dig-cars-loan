import React from 'react';

import bccBlack from '@/assets/images/banks/bcc-black.svg';
import bccWhite from '@/assets/images/banks/bcc-white.svg';

const BCCLogo = ({ theme }) => {
  return <img src={theme === 'dark' ? bccWhite : bccBlack} alt='bcc' />;
};
export default BCCLogo;
