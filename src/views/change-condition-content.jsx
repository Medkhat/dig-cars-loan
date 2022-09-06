import 'twin.macro';

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import tw from 'twin.macro';
import * as yup from 'yup';

import { Button, ContainerBlock, SubBody, Title } from '@/components';
import SliderSelector from '@/components/slider-selector';
import { getCalculationData } from '@/features/calculation/selectors';
import { setConstructorSolution } from '@/features/calculation/slice';
import { declOfNum, getAccessYears, getDownPaymentRates, getYears } from '@/helper';

const defaultValues = {
  period: '',
  down_payment_rate: '',
  repayment_method: 'ANNUITY'
};

const ChangeConditionContent = ({ alternativeSolutions, setOpen, setOpenChangeTarifModal }) => {
  const schema = yup.object({
    down_payment_rate: yup.string().required(),
    period: yup.string().required()
  });

  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [downPaymentRates, setDownPaymentRates] = useState([]);
  const [accessPeriods, setAccessPeriods] = useState([]);
  const [paymentYears, setPaymentYears] = useState([]);
  const [solution, setSolution] = useState();

  const dispatch = useDispatch();

  const calculationData = useSelector(getCalculationData);

  const {
    control,
    reset,
    watch,
    setValue,
    formState: { isValid }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      period: accessPeriods[0]?.value,
      down_payment_rate: getDownPaymentRates[0]?.value
    }
  });

  const period = watch('period');
  const paymentRate = watch('down_payment_rate');

  useEffect(() => {
    // получения перв.взносов
    if (alternativeSolutions?.length > 0) {
      const rates = getDownPaymentRates(alternativeSolutions);
      const years = getYears(alternativeSolutions);

      setPaymentYears(years);
      setDownPaymentRates(rates);
    }
  }, [alternativeSolutions]);

  useEffect(() => {
    // логика получения актуальных периодов
    reset({
      ...defaultValues,
      down_payment_rate: paymentRate
    });
    let periods = getAccessYears(alternativeSolutions, paymentRate);
    periods = getYears(periods);

    setAccessPeriods(periods);
  }, [paymentRate]);

  useEffect(() => {
    // удалить решение если изменились зависимости
    setSolution(null);
  }, [paymentRate, period]);

  useEffect(() => {
    // получение решения если заполнились срок займа и перв. взнос
    if (period > 0 && paymentRate > 0) {
      const item = alternativeSolutions?.find(item => {
        if (item.down_payment_rate === paymentRate && item.period === period) {
          return item;
        }
      });

      setSolution(item);
    }
  }, [period, paymentRate]);

  useEffect(() => {
    if (downPaymentRates && downPaymentRates.length > 0) {
      setValue('down_payment_rate', downPaymentRates[0]?.value);
    }
  }, [downPaymentRates]);

  useEffect(() => {
    if (paymentYears && paymentYears.length > 0) {
      let periods = getAccessYears(alternativeSolutions, paymentRate);
      periods = getYears(periods);

      setValue('period', periods[0]?.value);
    }
  }, [paymentRate]);

  const updateSolution = () => {
    console.log(solution);
    dispatch(
      setConstructorSolution({
        ...calculationData,
        period: {
          value: Math.floor(solution?.period / 12),
          caption: declOfNum(solution?.period / 12).toLocaleLowerCase()
        },
        down_payment: solution?.down_payment,
        repayment_method: calculationData?.repayment_method,
        monthly_payment: solution?.monthly_payment,
        credit_amount: solution?.principal,
        interest_rate: solution?.interest_rate,
        solution_id: solution?.id
      })
    );
    setOpen(false);
    setOpenChangeTarifModal(true);
  };

  return (
    <div tw='flex flex-col space-y-[12px] sm:w-[520px]'>
      <ContainerBlock
        title='Первоначальный взнос'
        subtitle='Минимально 20% от стоимости'
        twStyle={tw`sm:rounded-none w-full`}
      >
        <Controller
          render={({ field: { value, onChange } }) => (
            <SliderSelector
              variant='slider'
              items={downPaymentRates}
              defaultActiveItem={value}
              getActiveItem={onChange}
              nextEl={nextEl}
              prevEl={prevEl}
              showElem={3.5}
            />
          )}
          name='down_payment_rate'
          control={control}
        />
      </ContainerBlock>
      <ContainerBlock title='Срок займа' twStyle={tw`sm:rounded-none w-full`} disabled={!paymentRate}>
        <Controller
          disabled={true}
          render={({ field: { value, onChange } }) => (
            <SliderSelector
              variant='slider'
              allDisabled={accessPeriods.length > 0 ? false : true}
              items={accessPeriods?.length > 0 ? accessPeriods : paymentYears}
              defaultActiveItem={value || paymentYears[0]?.value}
              getActiveItem={onChange}
              nextEl={nextEl}
              prevEl={prevEl}
              showElem={5}
            />
          )}
          name='period'
          control={control}
        />
      </ContainerBlock>
      <ContainerBlock twStyle={tw`!rounded-none`}>
        <div tw='flex flex-col space-y-4'>
          <div>
            <SubBody text='Сумма займа' twStyle={tw`text-secondary`} />
            <Title text={`${solution ? Number(solution?.principal).toLocaleString() : 0} ₸`} variant='bold' />
          </div>
          <div>
            <SubBody text='Ставка' twStyle={tw`text-secondary`} />
            <div tw='flex items-end space-x-2'>
              <Title text={`${solution?.interest_rate || 0}%`} variant='bold' />
              <SubBody text='ГЭСВ 19,46%' twStyle={tw`text-secondary relative top-[2px]`} />
            </div>
          </div>
          <div>
            <SubBody text='Ежемесячный платеж' twStyle={tw`text-secondary`} />
            <div tw='flex items-end space-x-2'>
              <Title text={`${Number(solution?.monthly_payment).toLocaleString()} ₸`} variant='bold' />
              <SubBody text={`x ${solution?.period} мес`} twStyle={tw`text-secondary relative top-[1px]`} />
            </div>
          </div>
        </div>
      </ContainerBlock>
      <div className='flex flex-col space-y-[1px]'>
        <div tw='w-full p-5 pt-5 sm:pb-5 sm:px-5 bg-secondary sm:rounded-b-2xl'>
          <Button
            variant='secondary'
            twStyle={tw`max-w-full py-5`}
            disabled={!isValid || !solution}
            onClick={updateSolution}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ChangeConditionContent;
