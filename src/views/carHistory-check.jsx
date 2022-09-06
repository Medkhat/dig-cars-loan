import 'twin.macro';

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';
import * as yup from 'yup';

import { BiArrowRightShort } from '@/assets/images/icons/BiArrowRightShort';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { useRunVehicleMutation } from '@/features/api/car-history';
import { addNumbers, clearFields, setGrnz } from '@/features/carHistory/slice';
import { grnzMask, techPassport } from '@/helper/personal-info-helper';

import { BigTitle } from '../components/big-title';
import { Button } from '../components/button';
import { Caption } from '../components/caption';
import { ContainerBlock } from '../components/container-block';
import { Input } from '../components/input';

const schema = yup
  .object({
    grnz: yup
      .string()
      .min(7, 'Гос. номер должен быть не короче 7ми символов (123 AAA 02) ')
      .max(8)
      .required('Заполните пожалуйста поле'),
    srts: yup
      .string()
      .min(10, 'Номер тех. паспорта должен быть не короче 10ти символов (FF 11111111) ')
      .max(10)
      .required('Заполните пожалуйста поле')
  })
  .required('Это поле обязательное');

function CarHistorycheck({ setIsLoading, setError, setNotFound }) {
  const { isMobile } = useContext(DeviceInfoContext);
  const dispatch = useDispatch();
  const lead_uuid = useSelector(state => state.application.lead_uuid);
  const [disabled, setDisabled] = useState(false);

  const [fetchRunVehicle, { isLoading, isError }] = useRunVehicleMutation();

  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid },
    reset
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { grnz: '', srts: '' }
  });
  const grnz = watch('grnz');
  const srts = watch('srts');
  const onSubmit = () => {
    dispatch(setGrnz(grnz));
    dispatch(addNumbers({ grnz, srts }));
    fetchRunVehicle({ lead_uuid, grnz, srts });
    setDisabled(true);
  };

  useEffect(() => {
    if (isLoading) setIsLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    setError(isError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  return (
    <div>
      <div
        tw='flex items-center gap-1 py-3'
        style={{
          display: isMobile ? 'none' : 'flex'
        }}
      >
        <BiArrowRightShort tw='rotate-[180deg] text-s30' onClick={() => window.location.reload()} />
        <span>История владения авто</span>
      </div>
      <ContainerBlock twStyle={tw`p-5 not-italic`}>
        <BigTitle text='Проверьте историю авто' twStyle={tw`text-[1.7rem] not-italic`} />
        <Caption
          text='Введите данные и ознакомьтесь с историей автомобиля'
          twStyle={tw`text-s16 leading-6 text-dark-grey`}
        />
        <form action='' onSubmit={handleSubmit(onSubmit)} tw='relative'>
          <div tw='min-h-[110px]'>
            <label htmlFor='GosNumber' tw='ml-5 text-dark-grey'>
              Гос. номер
            </label>
            <Input
              control={control}
              name='grnz'
              type='text'
              tw='rounded-s14 bg-input outline-none text-primary font-bold placeholder-input
            placeholder-shown:font-normal px-5 py-s13 w-full border border-transparent
            focus:border-input-active disabled:cursor-not-allowed text-s14 mb-5'
              id='GosNumber'
              placeholder='000 AAA 01 или A 001 AAA'
              rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
              mask={grnzMask}
              disabled={disabled}
            />
          </div>
          <div tw='min-h-[110px]'>
            <label htmlFor='TechNumber' tw='ml-5 text-dark-grey'>
              Номер тех. паспорта
            </label>
            <Input
              control={control}
              type='text'
              name='srts'
              tw='rounded-s14 bg-input outline-none text-primary font-bold placeholder-input
            placeholder-shown:font-normal px-5 py-s13 w-full border border-transparent
            focus:border-input-active disabled:cursor-not-allowed text-s14'
              id='TechNumber'
              placeholder='AA 00000000'
              rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
              mask={techPassport}
              disabled={disabled}
            />
          </div>
          <Button
            variant='secondary'
            type='submit'
            twStyle={tw`w-[90%] ml-[5%] mt-[2vh] `}
            disabled={!isValid || disabled}
          >
            Получить отчет
          </Button>
        </form>
        {isMobile ? (
          <></>
        ) : (
          <Button
            variant='text'
            type='onclick'
            twStyle={tw`text-left`}
            onClick={() => {
              setDisabled(false);
              reset();
              dispatch(clearFields('vehicleInfo'));
              setNotFound(false);
            }}
            disabled={!isValid}
          >
            Изменить
          </Button>
        )}
      </ContainerBlock>
    </div>
  );
}

export default CarHistorycheck;
