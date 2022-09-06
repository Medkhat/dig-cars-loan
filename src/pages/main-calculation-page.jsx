import 'twin.macro';

import { yupResolver } from '@hookform/resolvers/yup';
import { propOr } from 'ramda';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';
import * as yup from 'yup';

import { withData } from '@/app/HOC/with-data';
import { useCalculateLoan } from '@/app/hooks';
import { SubBody } from '@/components/sub-body';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { useProgramsQuery } from '@/features/api/programs';
import { setData } from '@/features/calculation/slice';
import { calcFromPercent, calcPercentFromSum, declOfNum, formatter } from '@/helper';
import { programs } from '@/helper/constants';
import { CalculationSummary } from '@/views/calculation-summary';
import LoanMethod from '@/views/loan-method';
import LoanPeriod from '@/views/loan-period';
import { LongBlock } from '@/views/long-block';
import SpeedometerBlock from '@/views/speedometer-block';

const CalculationPage = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { height } = useContext(DeviceInfoContext);

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
      car_principal: car_principal_min,
      down_payment: down_payment_default,
      period: period_min,
      repayment_method: 'ANNUITY'
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

  const [creditAmount, gesv, monthlyPayment, period, repayment_method, down_payment, car_principal] = useCalculateLoan(
    control,
    interest_rate
  );

  const goNextPage = useCallback(
    e => {
      e.preventDefault();
      dispatch(
        setData({
          period: { value: period / 12, caption: declOfNum(period / 12) },
          repayment_method,
          down_payment,
          car_principal,
          monthly_payment: monthlyPayment,
          gesv,
          interest_rate: interest_rate,
          credit_amount: creditAmount
        })
      );
      navigate('/main/personal', {
        state: { calculationData: { period, repayment_method, down_payment, car_principal } },
        replace: true
      });
    },
    [period, repayment_method, down_payment, car_principal, dispatch, navigate, monthlyPayment, gesv, creditAmount]
  );

  const variants = {
    initial: { opacity: 0, x: '-100vw' },
    animate: { opacity: 1 },
    exit: { opacity: 0, x: '100vw' }
  };

  return (
    <div>
      <div css={[tw`flex space-x-[2px] sm:space-x-2 w-full mb-3`, height <= 440 && tw`order-2`]}>
        <LongBlock
          text={
            <span tw='flex flex-nowrap  items-baseline space-x-1'>
              <SubBody text='от' twStyle={tw`mr-1`} /> {interest_rate}%
            </span>
          }
          above='Ставка'
          textSuffix={`ГЭСВ ${gesv}%`}
          twStyle={tw`p-5 sm:rounded-2xl`}
        />
        <LongBlock
          text={`${formatter.format(creditAmount.toFixed(0))} ₸`}
          above='Сумма займа'
          twStyle={tw`p-5 sm:rounded-2xl`}
        />
      </div>
      <form noValidate tw='flex flex-col space-y-3 mb-3'>
        <SpeedometerBlock
          control={control}
          name='car_principal'
          title='Стоимость авто'
          caption={<span tw=''>{`Максимальная стоимость ${car_principal_max.toLocaleString()} ₸`}</span>}
          min={propOr(0, 'car_principal_min', data)}
          max={propOr(0, 'car_principal_max', data)}
          watch={watch}
          twStyle={tw`h-[175px] sm:h-[155px]`}
        />
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
          twStyle={tw`h-[175px] sm:h-[155px] pb-0 sm:pb-5`}
        />
        <LoanPeriod title='Срок займа' max={period_max} min={period_min} name='period' control={control} />
        <LoanMethod title='Метод погашения' name='repayment_method' control={control} />
      </form>
      <CalculationSummary
        period={period / 12}
        monthlyPayment={monthlyPayment}
        onClick={goNextPage}
        height={height}
        isValid={isValid}
      />
    </div>
  );
};

export default withData(CalculationPage, useProgramsQuery, programs.AUTO_STANDARD);
// export default CalculationPage;
