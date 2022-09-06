/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import tw from 'twin.macro';

import { DeviceInfoContext } from '@/contexts/device-info-context';

const StickyContainer = ({ children }) => {
  const { isMobile } = useContext(DeviceInfoContext);

  return (
    <div tw='w-full bg-secondary z-10' css={[tw`sticky top-0`]}>
      {children}
    </div>
  );
};
export default StickyContainer;
