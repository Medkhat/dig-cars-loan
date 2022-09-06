import 'twin.macro';

import { yupResolver } from '@hookform/resolvers/yup';
import { propEq, propOr, toLower } from 'ramda';
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAsync } from 'react-use';
import tw from 'twin.macro';
import * as yup from 'yup';

import BagIcon from '@/assets/images/icons/BagIcon';
import CalcIcon from '@/assets/images/icons/CalcIcon';
import CashIcon from '@/assets/images/icons/CashIcon';
import ClockIcon from '@/assets/images/icons/ClockIcon';
import FlagIcon from '@/assets/images/icons/FlagIcon';
import PercentIcon from '@/assets/images/icons/PercentIcon';
import { Backdrop, Button, ContainerBlock, Input, Modal, SubBody, SubTitle } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { applyMainStatus } from '@/features/api/apply-main';
import {
  applyVehiclelessGetDecision,
  useApplyVehiclelessAddIdentifierMutation,
  useApplyVehiclelessBorrowerScoreMutation,
  useApplyVehiclelessGetCurrentParamsQuery
} from '@/features/api/apply-vehicleless';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { setDecisionWithoutAuto } from '@/features/status/slice';
import { getShortName, getUserGender } from '@/features/user/selectors';
import { declOfNum } from '@/helper';
import { flowStatuses, flowSteps, selectorTypes } from '@/helper/constants';
import { grnzMask, letterRegex } from '@/helper/personal-info-helper';
import CalculationContent from '@/views/calculation-content';
import CarNotFoundContent from '@/views/car-not-found-content';
import { LongBlock } from '@/views/long-block';
import RejectCreditBlock from '@/views/reject-credit-block';

const schema = yup
  .object({
    auto_identifier: yup.string().min(7, 'Неверно указан номер авто').required('Неверно указан номер авто')
  })
  .required('Это поле обязательное');

const MainLoanWithoutCarPage = () => {
  const dispatch = useDispatch();
  const userGender = useSelector(getUserGender);
  const currentStep = useSelector(getCurrentStep);
  const flowUuid = useSelector(getFlowUuid);
  const shortName = useSelector(getShortName);
  const step = useSelector(getStepByName(currentStep));
  const borrowerScore = useSelector(getStepByName(flowSteps.BORROWER_SCORE_WITHOUT_AUTO));

  const [solution, setSolution] = useState();
  const [open, setOpen] = useState(false);

  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);

  const { data: currentParams, refetch: refetchCurrentParams } = useApplyVehiclelessGetCurrentParamsQuery(
    { uuid: flowUuid },
    { skip: !flowUuid }
  );

  // const { data: decisions, isSuccess: successDecision } = useApplyVehiclelessGetDecisionQuery(
  //   { uuid: flowUuid },
  //   { skip: !flowUuid }
  // );
  const successDecision = true;

  const [fetchBorrowerScore] = useApplyVehiclelessBorrowerScoreMutation();
  const [fetchAddAuto, { isSuccess: addAutoSuccess, isLoading, data: addAutoData }] =
    useApplyVehiclelessAddIdentifierMutation();

  const additionScoreData = useSelector(getStepByName(flowSteps.ADDITIONAL_BORROWER_SCORE));
  const decisionStep = useSelector(getStepByName(flowSteps.BORROWER_GET_DECISION));
  const { additionalScoreInfo } = additionScoreData;
  const [decisions, setDecisions] = useState(null);

  const { isMobile } = useContext(DeviceInfoContext);

  useEffect(() => {
    if (addAutoData?.models && addAutoData?.models?.length > 0) {
      setOpen(true);
    }
  }, [addAutoData]);

  useEffect(() => {
    if (decisions) {
      setSolution(decisions);
      return;
    }
    if (currentParams) {
      setSolution(currentParams);
      return;
    }
  }, [currentParams, decisions, borrowerScore]);

  const { socket_url, score_status, step_uuid } = step;

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid },
    getValues
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      auto_identifier: ''
    }
  });
  const grnz = watch('auto_identifier');
  const auto_identifier = watch('auto_identifier');

  const handleApplyAuto = () => {
    const body = {
      auto_identifier,
      auto_identifier_type: 'GRNZ',
      params: {
        car_principal: currentParams?.car_principal,
        period: currentParams?.period,
        down_payment: currentParams?.down_payment,
        repayment_method: currentParams?.repayment_method,
        interest_rate: decisions?.interest_rate
      }
    };

    fetchAddAuto({ uuid: flowUuid, body });
  };

  useGetDataStreamingQuery({ url: socket_url, step: currentStep }, { skip: !socket_url });

  useAsync(async () => {
    if (currentStep === flowSteps.BORROWER_SCORE_WITHOUT_AUTO) {
      fetchBorrowerScore({ uuid: flowUuid, step: step.step });
    }
    if (currentStep === flowSteps.ADD_AUTO) {
      const data = await dispatch(
        applyVehiclelessGetDecision.endpoints.applyVehiclelessGetDecision.initiate(
          { uuid: flowUuid },
          { forceRefetch: true }
        )
      );

      if (data.isSuccess) {
        setDecisions(data?.data);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    if (successDecision) {
      dispatch(
        setDecisionWithoutAuto({
          finalSolution: {
            ...currentParams,
            ...decisions
          },
          step: flowSteps.BORROWER_GET_DECISION
        })
      );
    }
  }, [successDecision]);

  useEffect(() => {
    if (
      ((step.is_final && step?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) || addAutoSuccess) &&
      !addAutoData?.models
    ) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [step?.is_final, addAutoSuccess, dispatch, flowUuid, step?.flow_status, addAutoData?.models]);

  console.log(decisions);

  // if(step?.is_loading) {
  //   return <Loader />;
  // }

  console.log(borrowerScore);

  return (
    <div>
      <div tw='p-5 space-y-2'>
        <SubTitle text={`Уважаем${userGender === 'MALE' ? 'ый' : 'ая'} ${shortName}!`} variant='bold' />
        <SubBody
          text={
            borrowerScore?.is_loading
              ? 'Банк принимает решение...'
              : 'Заявка предварительно одобрена Банком. Для получения финального решения, необходимо добавить авто и после получить соглашение продавца.'
          }
          twStyle={tw`text-secondary`}
        />
      </div>
      <div className='space-y-0.5'>
        <div className='grid grid-cols-2 gap-[1px] bg-primary mb-3'>
          <LongBlock
            above='Сумма займа'
            text={
              borrowerScore?.is_loading || (decisions && propEq('car_principal', null, decisions)) ? (
                <div tw='animate-pulse w-[150px] h-[14px] bg-secondary-inverted rounded-full mt-3' />
              ) : (
                <CurrencyFormat
                  value={propOr(0, 'car_principal', decisions)}
                  displayType={'text'}
                  thousandSeparator=' '
                  suffix=' ₸'
                />
              )
            }
            icon={<CashIcon variant='secondary' />}
            twStyle={tw`p-5 sm:rounded-tl-2xl`}
          />
          <LongBlock
            above='Первонач. взнос'
            text={
              borrowerScore?.is_loading || (decisions && propEq('down_payment', null, decisions)) ? (
                <div tw='animate-pulse w-[150px] h-[14px] bg-secondary-inverted rounded-full mt-3' />
              ) : (
                <CurrencyFormat
                  value={propOr(0, 'down_payment', decisions)}
                  displayType={'text'}
                  thousandSeparator=' '
                  suffix=' ₸'
                />
              )
            }
            icon={<CashIcon variant='main' />}
            twStyle={tw`p-5 sm:rounded-tr-2xl`}
          />
          <LongBlock
            above='Ставка'
            text={
              borrowerScore?.is_loading || (decisions && propEq('interest_rate', null, decisions)) ? (
                <div tw='animate-pulse w-[150px] h-[14px] bg-secondary-inverted rounded-full mt-3' />
              ) : (
                <CurrencyFormat value={propOr('-', 'interest_rate', decisions)} displayType={'text'} suffix='%' />
              )
            }
            icon={<PercentIcon />}
            twStyle={tw`p-5 sm:rounded-none`}
          />
          <LongBlock
            above='Ежемесяч. платеж'
            text={
              borrowerScore?.is_loading || (decisions && propEq('monthly_payment', null, decisions)) ? (
                <div tw='animate-pulse w-[150px] h-[14px] bg-secondary-inverted rounded-full mt-3' />
              ) : (
                <CurrencyFormat
                  value={propOr('-', 'monthly_payment', decisions)}
                  displayType={'text'}
                  thousandSeparator=' '
                  suffix=' ₸'
                />
              )
            }
            icon={<CalcIcon />}
            twStyle={tw`p-5 sm:rounded-none`}
          />
          <LongBlock
            above='Срок'
            text={
              borrowerScore?.is_loading || (decisions && propEq('period', null, decisions)) ? (
                <div tw='animate-pulse w-[150px] h-[14px] bg-secondary-inverted rounded-full mt-3' />
              ) : (
                `${propOr(0, 'period', decisions) / 12} ${toLower(declOfNum(currentParams?.period / 12))}`
              )
            }
            icon={<ClockIcon />}
            twStyle={tw`p-5 sm:rounded-bl-2xl`}
          />
          <LongBlock
            above='Метод погашения'
            text={
              borrowerScore?.is_loading || (decisions && propEq('repayment_method', null, decisions)) ? (
                <div tw='animate-pulse w-[150px] h-[14px] bg-secondary-inverted rounded-full mt-3' />
              ) : (
                selectorTypes[decisions?.repayment_method]
              )
            }
            icon={<BagIcon />}
            twStyle={tw`p-5 sm:rounded-br-2xl`}
          />
        </div>
        <>
          {currentStep === flowSteps.ADD_AUTO && (
            <ContainerBlock title='Данные о приобретаемом авто'>
              <SubBody
                text='Введите данные авто для проведения онлайн-оценки и получения финального решения'
                twStyle={tw`text-secondary`}
              />
              <form action=''>
                <Input
                  control={control}
                  name='auto_identifier'
                  icon={!letterRegex.test(grnz[0]) && <FlagIcon />}
                  placeholder='000 AAA 01 или A 001 AAA'
                  rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                  mask={grnzMask}
                />
              </form>
            </ContainerBlock>
          )}
          <div tw='p-5 flex flex-col items-center space-y-4'>
            <Button
              variant='primary'
              onClick={handleApplyAuto}
              disabled={currentStep !== flowSteps.ADD_AUTO || !isValid}
              loading={isLoading}
            >
              Добавить авто
            </Button>
            <Button
              variant='link'
              twStyle={tw`!text-s16`}
              onClick={() => setIsOpenBackdrop(true)}
              disabled={currentStep !== flowSteps.ADD_AUTO || isLoading}
            >
              Изменить условия авто
            </Button>
            <RejectCreditBlock flowUuid={flowUuid} />
          </div>
        </>
        {isMobile ? (
          <Backdrop
            isOpen={isOpenBackdrop}
            setIsOpen={setIsOpenBackdrop}
            title=''
            twStyle={tw`bg-primary p-0`}
            headerStyle={tw`bg-secondary p-5 rounded-t-2xl`}
          >
            <CalculationContent
              setIsOpen={setIsOpenBackdrop}
              refetchCurrentParams={refetchCurrentParams}
              currentParams={currentParams}
            />
          </Backdrop>
        ) : (
          <Modal
            open={isOpenBackdrop}
            setOpen={setIsOpenBackdrop}
            title=''
            outsideClose={false}
            twStyle={tw`rounded-2xl !p-0 rounded-t-2xl`}
            headerStyle={tw`p-5 bg-secondary rounded-t-2xl rounded-t-2xl`}
          >
            <CalculationContent
              setIsOpen={setIsOpenBackdrop}
              refetchCurrentParams={refetchCurrentParams}
              currentParams={currentParams}
            />
          </Modal>
        )}
        {isMobile ? (
          <Backdrop
            isOpen={open}
            setIsOpen={setOpen}
            title='Авто не найдено'
            twStyle={tw`bg-primary p-0`}
            headerStyle={tw`bg-secondary p-5`}
          >
            <CarNotFoundContent models={addAutoData?.models} phone={getValues('mobile_phone')} />
          </Backdrop>
        ) : (
          <Modal
            open={open}
            setOpen={setOpen}
            title='Авто не найдено'
            twStyle={tw`!p-0 !rounded-2xl`}
            headerStyle={tw`p-5 bg-secondary rounded-t-2xl`}
          >
            <CarNotFoundContent models={addAutoData?.models} phone={getValues('mobile_phone')} />
          </Modal>
        )}
      </div>
    </div>
  );
};
export default MainLoanWithoutCarPage;
