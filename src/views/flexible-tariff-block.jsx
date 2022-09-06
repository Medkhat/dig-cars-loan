import 'twin.macro';

import React from 'react';
import { useDispatch } from 'react-redux';
import tw from 'twin.macro';

import PlusSquareFill from '@/assets/images/icons/PlusSquareFill';
import { Button, SubBody } from '@/components';
import { decisionTypes, tariffContent } from '@/helper/constants';

const style = {
  wrapper: ({ isActive }) => [isActive && tw`border border-green`],
  button: ({ isActive }) => [isActive && tw`bg-green`],
  title: ({ isActive }) => [isActive && tw`font-bold`],
  type: ({ isActive }) => [isActive && tw`bg-purple`, tw`bg-secondary px-3 py-1 rounded-2xl text-white`]
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

const FlexibleTariffBlock = ({ calculationData, setOpen }) => {
  const dispatch = useDispatch();

  return (
    <div
      tw='p-4 bg-primary rounded-2xl shadow-tariff shadow-lg divide-y divide-alpha-secondary'
      css={style.wrapper({ isActive: false })}
    >
      <div tw='flex justify-between pb-2'>
        <SubBody text={'Гибкий'} variant='bold' />
        <div css={[style.type({ isActive: false }), tw`bg-secondary`]}>
          <SubBody text={'По вашим предпочтениям'} twStyle={tw`text-primary`} variant='bold' />
        </div>
      </div>
      <div tw='flex flex-col space-y-[14px] py-3'>
        <div tw='flex items-center space-x-1'>
          <SubBody text='Соберите собственный тариф, основываясь на своих требованиях' twStyle={tw`text-secondary`} />
        </div>
      </div>
      <div tw='pt-2 flex space-x-1 justify-between items-center'>
        <Button
          variant='ghost'
          twStyle={tw`min-w-[110px]`}
          css={style.button({ isActive: false })}
          icon={<PlusSquareFill />}
          onClick={() => setOpen(true)}
        >
          Собрать тариф
        </Button>
      </div>
    </div>
  );
};
export default FlexibleTariffBlock;
