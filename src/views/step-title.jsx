import { equals } from 'ramda';
import React, { memo } from 'react';
import tw from 'twin.macro';

import CheckIcon from '@/assets/images/icons/CheckIcon';
import { BodyText, Caption, Number } from '@/components';

/*StepTitleProps {
  step: string;
  title: string;
  status?: NumberStatus;
}*/

const styles = {
  description: ({ status }) => [tw`flex flex-col sm:hidden md:flex`, status === 'active' && tw`sm:flex`]
};

const HeaderTitle = ({ step, title, status }) => {
  //console.log(status);

  return (
    <div tw='w-full flex items-center justify-between sm:justify-start md:justify-between'>
      <div tw='flex space-x-2.5 flex-auto items-center'>
        <Number value={step} status={status} />
        <div css={styles.description({ status })}>
          <Caption text={`Шаг ${step}/5`} twStyle={tw`text-secondary`} />
          <BodyText text={title} variant='bold' />
        </div>
      </div>
      {status === 'completed' && <CheckIcon />}
    </div>
  );
};

export const StepTitle = memo(HeaderTitle, equals);
