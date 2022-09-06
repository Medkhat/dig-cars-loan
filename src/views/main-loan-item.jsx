import React from 'react';
import tw from 'twin.macro';

import { BodyText, Caption } from '@/components';

const MainLoanItem = ({ icon, title, value, isFirstLong, twStyle }) => {
  return (
    <div css={[tw`bg-secondary flex items-center space-x-2 p-4`, isFirstLong && tw`first-of-type:col-span-2`, twStyle]}>
      <div tw='bg-primary p-1 rounded-full'>{icon}</div>
      <div tw='flex flex-col space-y-1'>
        <Caption text={title} twStyle={tw`text-secondary`} />
        <BodyText text={value} variant='bold' />
      </div>
    </div>
  );
};

export { MainLoanItem };
