import { find, propEq } from 'ramda';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';

import FlagIcon from '@/assets/images/icons/FlagIcon';
import PlacesIcon from '@/assets/images/icons/PlacesIcon';
import PlateLong from '@/assets/images/icons/PlateLong';
import PlateSquare from '@/assets/images/icons/PlateSquare';
import { Caption, ContainerBlock, Input, Select, Selector, SubBody } from '@/components';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { grnzTypeNumber } from '@/helper/constants';
import { deliveryTypes, numberPlateChoise } from '@/helper/loan-approve-data';
import CommonCarFront from '@/views/common-car-front';

import DeliveryModal from './delivery-modal';
import { LongBlock } from './long-block';

export const numberPlates = [
  { value: 'RECTANGULAR', title: '1А: Прямоугольный', icon: <PlateLong /> },
  { value: 'SQUARE', title: '2А: Квадратный', icon: <PlateSquare /> }
];

const MainNewPlate = ({
  control,
  watch,
  setValue,
  isLoading,
  grnzList,
  setGrnzList,
  plates,
  optionsSolution,
  platePrices,
  setPlatePrice,
  regions,
  carFrontUrl
}) => {
  const [open, setOpen] = useState(false);

  const autoIdentifierType = watch('auto_identifier_type');
  const deliveryType = watch('delivery_type');
  const autoIdentifierNew = watch('auto_identifier_new');
  const tcon = watch('tcon');
  const grnzType = watch('grnz_type');
  const tconAddress = watch('tcon_address');
  const region = watch('region');

  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));
  const finalSolution = step?.finalSolution;

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      setGrnzList([]);
      setValue('auto_identifier_new', '');
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      let price;
      if (autoIdentifierType === grnzTypeNumber.VIP) {
        const grnzData = plates?.grnz_list?.find(item => item?.grnz === autoIdentifierNew);
        price = grnzData?.price;
      } else {
        price = plates?.grnz_list?.common_price;
      }

      setPlatePrice(price);
    }
  }, [autoIdentifierNew]);

  useEffect(() => {
    setPlatePrice(null);
  }, [autoIdentifierType]);

  useEffect(() => {
    if (deliveryType === 'delivery') {
      setOpen(true);
    }
  }, [deliveryType]);

  const confirmHandler = () => {
    setOpen(false);
  };

  const cancelHandler = () => {
    setOpen(false);
    setValue('delivery_type', '');
  };

  return (
    <>
      {tcon && (
        <ContainerBlock title='Выберите тип гос. номера' disabled={isLoading}>
          <Controller
            name='grnz_type'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Selector
                disabled={isLoading}
                items={numberPlates}
                isPlate
                defaultActiveItem={value}
                getActiveItem={onChange}
                withIcon
              />
            )}
          />
        </ContainerBlock>
      )}
      {grnzType && (
        <ContainerBlock title='Выберите категорию гос. номера' disabled={isLoading}>
          <Controller
            name='auto_identifier_type'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Selector
                disabled={isLoading}
                items={numberPlateChoise}
                defaultActiveItem={value}
                getActiveItem={onChange}
              />
            )}
          />
          {autoIdentifierType &&
            (isLoading ? (
              <div tw='h-[47px] w-full animate-pulse duration-75 bg-primary rounded-2xl' />
            ) : (
              <>
                <Select
                  name='auto_identifier_new'
                  icon={<FlagIcon />}
                  control={control}
                  isLoading={optionsSolution?.isLoading}
                  options={grnzList}
                  disabled={isLoading}
                  placeholder='Выберите номер'
                />
                {platePrices && (
                  <Caption
                    text={`Стоимость ${Number(platePrices).toLocaleString()} тг`}
                    twStyle={tw`text-dark !mt-[5px] pl-[10px]`}
                  />
                )}
              </>
            ))}
        </ContainerBlock>
      )}
      {autoIdentifierNew && (
        <>
          <div className={!carFrontUrl && 'animate-pulse w-full'}>
            <CommonCarFront carFrontUrl={carFrontUrl} />
          </div>
          <ContainerBlock title='Доставка гос. номера' disabled={isLoading}>
            <Controller
              name='delivery_type'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Selector
                  disabled={isLoading}
                  items={deliveryTypes}
                  defaultActiveItem={value}
                  getActiveItem={onChange}
                />
              )}
            />
            {finalSolution && (
              <>
                {deliveryType === 'delivery' && (
                  <>
                    <div tw='my-3 space-y-2 flex flex-col'>
                      <SubBody
                        text='Внимание, доставка осуществляется только в черте города, в случае если Ваш адрес не входит в зону доставки, то будет выполнена отмена со стороны курьерской службы.'
                        twStyle={tw`text-s14 text-secondary`}
                      />
                      <SubBody
                        text='Внимание! Доставка, оформленная после 16:00, будет осуществлена на следующий день согласно рабочему графику СЦОН.'
                        twStyle={tw`text-s14 text-secondary`}
                      />
                      <SubBody
                        text='Часы работы СЦОН: в будние дни с 09:00 до 18:00.'
                        twStyle={tw`text-s14 text-secondary`}
                      />
                    </div>

                    <Input
                      rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                      control={control}
                      name='street'
                      mask={{ mask: String }}
                      placeholder='Введите название улицы'
                      label='Улица'
                    />
                    <Input
                      rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                      control={control}
                      name='building'
                      mask={{ mask: String }}
                      placeholder='Введите номер дома'
                      label='Дом'
                    />
                    <Input
                      rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                      control={control}
                      name='flat'
                      mask={{ mask: String }}
                      placeholder='Введите номер квартиры'
                      label='Квартира'
                    />
                    <Input
                      control={control}
                      name='comment'
                      mask={{ mask: String }}
                      placeholder='Введите дополнительные детали'
                      label='Комментарий'
                    />
                  </>
                )}
              </>
            )}
          </ContainerBlock>
        </>
      )}

      {finalSolution && deliveryType === 'pickup' && (
        <ContainerBlock title='Адрес для самовывоза' twStyle={tw`p-5 -mt-5 sm:rounded-2xl`}>
          <LongBlock
            icon={<PlacesIcon />}
            text={tconAddress?.address}
            above={find(propEq('value', region))(regions)?.label}
            below={tconAddress?.mobile_phone}
          />
          <SubBody
            text='Гос. номер и тех. паспорт возможно забрать без очереди на стойке eGOV, предъявив старые экземпляры.'
            twStyle={tw`text-secondary`}
          />
        </ContainerBlock>
      )}
      <DeliveryModal open={open} setOpen={setOpen} confirmHandler={confirmHandler} cancelHandler={cancelHandler} />
    </>
  );
};
export default MainNewPlate;
