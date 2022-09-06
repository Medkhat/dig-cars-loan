import React from 'react';

import FlagIcon from '@/assets/images/icons/FlagIcon';
import { SubBody } from '@/components';

const CommonPlateNumber = ({ body = '' }) => {
  return (
    <div className='border border-grey max-w-[135px] mt-5 flex items-center p-1 rounded'>
      <FlagIcon />
      <SubBody text={body} variant='bold' />
    </div>
  );
};
export default CommonPlateNumber;
