import { AnimatePresence, motion } from 'framer-motion';
import { find, pathOr, prop, propEq, propOr, toLower } from 'ramda';
import React, { useState } from 'react';
import { useEffect } from 'react';
import tw from 'twin.macro';

import BagIcon from '@/assets/images/icons/BagIcon';
import CalcIcon from '@/assets/images/icons/CalcIcon';
import CashIcon from '@/assets/images/icons/CashIcon';
import DropIcon from '@/assets/images/icons/DropIcon';
import PercentIcon from '@/assets/images/icons/PercentIcon';
import { declOfNum, getCalcDownPayment, getCalcPrincipal } from '@/helper';
import { selectorItems } from '@/helper/constants';

import LoanInfoBlock from './loan-info-block';

const style = {
  desktop: [tw`sticky bg-secondary`],
  mobile: show => [tw`sticky top-0 bg-tertiary`, show ? tw`block` : tw`hidden`]
};

const MobileInfoBar = ({ display, isMobile, calculationData, finalSolution }) => {
  const [open, setOpen] = useState(false);
  const show = true;

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const handleToggle = () => {
    if (isMobile) {
      setOpen(!open);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        tw='top-0 z-10 w-full flex justify-center'
        css={[display ? tw`flex` : tw`hidden`, isMobile ? style.mobile(show) : style.desktop]}
        style={{ display: display ? 'flex' : 'none' }}
        onClick={handleToggle}
        onKeyDown={handleToggle}
      >
        <div tw='w-full m-auto max-w-[960px]'>
          <div className='flex relative space-y-2'>
            <div
              className='flex justify-between flex-wrap md:grid-cols-6 py-3 sm:py-0 relative flex-1'
              css={[tw`divide-x divide-alpha-secondary px-0`]}
            >
              <LoanInfoBlock
                title={
                  <span>
                    Кредит на{' '}
                    {finalSolution
                      ? ` ${finalSolution?.period / 12} ${declOfNum(finalSolution?.period / 12).toLocaleLowerCase()}`
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
                twStyle={tw`w-1/3 whitespace-nowrap`}
              />
              <LoanInfoBlock
                title='Перв. взнос'
                value={calculationData?.down_payment && Number(calculationData?.down_payment)}
                newValue={finalSolution && Number(getCalcDownPayment(finalSolution))}
                text={Number(calculationData?.down_payment).toLocaleString()}
                newText={finalSolution && Number(getCalcDownPayment(finalSolution)).toLocaleString()}
                icon={<CashIcon variant='main' />}
                suffix='₸'
                twStyle={tw`w-1/3`}
              />
              <LoanInfoBlock
                title='Ежемес. платеж'
                value={Number(calculationData?.monthly_payment)}
                newValue={Number(finalSolution?.monthly_payment)}
                text={Number(Number(calculationData?.monthly_payment)).toLocaleString().toLocaleString()}
                newText={finalSolution && Number(Number(finalSolution?.monthly_payment).toFixed()).toLocaleString()}
                icon={<CalcIcon />}
                twStyle={tw`w-1/3`}
                suffix='₸'
              />
              {open && (
                <>
                  <LoanInfoBlock
                    title='Ставка'
                    value={Number(calculationData?.interest_rate).toFixed(2)}
                    newValue={Number(finalSolution?.interest_rate).toFixed(2)}
                    text={Number(calculationData?.interest_rate).toFixed(1)}
                    newText={Number(finalSolution?.interest_rate).toFixed(1)}
                    icon={<PercentIcon />}
                    twStyle={tw`pt-3 w-1/3`}
                    suffix='%'
                  />
                  <LoanInfoBlock
                    title='Срок'
                    value={Number(calculationData?.period.value)}
                    newValue={finalSolution?.period / 12}
                    text={Number(calculationData?.period.value)}
                    newText={finalSolution?.period / 12}
                    suffix='year'
                    twStyle={tw`pt-3 w-1/3`}
                  />
                  <LoanInfoBlock
                    title='Метод погашения'
                    text={`${prop(
                      'title',
                      find(propEq('value', propOr('ANNUITY', 'repayment_method', calculationData)), selectorItems)
                    )}`}
                    icon={<BagIcon />}
                    twStyle={tw`pt-3 w-1/3`}
                    valueStyle={tw`w-[120px]`}
                  />
                </>
              )}
            </div>

            <div className='flex pt-2 pr-2'>
              <DropIcon className={`${open ? 'rotate-180' : 'rotate-0'} transition-all`} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default MobileInfoBar;
