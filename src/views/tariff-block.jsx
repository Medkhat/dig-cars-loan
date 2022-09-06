import 'twin.macro';

import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import tw from 'twin.macro';

import { Button, Caption, SubBody, SubTitle } from '@/components';
import { ThemeContext } from '@/contexts/theme-context';
import { setConstructorSolution } from '@/features/calculation/slice';
import { declOfNum, getNumberLocale } from '@/helper';
import { decisionTypes, tariffContent } from '@/helper/constants';

const style = {
  wrapper: ({ isActive }) => [isActive && tw`border border-green`],
  button: ({ isActive }) => [isActive && tw`bg-green`],
  title: ({ isActive }) => [isActive && tw`font-bold`],
  type: ({ isActive }) => [isActive && tw`bg-purple px-3 py-1 rounded-2xl text-white`]
};

const decisionTypeName = type => {
  if (type === decisionTypes.MIN_PMT_SOLUTION) {
    return tariffContent.MIN_PMT_SOLUTION;
  }
  if (type === decisionTypes.OPTIMAL) {
    return tariffContent.MOST_PROFITABLE_SOLUTION;
  }
  if (type === decisionTypes.MIN_RATE_SOLUTION) {
    return tariffContent.MIN_RATE_SOLUTION;
  }
};

const TariffBlock = ({ tariff, calculationData, constructorSolution, setOpenChangeTarifModal }) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  const handleChooseTariff = isActive => {
    if (!isActive) {
      setOpenChangeTarifModal(true);
    }
    const updatedSolution = {
      ...calculationData,
      period: isActive
        ? constructorSolution?.period
        : {
            value: Math.floor(tariff?.period / 12),
            caption: declOfNum(tariff?.period / 12).toLocaleLowerCase()
          },
      down_payment: isActive ? constructorSolution?.down_payment : tariff?.down_payment,
      repayment_method: isActive ? constructorSolution?.repayment_method : calculationData?.repayment_method,
      monthly_payment: isActive ? constructorSolution?.monthly_payment : tariff?.monthly_payment,
      credit_amount: isActive ? constructorSolution?.credit_amount : tariff?.principal,
      interest_rate: isActive ? constructorSolution?.interest_rate : tariff?.interest_rate,
      solution_id: isActive ? constructorSolution?.solution_id : tariff?.id
    };

    dispatch(setConstructorSolution(updatedSolution));
  };

  const isActive = calculationData?.solution_id === tariff?.id;

  return (
    <div
      tw='p-4 bg-primary rounded-2xl shadow-tariff shadow-lg divide-y divide-alpha-secondary'
      css={style.wrapper({ isActive: isActive })}
    >
      <div tw='flex justify-between pb-2'>
        <SubBody text={decisionTypeName(tariff.solution_type)?.title} variant='bold' />
        <div css={style.type({ isActive: true })}>
          <SubBody text={decisionTypeName(tariff.solution_type)?.body} />
        </div>
      </div>
      <div tw='flex flex-col space-y-[14px] py-3'>
        <div tw='flex items-center space-x-1'>
          <SubTitle
            text={`${tariff.down_payment ? Number(tariff?.down_payment).toLocaleString() : 0} ₸`}
            variant='bold'
            twStyle={tw`relative top-[1px]`}
          />
          <SubBody text='первоначальный взнос' twStyle={tw`text-secondary`} />
        </div>
        <div tw='flex space-x-[6px] items-center'>
          <span tw='text-s14'>{Number(tariff?.principal).toLocaleString()} ₸</span>
          <span tw='text-secondary'>•</span>
          <span
            tw='text-s14'
            css={[
              tariff?.solution_type === decisionTypes?.MIN_RATE_SOLUTION &&
                tw`bg-purple rounded-2xl py-1 px-[6px] font-bold text-white`
            ]}
          >
            {tariff?.interest_rate}%
          </span>
          <span tw='text-secondary'>•</span>
          <span
            tw='text-s14'
            css={[
              tariff?.solution_type === decisionTypes?.OPTIMAL &&
                tw`bg-purple rounded-2xl py-1 px-[6px] flex items-center justify-center space-x-1 font-bold text-white`
            ]}
          >
            <span>{tariff?.period / 12} </span>
            <span tw='text-s14'> {declOfNum(tariff?.period / 12).toLocaleLowerCase()}</span>
          </span>
        </div>
      </div>
      <div tw='pt-2 flex space-x-1 justify-between items-center'>
        <div tw='flex flex-col space-y-[2px]'>
          <h2
            css={[
              tariff?.solution_type === decisionTypes?.MIN_PMT_SOLUTION &&
                tw`bg-purple rounded-2xl py-1 px-[6px] text-white`
            ]}
            tw='font-bold text-s24'
          >
            {getNumberLocale(tariff?.monthly_payment)} ₸
          </h2>
          <Caption text='в месяц' twStyle={tw`text-secondary`} />
        </div>
        <Button
          variant='secondary'
          twStyle={tw`min-w-[110px] w-auto`}
          css={style.button({ isActive: isActive })}
          onClick={() => handleChooseTariff(isActive)}
        >
          {isActive ? 'Выбрано' : 'Выбрать'}
        </Button>
      </div>
    </div>
  );
};
export default TariffBlock;
