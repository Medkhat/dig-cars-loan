import React from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';

import BlankIcon from '@/assets/images/icons/BlankIcon';
import CarIcon from '@/assets/images/icons/CarIcon';
import CashIcon from '@/assets/images/icons/CashIcon';
import ShieldIcon from '@/assets/images/icons/ShieldIcon';
import UmbrellaIcon from '@/assets/images/icons/UmbrellaIcon';
import { ContainerBlock } from '@/components';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { grnzTypeNumber } from '@/helper/constants';

import { LongBlock } from './long-block';

const style = {
  amountBlock: ({ borderLeft, borderRight }) => [
    tw`p-5 sm:rounded-none !items-center`,
    borderLeft && tw`sm:rounded-bl-2xl`,
    borderRight && tw`sm:rounded-br-2xl`
  ]
};

const CarTaxBlock = ({ watch, additionalInfo, downPayment, platePrices }) => {
  const autoIdentifierType = watch('auto_identifier_type');

  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));
  const finalSolution = step?.finalSolution;

  const identifyAutoNumberPrice = () => {
    if (autoIdentifierType === grnzTypeNumber.VIP) {
      return platePrices;
    }

    return additionalInfo?.grnz_fee;
  };

  return (
    <>
      <ContainerBlock twStyle={tw`!rounded-none py-4 px-5`}>
        <LongBlock
          above='Сумма займа на покупку авто'
          text={`${Number(additionalInfo?.car_principal - downPayment).toLocaleString()} ₸`}
          icon={<CarIcon />}
        />
      </ContainerBlock>
      <div className='grid sm:grid-cols-2 gap-[1px] bg-primary'>
        <LongBlock
          above='Обязательное страхование ГПО (Гражданско-Правовая Ответственность)'
          text={`${Number(additionalInfo?.ogpo).toLocaleString()} ₸`}
          icon={<UmbrellaIcon />}
          twStyle={style.amountBlock}
          iconStyle={style.iconStyle}
        />
        <LongBlock
          above='Обязательное страхование КАСКО'
          text={`${Number(additionalInfo?.kasko).toLocaleString()} ₸`}
          icon={<ShieldIcon />}
          twStyle={style.amountBlock}
          iconStyle={style.iconStyle}
        />
        <LongBlock
          above='Государственная пошлина за выдачу тех. паспорта'
          text={`${Number(additionalInfo?.srts_fee).toLocaleString()} ₸`}
          icon={<BlankIcon />}
          twStyle={style.amountBlock}
          iconStyle={style.iconStyle}
        />
        <LongBlock
          above='Сбор за государственную регистрацию транспортных средств'
          text={`${Number(additionalInfo?.registration_fee).toLocaleString()} ₸`}
          icon={<CashIcon />}
          twStyle={style.amountBlock}
          iconStyle={style.iconStyle}
        />
        <LongBlock
          above='Государственный сбор за регистрацию залога движимого имущества'
          text={`${Number(additionalInfo?.pledge_fee).toLocaleString()} ₸`}
          icon={<ShieldIcon />}
          twStyle={style.amountBlock}
          iconStyle={style.iconStyle}
        />
        <LongBlock
          above='Государственная пошлина за выдачу гос. номера'
          text={`${Number(identifyAutoNumberPrice()).toLocaleString()} ₸`}
          icon={<BlankIcon />}
          twStyle={style.amountBlock}
          iconStyle={style.iconStyle}
        />
      </div>
    </>
  );
};
export default CarTaxBlock;
