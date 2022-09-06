import React from 'react';

import { SubBody } from '@/components';

const SellerAmountInfo = ({ title, body }) => {
  return (
    <div className='w-full flex justify-between bg-secondary p-5'>
      <SubBody text={title} variant='regular' />
      <SubBody text={body} variant='bold' />
    </div>
  );
};
export default SellerAmountInfo;
