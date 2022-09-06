import 'twin.macro';

import { find, prop, propEq, propOr, toLower } from 'ramda';
import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import tw from 'twin.macro';

import BagIcon from '@/assets/images/icons/BagIcon';
import CalcIcon from '@/assets/images/icons/CalcIcon';
import CashIcon from '@/assets/images/icons/CashIcon';
import ClockIcon from '@/assets/images/icons/ClockIcon';
import DropIcon from '@/assets/images/icons/DropIcon';
import PercentIcon from '@/assets/images/icons/PercentIcon';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { declOfNum, getCalcDownPayment, getCalcPrincipal, isNumber, parseLocaleNumber } from '@/helper';
import { selectorItems } from '@/helper/constants';

import Loader from './loader';
import LoanInfoBlock from './loan-info-block';

const style = {
  wrapper: ({ isMobile }) => [isMobile ? tw`bg-secondary space-x-0 divide-x divide-alpha-secondary` : tw`bg-primary`]
};

const NewInfoLoanInfoBar = ({ calculationData, finalSolution }) => {
  const [open, setOpen] = useState(false);
  const { isMobile } = useContext(DeviceInfoContext);

  useEffect(() => {
    if (!isMobile) {
      setOpen(true);
    }
  }, [isMobile]);

  if (!calculationData?.credit_amount) {
    return (
      <div tw='flex items-center justify-center text-center m-auto'>
        {' '}
        <Loader variant='small' /> Загрузка...
      </div>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      tw='max-w-[960px] m-auto grid grid-cols-3 md:grid-cols-6 sm:gap-[1px] bg-primary relative'
      css={style.wrapper({ isMobile })}
      onClick={e => {
        if (isMobile) {
          setOpen(!open);
        }
      }}
    >
      <LoanInfoBlock
        title={
          <span>
            Кредит на{' '}
            {finalSolution?.period
              ? `${finalSolution?.period / 12} ${
                  finalSolution?.period ? declOfNum(finalSolution?.period / 12)?.toLowerCase() : ''
                }`
              : `${calculationData?.period?.value} ${
                  calculationData?.period && toLower(calculationData?.period?.caption)
                }`}
          </span>
        }
        value={Number(calculationData?.credit_amount)}
        newValue={finalSolution && Number(getCalcPrincipal(finalSolution))}
        text={Number(calculationData?.credit_amount).toLocaleString()}
        newText={finalSolution && Number(getCalcPrincipal(finalSolution)).toLocaleString()}
        icon={<CashIcon variant='secondary' />}
        suffix='₸'
        twStyle={tw`whitespace-nowrap`}
      />
      <LoanInfoBlock
        title='Перв. взнос'
        value={calculationData?.down_payment && Number(calculationData?.down_payment)}
        newValue={finalSolution && Number(getCalcDownPayment(finalSolution))}
        text={Number(calculationData?.down_payment).toLocaleString()}
        newText={finalSolution && Number(getCalcDownPayment(finalSolution)).toLocaleString()}
        icon={<CashIcon variant='main' />}
        suffix='₸'
        twStyle={tw`whitespace-nowrap`}
      />
      <LoanInfoBlock
        title='Ежемес. платеж'
        value={
          isNumber(calculationData?.monthly_payment)
            ? Number(calculationData?.monthly_payment)
            : Number(parseLocaleNumber(calculationData?.monthly_payment, 'ru')).toLocaleString()
        }
        newValue={Number(finalSolution?.monthly_payment)}
        text={
          isNumber(calculationData?.monthly_payment)
            ? Number(calculationData?.monthly_payment).toLocaleString()
            : Number(parseLocaleNumber(calculationData?.monthly_payment, 'ru')).toLocaleString()
        }
        newText={finalSolution && Number(Number(finalSolution?.monthly_payment).toFixed()).toLocaleString()}
        icon={<CalcIcon />}
        suffix='₸'
      />
      {open && (
        <>
          <LoanInfoBlock
            title='Срок'
            value={Number(calculationData?.period.value)}
            newValue={finalSolution?.period / 12}
            text={Number(calculationData?.period.value)}
            newText={finalSolution?.period / 12}
            suffix='year'
            icon={<ClockIcon />}
          />
          <LoanInfoBlock
            title='Ставка'
            value={Number(calculationData?.interest_rate).toFixed(2)}
            newValue={Number(
              finalSolution?.interest_rate ? finalSolution?.interest_rate : calculationData?.interest_rate
            ).toFixed(2)}
            text={Number(calculationData?.interest_rate).toFixed(1)}
            newText={Number(
              finalSolution?.interest_rate ? finalSolution?.interest_rate : calculationData?.interest_rate
            ).toFixed(1)}
            type='interest_rate'
            icon={<PercentIcon />}
            additionalData={calculationData?.gesv}
            suffix='%'
            valueStyle={tw`whitespace-nowrap`}
          />
          <LoanInfoBlock
            title='Метод погашения'
            text={`${prop(
              'title',
              find(propEq('value', propOr('ANNUITY', 'repayment_method', calculationData)), selectorItems)
            )}`}
            icon={<BagIcon />}
          />
        </>
      )}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div tw='flex absolute right-0 top-4 border-none sm:hidden' onClick={() => setOpen(!open)}>
        <DropIcon className={`${open ? 'rotate-180' : 'rotate-0'} transition-all`} />
      </div>
    </div>
  );
};
export default NewInfoLoanInfoBar;
