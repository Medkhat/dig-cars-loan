import React from 'react';
import tw from 'twin.macro';

import SuccessIcon from '@/assets/images/icons/SuccessIcon';
import { SubBody, Title } from '@/components';

const CommonSuccessBlock = ({ title, body, children, twStyle }) => {
  return (
    <div
      className='w-full min-h-[80vh] flex items-center justify-center -translate-y-20 mt-10 flex-col p-5'
      css={[twStyle]}
    >
      <SuccessIcon />
      <div className='mt-6'>
        <Title text={title} twStyle={tw`text-s30 text-center`} variant='bold' />
        <SubBody text={body} twStyle={tw`text-secondary`} />
      </div>
      {children}
    </div>
  );
};
export default CommonSuccessBlock;
