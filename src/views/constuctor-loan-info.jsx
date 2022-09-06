import { find, prop, propEq, propOr } from 'ramda';
import React from 'react';
import CurrencyFormat from 'react-currency-format';
import tw from 'twin.macro';

import BagIcon from '@/assets/images/icons/BagIcon';
import CalcIcon from '@/assets/images/icons/CalcIcon';
import CashIcon from '@/assets/images/icons/CashIcon';
import ClockIcon from '@/assets/images/icons/ClockIcon';
import PercentIcon from '@/assets/images/icons/PercentIcon';
import { selectorItems } from '@/helper/constants';

import { MainLoanItem } from './main-loan-item';

const ConstructorLoanInfo = ({ finalSolution, calculationData }) => {
  return (
    <div className='grid grid-cols-2 sm:rounded-2xl gap-[1px] !mt-[-0px]' ref={null}>
      <MainLoanItem
        icon={<CashIcon variant='secondary' />}
        title='Сумма займа'
        value={
          <CurrencyFormat
            value={
              finalSolution?.additional_principal
                ? calculationData?.credit_amount + finalSolution?.additional_principal
                : calculationData?.credit_amount || '-'
            }
            displayType={'text'}
            thousandSeparator=' '
            suffix=' ₸'
          />
        }
        isFirstLong
        twStyle={tw`sm:rounded-t-2xl`}
      />
      <MainLoanItem
        icon={<CashIcon />}
        title='Первоначальный взнос'
        value={
          <CurrencyFormat
            value={calculationData?.down_payment || '-'}
            displayType={'text'}
            thousandSeparator=' '
            suffix=' ₸'
          />
        }
      />
      <MainLoanItem
        icon={<PercentIcon />}
        title='Ставка'
        value={
          <CurrencyFormat
            value={Number(
              finalSolution?.interest_rate ? finalSolution?.interest_rate : propOr(0, 'interest_rate', calculationData)
            ).toFixed(1)}
            displayType={'text'}
            suffix='%'
          />
        }
      />
      <MainLoanItem
        icon={<CalcIcon />}
        title='Ежемесяч. платеж'
        value={`${calculationData?.monthly_payment ? Number(calculationData?.monthly_payment).toLocaleString() : 0} ₸`}
      />
      <MainLoanItem
        icon={<ClockIcon />}
        title='Срок'
        value={`${calculationData?.period?.value} ${calculationData?.period?.caption}`}
        twStyle={tw`sm:rounded-none`}
      />
      <MainLoanItem
        icon={<BagIcon />}
        title='ГЭСВ'
        value={
          <CurrencyFormat
            value={Number(finalSolution?.gesv ? finalSolution?.gesv : propOr(0, 'gesv', calculationData)).toFixed(1)}
            displayType={'text'}
            suffix='%'
          />
        }
        twStyle={tw`sm:rounded-none sm:rounded-bl-2xl`}
      />
      <MainLoanItem
        icon={<BagIcon />}
        title='Метод погашения'
        value={`${prop(
          'title',
          find(propEq('value', propOr('ANNUITY', 'repayment_method', calculationData)), selectorItems)
        )}`}
        twStyle={tw`sm:rounded-none sm:rounded-br-2xl`}
      />
    </div>
  );
};
export default ConstructorLoanInfo;
