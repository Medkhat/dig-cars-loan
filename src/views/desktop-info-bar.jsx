import { AnimatePresence, motion } from 'framer-motion';
import { find, pathOr, prop, propEq, propOr, toLower } from 'ramda';
import React from 'react';
import tw from 'twin.macro';

import BagIcon from '@/assets/images/icons/BagIcon';
import CalcIcon from '@/assets/images/icons/CalcIcon';
import CashIcon from '@/assets/images/icons/CashIcon';
import ClockIcon from '@/assets/images/icons/ClockIcon';
import PercentIcon from '@/assets/images/icons/PercentIcon';
import { declOfNum, getCalcDownPayment, getCalcPrincipal, parseLocaleNumber } from '@/helper';
import { selectorItems } from '@/helper/constants';

import LoanInfoBlock from './loan-info-block';

const DesktopInfoBar = ({ display, calculationData, finalSolution }) => {
  return (
    <AnimatePresence>
      <motion.div
        tw='top-0 z-10 w-full flex justify-center'
        css={[display ? tw`flex` : tw`hidden`, tw`bg-secondary`]}
        style={{ display: display ? 'flex' : 'none' }}
      >
        <div tw='w-full m-auto max-w-[960px]'>
          <div className='flex flex-col space-y-2'>
            <div
              className='grid grid-cols-3 gap-[1px] py-3 sm:py-0 relative'
              css={[tw`bg-primary`]}
              style={{ gridTemplateColumns: 'repeat(6, minmax(max-content, 16.666%))' }}
            >
              <LoanInfoBlock
                title={
                  <span>
                    Кредит на{' '}
                    {finalSolution
                      ? `${finalSolution?.period / 12} ${declOfNum(finalSolution?.period / 12).toLocaleLowerCase()}`
                      : `${pathOr('-', ['period', 'value'], calculationData)} ${toLower(
                          pathOr('', ['period', 'caption'], calculationData)
                        )}`}
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
                value={Number(calculationData?.monthly_payment)}
                newValue={Number(finalSolution?.monthly_payment)}
                text={parseLocaleNumber(calculationData?.monthly_payment, 'ru')}
                newText={finalSolution && parseLocaleNumber(finalSolution?.monthly_payment, 'ru')}
                icon={<CalcIcon />}
                suffix='₸'
              />
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
                newValue={Number(finalSolution?.interest_rate).toFixed(2)}
                text={Number(calculationData?.interest_rate).toFixed(1)}
                newText={Number(finalSolution?.interest_rate).toFixed(1)}
                type='interest_rate'
                icon={<PercentIcon />}
                suffix='%'
              />
              <LoanInfoBlock
                title='Метод погашения'
                text={`${prop(
                  'title',
                  find(propEq('value', propOr('ANNUITY', 'repayment_method', calculationData)), selectorItems)
                )}`}
                icon={<BagIcon />}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default DesktopInfoBar;
