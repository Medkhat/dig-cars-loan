import {
  compose,
  equals,
  find,
  head,
  identity,
  ifElse,
  join,
  juxt,
  pathOr,
  prop,
  propEq,
  propOr,
  tail,
  toLower,
  toUpper
} from 'ramda';
import React, { useEffect } from 'react';
import CurrencyFormat from 'react-currency-format';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useFirstMountState } from 'react-use';
import tw from 'twin.macro';

import { useVisibility } from '@/app/hooks';
// ICONS AND IMGS
import car from '@/assets/images/car-shield.svg';
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
import SettingIcon from '@/assets/images/icons/SettingIcon';
// UI
import { BodyText, Button, Caption, ContainerBlock, Radio, SubBody, SubTitle } from '@/components';
import { applyMainStatus, useApplyMainDownPaymentMutation } from '@/features/api/apply-main';
import { useActualParamsQuery, useVehicleParamsQuery } from '@/features/api/credits';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid, getLeadUuid, getVehicleImageByType, getVehicleParams } from '@/features/application/selectors';
import { setConditionBlockVisible } from '@/features/application/slice';
import { calculationLoan } from '@/features/calculation/calculation-loan-new';
import { getCalculationData } from '@/features/calculation/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetCommonStatus, resetRedirectUrl, setConstructorFinalSolution } from '@/features/status/slice';
import { getShortName, getUserGender } from '@/features/user/selectors';
import { parseLocaleNumber } from '@/helper';
import { carImageTypes, flowSteps, selectorItems } from '@/helper/constants';
import { LongBlock } from '@/views/long-block';
import RejectCreditBlock from '@/views/reject-credit-block';

const radioOptions = [
  // {
  //   value: 'online',
  //   title: (
  //     <span>
  //       Оплатить первоначальный <br /> взнос онлайн
  //     </span>
  //   ),
  //   subText: (
  //     <span>
  //       При оплате онлайн, процентная ставка <br /> снижается на 0.5%
  //     </span>
  //   ),
  //   sale: '0.5'
  // },
  {
    value: 'offline',
    title: (
      <span>
        Оплатить первоначальный <br /> взнос продавцу
      </span>
    ),
    subText: 'Наличными/переводом по согласованию с продавцом'
  }
];

const capitalize = value => (!value ? '' : compose(join(''), juxt([compose(toUpper, head), tail]), toLower)(value));

const capitalizeOrNull = ifElse(equals(null), identity, capitalize);

const MainLoanPaymentPage = () => {
  const isFirstMount = useFirstMountState();
  const [isVisible, loanConditionBlockRef] = useVisibility(100);
  const dispatch = useDispatch();
  const shortName = useSelector(getShortName);
  const userGender = useSelector(getUserGender);
  const calculationData = useSelector(getCalculationData);
  const vehicleParams = useSelector(getVehicleParams);
  const flowUuid = useSelector(getFlowUuid);
  const leadUuid = useSelector(getLeadUuid);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(flowSteps.RBS_PAYMENT));
  const constructorStep = useSelector(getStepByName(flowSteps.CONSTRUCTOR));
  const carLoader = useSelector(getVehicleImageByType(carImageTypes.SIDE_VIEW_LIGHTS));
  const finalSolution = constructorStep?.finalSolution;

  const [fetchDownPayment, { isSuccess: downPaymentSuccess, isLoading: downPaymentLoading }] =
    useApplyMainDownPaymentMutation();

  const { isLoading: actualParamsLoading, refetch: actualParamsRefetch } = useActualParamsQuery(
    { lead_uuid: leadUuid },
    { skip: !leadUuid }
  );
  const { isLoading: vehicleParamsLoading, refetch: vehicleParamsRefetch } = useVehicleParamsQuery(
    { flow_uuid: flowUuid },
    { skip: !flowUuid }
  );

  useGetDataStreamingQuery({ url: step.socket_url, step: currentStep }, { skip: !step.socket_url });

  const { control, handleSubmit, getValues, watch } = useForm({
    defaultValues: {
      payment_type: 'offline'
    }
  });

  const payment_type = watch('payment_type');

  useEffect(() => {
    dispatch(setConditionBlockVisible(isFirstMount ? true : isVisible));
  }, [isVisible, isFirstMount]);

  useEffect(() => {
    if (downPaymentSuccess) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [downPaymentSuccess]);
  console.log(downPaymentSuccess);

  console.log({ payment_type, step });

  console.log(step);

  useEffect(() => {
    if (step?.redirect_url) {
      window.open(step?.redirect_url, '_self');
      dispatch(resetRedirectUrl(step.step));
    }
  }, [step]);

  useEffect(() => {
    actualParamsRefetch();
    vehicleParamsRefetch();
  }, []);

  useEffect(() => {
    if (payment_type === 'online') {
      dispatch(
        setConstructorFinalSolution({
          finalSolution: {
            interest_rate: calculationData?.interest_rate - 0.5,
            monthly_payment: parseLocaleNumber(
              calculationLoan({
                amount: calculationData?.credit_amount,
                setGesv: () => {},
                insurance: [],
                percentage: calculationData?.interest_rate - 0.5,
                paymentType: propOr('ANNUITY', 'repayment_method', calculationData),
                period: pathOr(0, ['period', 'value'], calculationData) * 12
              }),
              'ru'
            )
          },
          step: flowSteps.CONSTRUCTOR
        })
      );
    } else {
      dispatch(
        setConstructorFinalSolution({
          finalSolution: { interest_rate: calculationData?.interest_rate },
          step: flowSteps.CONSTRUCTOR
        })
      );
    }
  }, [payment_type]);

  const onSubmit = async () => {
    const isOnline = getValues('payment_type');
    /*const res = await dispatch(
      applyMainDownPayment.endpoints.applyMainDownPayment.initiate({
        uuid: flowUuid,
        is_online: isOnline === 'online',
        step: currentStep
      })
    ).unwrap();
    console.log('res: ', res);*/
    fetchDownPayment({ uuid: flowUuid, is_online: isOnline === 'online', step: currentStep });
    dispatch(resetCommonStatus());
  };

  return (
    <>
      <div className='flex flex-col space-y-3 md:space-y-4'>
        <div tw='flex flex-col space-y-2 p-5 md:py-0'>
          <SubTitle text='Итоговые данные' variant='bold' />
          <SubBody
            text={`Уважаем${
              userGender === 'MALE' ? 'ый' : 'ая'
            } ${shortName}, пожалуйста, проверьте все указанные данные перед совершением оплаты первоначального взноса.`}
            twStyle={tw`text-secondary leading-[20px]`}
          />
        </div>
        <div tw='bg-secondary pt-5 sm:rounded-2xl' ref={loanConditionBlockRef}>
          <BodyText text='Условия займа' variant='bold' twStyle={tw`px-5`} />
          {actualParamsLoading ? (
            <div tw='h-[224px] w-full animate-pulse duration-75 bg-primary rounded-2xl' />
          ) : (
            <div className='grid grid-cols-2 gap-[1px] bg-primary'>
              <LongBlock
                above='Сумма займа'
                text={
                  <CurrencyFormat
                    value={propOr(0, 'credit_amount', calculationData)}
                    displayType={'text'}
                    thousandSeparator=' '
                    suffix=' ₸'
                  />
                }
                icon={<CashIcon variant='secondary' />}
                twStyle={tw`p-5`}
              />
              <LongBlock
                above='Первонач. взнос'
                text={
                  <CurrencyFormat
                    value={propOr(0, 'down_payment', calculationData)}
                    displayType={'text'}
                    thousandSeparator=' '
                    suffix=' ₸'
                  />
                }
                icon={<CashIcon variant='main' />}
                twStyle={tw`p-5`}
              />
              <LongBlock
                above='Ставка'
                text={
                  <CurrencyFormat
                    value={
                      finalSolution?.interest_rate
                        ? finalSolution?.interest_rate
                        : propOr(0, 'interest_rate', calculationData)
                    }
                    displayType={'text'}
                    suffix='%'
                  />
                }
                icon={<PercentIcon />}
                twStyle={tw`p-5 sm:rounded-none`}
              />
              <LongBlock
                above='Ежемесяч. платеж'
                text={
                  <CurrencyFormat
                    value={
                      finalSolution?.monthly_payment
                        ? finalSolution?.monthly_payment
                        : propOr(0, 'monthly_payment', calculationData)
                    }
                    displayType={'text'}
                    thousandSeparator=' '
                    suffix=' ₸'
                  />
                }
                icon={<CalcIcon />}
                twStyle={tw`p-5 sm:rounded-none`}
              />
              <LongBlock
                above='Срок'
                text={`${pathOr('-', ['period', 'value'], calculationData)} ${pathOr(
                  '',
                  ['period', 'caption'],
                  calculationData
                )}`}
                icon={<ClockIcon />}
                twStyle={tw`p-5 sm:rounded-bl-2xl`}
              />
              <LongBlock
                above='Метод погашения'
                text={`${prop(
                  'title',
                  find(propEq('value', propOr('ANNUITY', 'repayment_method', calculationData)), selectorItems)
                )}`}
                icon={<BagIcon />}
                twStyle={tw`p-5 sm:rounded-br-2xl`}
              />
            </div>
          )}
        </div>
        <ContainerBlock title='Данные по авто' twStyle={tw`p-0`} titleStyle={tw`px-5 pt-5`}>
          {vehicleParamsLoading ? (
            <div tw='h-[224px] w-full animate-pulse duration-75 bg-primary rounded-2xl' />
          ) : (
            <div tw='flex flex-col space-y-[1px]'>
              <div className='p-5 sm:pt-0'>
                <div className='flex justify-center'>
                  <img src={carLoader ? carLoader : car} alt='car icon' />
                </div>
                <div className='flex flex-col space-y-2 pt-5 sm:pt-0'>
                  <SubTitle
                    text={`${vehicleParams?.vehicle?.brand} ${vehicleParams?.vehicle?.model} ${vehicleParams?.vehicle?.year}`}
                    twStyle={tw`text-s18 mt-5`}
                    variant='bold'
                  />
                  <SubBody
                    text={
                      <span tw='flex space-x-2'>
                        <span>{vehicleParams?.vehicle?.engine_volume}л</span>
                        <span>•</span>
                        <span tw='capitalize'>{capitalize(vehicleParams?.vehicle?.color)}</span>
                      </span>
                    }
                    twStyle={tw`text-secondary`}
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-[1px] bg-primary pt-[1px]'>
                <LongBlock
                  above='Обьем двигателя'
                  text={vehicleParams?.vehicle?.engine_volume}
                  icon={<EngineIcon variant='secondary' />}
                  twStyle={tw`p-5`}
                />
                <LongBlock
                  above='Цвет'
                  text={capitalizeOrNull(vehicleParams?.vehicle?.color)}
                  icon={<PaintBucketIcon />}
                  twStyle={tw`p-5 sm:rounded-none`}
                />
                <LongBlock
                  above='Категория'
                  text={vehicleParams?.vehicle?.category_id}
                  icon={<CarIcon />}
                  twStyle={tw`p-5 sm:rounded-none`}
                />
                <LongBlock
                  above='Страна'
                  text={vehicleParams?.vehicle?.production_country}
                  icon={<FluentTransmissionIcon />}
                  twStyle={tw`p-5 sm:rounded-none`}
                />
                <LongBlock
                  above='Год выпуска'
                  text={vehicleParams?.vehicle?.year}
                  icon={<CalendarIcon variant='secondary' />}
                  twStyle={tw`p-5`}
                />
                <LongBlock
                  above='VIN код'
                  text={vehicleParams?.vehicle?.vin}
                  icon={<SettingIcon />}
                  twStyle={tw`p-5 sm:rounded-none`}
                />
              </div>
            </div>
          )}
        </ContainerBlock>
        <div tw='bg-primary flex flex-col space-y-[1px] sm:rounded-2xl'>
          <BodyText
            text='Данные продавца'
            variant='bold'
            twStyle={tw`px-5 pt-5 bg-secondary mb-[-1px] sm:rounded-t-2xl`}
          />
          <LongBlock above='ФИО' text={vehicleParams?.person_seller?.full_name} twStyle={tw`p-5 sm:rounded-none`} />
          <LongBlock above='ИИН' text={vehicleParams?.person_seller?.iin} twStyle={tw`p-5 sm:rounded-none`} />
          <LongBlock
            above='Номер моб. телефона'
            text={vehicleParams?.person_seller?.mobile_phone}
            twStyle={tw`p-5 sm:rounded-b-2xl`}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} tw='flex flex-col space-y-5'>
          <div css={[tw`flex flex-col bg-primary`]}>
            <div>
              <div css={[tw`bg-secondary sm:rounded-t-2xl p-5`, false && tw`opacity-50`]}>
                <BodyText text='Метод оплаты' variant='bold' />
                <Caption
                  text={`На данный момент процентная ставка составляет ${
                    finalSolution?.interest_rate ? finalSolution?.interest_rate : calculationData?.interest_rate
                  }%`}
                  twStyle={tw`text-dark-grey mt-1`}
                />
              </div>
              <div>
                <Radio
                  name='payment_type'
                  rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                  control={control}
                  options={radioOptions}
                />
              </div>
            </div>
          </div>
          <div className='text-center space-y-3 px-5 mt-5 sm:mt-0 sm:px-0 sm:flex sm:space-y-0 sm:flex-row-reverse md:items-center pb-10 md:pb-[230px]'>
            <div className='flex-1 md:ml-2 md:w-[337px]'>
              <Button
                type='submit'
                variant='primary'
                caption='Оплатить первоначальный взнос'
                loading={downPaymentLoading}
              >
                Продолжить
              </Button>
            </div>
            <div>
              <RejectCreditBlock flowUuid={flowUuid} />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default MainLoanPaymentPage;
