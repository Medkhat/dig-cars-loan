import { yupResolver } from '@hookform/resolvers/yup';
import { propOr } from 'ramda';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';
import * as yup from 'yup';

import { withData } from '@/app/HOC/with-data';
import { useCalculateLoan } from '@/app/hooks';
import { Button, SubBody, Title } from '@/components';
import { applyMainStatus } from '@/features/api/apply-main';
import { useApplyVehiclelessChangeParamsMutation } from '@/features/api/apply-vehicleless';
import { useProgramsQuery } from '@/features/api/programs';
import { getFlowUuid } from '@/features/application/selectors';
import { resetSteps } from '@/features/status/slice';
import { calcFromPercent, calcPercentFromSum, formatter } from '@/helper';
import { programs } from '@/helper/constants';

import LoanPeriod from './loan-period';
import SpeedometerBlock from './speedometer-block';

const CalculationContent = ({ data, setIsOpen, refetchCurrentParams, currentParams }) => {
  const dispatch = useDispatch();
  const flowUuid = useSelector(getFlowUuid);

  const [fetchChangeParams, { isSuccess }] = useApplyVehiclelessChangeParamsMutation();

  const { car_principal_min, car_principal_max, min_down_payment_rate, period_max, period_min, interest_rate } = data;

  const down_payment_default = calcFromPercent(min_down_payment_rate, car_principal_min);

  const [downPaymentMin, setDownPaymentMin] = useState(down_payment_default);
  const [downPaymentMax, setDownPaymentMax] = useState(down_payment_default);
  const down_payment_max = calcFromPercent(90, car_principal_max);

  yup.addMethod(yup.number, 'validationMinValue', function (errorMessage) {
    return this.min(downPaymentMin, errorMessage);
  });

  yup.addMethod(yup.number, 'validationMaxValue', function (errorMessage) {
    return this.max(downPaymentMax, errorMessage);
  });

  const schema = yup
    .object({
      car_principal: yup
        .number()
        .min(car_principal_min, ({ min }) => `Минимальная сумма ${formatter.format(min.toFixed(0))} ₸`)
        .max(car_principal_max, ({ max }) => `Максимальная сумма ${formatter.format(max.toFixed(0))} ₸`)
        .required('Это поле обязательное'),
      down_payment: yup
        .number()
        .min(down_payment_default, ({ min }) => `Минимальная сумма ${formatter.format(min.toFixed(0))} ₸`)
        .validationMinValue(({ min }) => `Минимальная сумма ${formatter.format(min.toFixed(0))} ₸`)
        .max(down_payment_max, ({ max }) => `Максимальная сумма ${formatter.format(max.toFixed(0))} ₸`)
        .validationMaxValue(({ max }) => `Максимальный первоначальный взнос 90%`)
        .required('Это поле обязательное')
    })
    .required();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid }
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      car_principal: currentParams?.car_principal,
      down_payment: currentParams?.down_payment,
      period: currentParams?.period,
      repayment_method: currentParams?.repayment_method
    }
  });

  const carPrincipal = watch('car_principal');
  const downPayment = watch('down_payment');

  useEffect(() => {
    const downPayment = calcFromPercent(min_down_payment_rate, carPrincipal);
    const downPaymentMax = calcFromPercent(90, carPrincipal);
    setDownPaymentMin(downPayment);
    setDownPaymentMax(downPaymentMax);
    setValue('down_payment', downPayment);
  }, [carPrincipal]);

  useEffect(() => {
    if (downPayment.toString().length > 8) {
      setValue('down_payment', downPaymentMax, { shouldValidate: true });
    }
    if (carPrincipal.toString().length > 9) {
      setValue('car_principal', car_principal_max, { shouldValidate: true });
    }
  }, [carPrincipal, downPayment]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetSteps());
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
      refetchCurrentParams();
      setIsOpen(false);
    }
  }, [isSuccess]);

  const [creditAmount, gesv, monthlyPayment, period, repayment_method, down_payment, car_principal] = useCalculateLoan(
    control,
    currentParams?.interest_rate
  );

  const changeParams = () => {
    const body = {
      car_principal: carPrincipal,
      period: period,
      down_payment: downPayment,
      repayment_method: repayment_method
    };
    fetchChangeParams({ uuid: flowUuid, body });
  };

  return (
    <div tw='flex flex-col space-y-2'>
      <div tw='bg-secondary px-5'>
        <SpeedometerBlock
          control={control}
          name='car_principal'
          title='Стоимость авто'
          caption={<span tw=''>{`Максимальная стоимость ${car_principal_max.toLocaleString()} ₸`}</span>}
          min={propOr(0, 'car_principal_min', data)}
          max={propOr(0, 'car_principal_max', data)}
          watch={watch}
          twStyle={tw`sm:h-[155px]`}
        />
      </div>
      <div tw='bg-secondary p-5'>
        <SpeedometerBlock
          control={control}
          name='down_payment'
          title='Первоначальный взнос'
          affix={
            <CurrencyFormat
              value={calcPercentFromSum(carPrincipal, downPayment)}
              displayType={'text'}
              decimalScale={0}
              suffix='%'
            />
          }
          caption={<span tw=''>{`Минимально ${min_down_payment_rate} % от стоимости`}</span>}
          min={down_payment_default}
          max={down_payment_max}
          watch={watch}
          twStyle={tw`sm:h-[155px] pb-0 sm:pb-5`}
        />
      </div>
      <div tw='max-w-[768px] '>
        <LoanPeriod
          title='Срок займа'
          max={period_max}
          min={period_min}
          name='period'
          control={control}
          twStyle={tw`sm:rounded-none`}
        />
      </div>
      <div tw='p-5 bg-secondary space-y-5'>
        <div>
          <SubBody text='Сумма займа' twStyle={tw`text-secondary`} />
          <Title
            text={`${carPrincipal < car_principal_min ? 0 : Number(carPrincipal - downPayment).toLocaleString()} ₸`}
            variant='bold'
          />
        </div>
        <div>
          <SubBody text='Ставка от' twStyle={tw`text-secondary`} />
          <div tw='flex items-end space-x-1'>
            <Title text={`${currentParams?.interest_rate}%`} variant='bold' />
            <SubBody text={`ГЭСВ ${carPrincipal < car_principal_min ? 0 : gesv}%`} />
          </div>
        </div>
        <div>
          <SubBody text='Ежемесячный платеж' twStyle={tw`text-secondary`} />
          <div tw='flex items-end space-x-1'>
            <Title text={`${monthlyPayment} ₸`} variant='bold' />
            <SubBody text={`x ${period} мес`} />
          </div>
        </div>
        <div tw='sm:max-w-button m-auto'>
          <Button variant='secondary' disabled={!isValid} onClick={changeParams}>
            Изменить
          </Button>
        </div>
      </div>
    </div>
  );
};
export default withData(CalculationContent, useProgramsQuery, programs.AUTO_STANDARD);
