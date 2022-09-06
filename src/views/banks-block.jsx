import 'twin.macro';

import React, { useContext } from 'react';

import BCCLogo from '@/assets/images/banks/BCCLogo';
import ForteLogo from '@/assets/images/banks/ForteLogo';
import HalykLogo from '@/assets/images/banks/HalykLogo';
import JusanLogo from '@/assets/images/banks/JusanLogo';
import KaspiLogo from '@/assets/images/banks/KaspiLogo';
import { ThemeContext } from '@/contexts/theme-context';

const BanksBlock = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div tw='flex flex-col space-y-2 bg-primary p-3 rounded-2xl max-w-[335px]'>
      <div tw='flex justify-center space-x-5 items-center'>
        <HalykLogo theme={theme} />
        <JusanLogo theme={theme} />
        <KaspiLogo theme={theme} />
      </div>
      <div tw='flex justify-center space-x-5 items-center'>
        <ForteLogo theme={theme} />
        <BCCLogo theme={theme} />
      </div>
    </div>
  );
};
export default BanksBlock;
