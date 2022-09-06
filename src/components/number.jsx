import React from 'react';
import tw from 'twin.macro';

import { SubTitle } from '@/components/sub-title';

/*NumberProps {
  value: string;
  status?: NumberStatus;
}*/

const styles = {
  container: ({ status }) => [
    tw`flex justify-center items-center flex-shrink-0 border-2 border-button w-[2.125rem] h-[2.125rem] rounded-full`,
    status === 'active' && tw`border-green`,
    status === 'completed' && tw`bg-button border-green text-primary-inverted`
  ]
};

const Number = ({ value, status }) => {
  return (
    <div css={styles.container({ status })}>
      <SubTitle text={value} variant='bold' />
    </div>
  );
};

export { Number };
