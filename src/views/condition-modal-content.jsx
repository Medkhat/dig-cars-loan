import 'twin.macro';

import { find, prop, propEq, propOr } from 'ramda';
import React from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';

import car from '@/assets/images/car.png';
import BagIcon from '@/assets/images/icons/BagIcon';
import CalcIcon from '@/assets/images/icons/CalcIcon';
import CalendarIcon from '@/assets/images/icons/CalendarIcon';
import CarIcon from '@/assets/images/icons/CarIcon';
import CashIcon from '@/assets/images/icons/CashIcon';
import ClockIcon from '@/assets/images/icons/ClockIcon';
import EngineIcon from '@/assets/images/icons/EngineIcon';
import FluentTransmissionIcon from '@/assets/images/icons/FluentTransmissionIcon';
import PaintBucketIcon from '@/assets/images/icons/PaintBucketIcon';
import PercentIcon from '@/assets/images/icons/PercentIcon';
import SteeringWheel from '@/assets/images/icons/SteeringWheel';
import { BodyText, Caption, ContainerBlock, SubTitle } from '@/components';
import { getVehicleImageByType } from '@/features/application/selectors';
import { capitalizeFirstLetter } from '@/helper';
import { carImageTypes, selectorItems } from '@/helper/constants';

import { LongBlock } from './long-block';

const CoditionModalContent = ({ vehicleParams, calculationData }) => {
  const carLoader = useSelector(getVehicleImageByType(carImageTypes.SIDE_VIEW_LIGHTS));

  return (
    <div tw='w-auto flex flex-col space-y-3 sm:w-[750px]'>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-[1px]'>
        <LongBlock
          above='Сумма займа'
          text={`${Number(calculationData?.credit_amount).toLocaleString()} ₸`}
          icon={<CashIcon variant='secondary' />}
          twStyle={tw`p-4`}
        />
        <LongBlock
          above='Первонач. взнос'
          text={`${Number(calculationData?.down_payment).toLocaleString()} ₸`}
          icon={<CashIcon variant='main' />}
          twStyle={tw`p-4`}
        />
        <LongBlock
          above='Ставка'
          text={`${Number(calculationData?.interest_rate).toFixed(2)}%`}
          icon={<PercentIcon />}
          twStyle={tw`p-4`}
        />
        <LongBlock
          above='Ежемесяч. платеж'
          text={`${Number(calculationData?.monthly_payment).toLocaleString()} ₸`}
          icon={<CalcIcon />}
          twStyle={tw`p-4`}
        />
        <LongBlock
          above='Срок'
          text={`${calculationData?.period?.value} ${String(calculationData?.period?.caption).toLowerCase()}`}
          icon={<ClockIcon />}
          twStyle={tw`p-4`}
        />
        <LongBlock
          above='Метод погашения'
          text={`${prop(
            'title',
            find(propEq('value', propOr('ANNUITY', 'repayment_method', calculationData)), selectorItems)
          )}`}
          icon={<BagIcon />}
          twStyle={tw`p-4`}
        />
      </div>
      <div className='flex flex-col space-y-[1px]'>
        <ContainerBlock title='Данные по авто' twStyle={tw`sm:rounded-none`}>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col pl-0 md:pl-[45px] justify-center w-1/2'>
              <Caption text='Стандарт' twStyle={tw`text-secondary`} />
              <SubTitle text={`${vehicleParams?.vehicle?.brand} ${vehicleParams?.vehicle?.model}`} variant='bold' />
              <Caption
                text={`${vehicleParams?.vehicle?.engine_volume} л • ${String(
                  vehicleParams?.vehicle?.color
                )?.toLowerCase()} • ${vehicleParams?.vehicle?.year} год`}
                twStyle={tw`text-secondary`}
              />
            </div>
            <div className='w-1/2 pl-2'>
              <img src={carLoader ? carLoader : car} alt='car' />
            </div>
          </div>
        </ContainerBlock>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-[1px] bg-primary'>
          <LongBlock
            above='Обьем двигателя'
            text={`${vehicleParams?.vehicle?.engine_volume}л`}
            icon={<EngineIcon variant='secondary' />}
            twStyle={tw`p-5`}
          />
          <LongBlock
            above='Год выпуска'
            text={vehicleParams?.vehicle?.year}
            icon={<CalendarIcon variant='secondary' />}
            twStyle={tw`p-5`}
          />
          <LongBlock
            above='Страна производства'
            text={vehicleParams?.vehicle?.production_country}
            icon={<FluentTransmissionIcon />}
            twStyle={tw`p-5 sm:rounded-none`}
          />
          <LongBlock
            above='Категория'
            text={vehicleParams?.vehicle?.category_id}
            icon={<CarIcon />}
            twStyle={tw`p-5 sm:rounded-none`}
          />
          <LongBlock
            above='Цвет'
            text={capitalizeFirstLetter(vehicleParams?.vehicle?.color)}
            icon={<PaintBucketIcon />}
            twStyle={tw`p-5 sm:rounded-none`}
          />
          <LongBlock
            above='VIN код'
            text={vehicleParams?.vehicle?.vin}
            icon={<SteeringWheel />}
            twStyle={tw`col-span-3 p-5 sm:rounded-none`}
          />
        </div>
      </div>
      <div tw='flex flex-col bg-primary rounded-b-2xl sm:pb-0 rounded-2xl'>
        <div className='p-5 sm:pb-0 bg-secondary -mb-[1px]'>
          <BodyText text='Данные продавца' variant='bold' />
        </div>
        <div className='grid grid-cols-1 pb-4 sm:pb-0 sm:grid-cols-3 gap-[1px]'>
          <LongBlock above='Имя' text={vehicleParams?.person_seller?.full_name} twStyle={tw`p-5 sm:rounded-bl-2xl`} />
          <LongBlock above='ИИН' text={vehicleParams?.person_seller?.iin} twStyle={tw`p-5`} />
          <LongBlock
            above='Номер телефона'
            text={vehicleParams?.person_seller?.mobile_phone}
            twStyle={tw`p-5 sm:rounded-br-2xl`}
          />
        </div>
      </div>
    </div>
  );
};
export default CoditionModalContent;
