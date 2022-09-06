import React from 'react';
import tw from 'twin.macro';

import BiArrowRightShort from '@/assets/images/icons/BiArrowRightShort';
import { IconButton, SubBody, Title } from '@/components';
import { declOfNum } from '@/helper';

/*CalculationSummaryProps {
  monthlyPayment: Number;
  period: number;
  isValid: boolean;
  onClick: (e: MouseEvent) => void;
}*/

const styles = {
  container: ({ height }) => [
    tw`flex justify-between items-center bg-calc-footer p-4 rounded-t-2xl sm:rounded-2xl fixed bottom-0 left-0 right-0 mt-auto sm:mt-0 sm:relative z-10`,
    height <= 440 && tw`order-first`
  ],
  info: [tw`flex divide-x divide-white-alpha`],
  item: [tw`flex-auto last:pl-5 last:flex-1 last:pr-9 first-of-type:pr-5`]
};

const CalculationSummary = ({ monthlyPayment = 0, period = 12, onClick, height = 800, isValid }) => {
  return (
    <div css={styles.container({ height })}>
      <div css={styles.info}>
        <SummaryItem title={`${monthlyPayment} ₸`} caption='Ежемесячный платеж' />
        <SummaryItem title={`${period}`} caption={declOfNum(period)} />
      </div>
      <IconButton onClick={onClick} disabled={Number(monthlyPayment) === 0 || !isValid}>
        <BiArrowRightShort />
      </IconButton>
    </div>
  );
};

export { CalculationSummary };

const SummaryItem = ({ title, caption }) => {
  return (
    <div css={styles.item}>
      <Title text={title} variant='bold' />
      <SubBody text={caption} twStyle={tw`text-secondary`} />
    </div>
  );
};
