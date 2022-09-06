import { pathOr, propOr } from 'ramda';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import tw from 'twin.macro';

import car from '@/assets/images/car.png';
import wheel from '@/assets/images/wheel-anim-cropped.gif';
import { Button, Caption, ContainerBlock, SubBody, SubTitle } from '@/components';
import { Timer2 } from '@/components/timer';
import {
  applyMainStatus,
  useApplyMainAdditionalScoreInfoQuery,
  useApplyMainStartAdditionalScoreMutation,
  useApplyMainTerminateAdditionalScoreMutation,
  useApplyStatusQuery
} from '@/features/api/apply-main';
import { applyVehiclelessBackToAddIdentifier } from '@/features/api/apply-vehicleless';
import { vehicleImages, vehicleParams as vehicleParamsApi } from '@/features/api/credits';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid, getLeadUuid, getVehicleImageByType, getVehicleParams } from '@/features/application/selectors';
import { calculationLoan } from '@/features/calculation/calculation-loan-new';
import { getCalculationData } from '@/features/calculation/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetCommonStatus } from '@/features/status/slice';
import { fetchLoanPageApi } from '@/features/status/tasks';
import { getShortName, getUserGender } from '@/features/user/selectors';
import { capitalizeFirstLetter } from '@/helper';
import { carImageTypes, flows, flowStatuses, flowSteps } from '@/helper/constants';
import ConfirmationModal from '@/views/confirmation-modal';
import AddCoborrowerBlock from '@/views/main-add-coborrower-block';
import AddIncomeBlock from '@/views/main-add-income-block';
import AddSellerBlock from '@/views/main-add-seller-block';
import RejectCreditBlock from '@/views/reject-credit-block';

const MainLoanPage = () => {
  const [open, setOpen] = useState(false);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const dispatch = useDispatch();

  const flowUuid = useSelector(getFlowUuid);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));

  const userGender = useSelector(getUserGender);
  const calculationData = useSelector(getCalculationData);
  const shortName = useSelector(getShortName);
  const vehicleParams = useSelector(getVehicleParams);
  const leadUuid = useSelector(getLeadUuid);
  const carLoader = useSelector(getVehicleImageByType(carImageTypes.SIDE_VIEW_LIGHTS));

  const additionScoreData = useSelector(getStepByName(flowSteps.ADDITIONAL_BORROWER_SCORE));
  const sellerLinkData = useSelector(getStepByName(flowSteps.SELLER_SCORE_AGREEMENT));
  const { additionalScoreInfo } = additionScoreData;

  const { socket_url, score_status, step_uuid } = step;

  useGetDataStreamingQuery({ url: socket_url, step: currentStep }, { skip: !socket_url });

  const [fetchStartAdditionalScore, { data, isSuccess: isAdditionalScoreRequiredSuccess }] =
    useApplyMainStartAdditionalScoreMutation();

  // useRequestedParamsQuery(
  //   { lead_uuid: leadUuid },
  //   { skip: !leadUuid, pollingInterval: currentStep === flowSteps.ADDITIONAL_BORROWER_SCORE ? 15000 : 0 }
  // );

  useEffect(() => {
    dispatch(vehicleParamsApi.endpoints.vehicleParams.initiate({ flow_uuid: flowUuid }, { forceRefetch: true }));
    dispatch(vehicleImages.endpoints.vehicleImages.initiate({ flow_uuid: flowUuid }, { forceRefetch: true }));
  }, []);

  useApplyStatusQuery(
    { uuid: flowUuid },
    { skip: currentStep !== flowSteps.MANUAL_SELLER_SCORE, pollingInterval: 10000 }
  );

  const { refetch } = useApplyMainAdditionalScoreInfoQuery(
    { uuid: step_uuid, step: currentStep },
    {
      skip: currentStep !== flowSteps.ADDITIONAL_BORROWER_SCORE && !data?.is_additional_scoring_required,
      pollingInterval: currentStep === flowSteps.ADDITIONAL_BORROWER_SCORE ? 15000 : 0
    }
  );

  const [fetchTerminateAdditionalScore, { isSuccess: isTerminateAdditionalScoreSuccess }] =
    useApplyMainTerminateAdditionalScoreMutation();

  useAsync(async () => {
    if (currentStep === flowSteps.ADDITIONAL_BORROWER_SCORE) {
      await fetchStartAdditionalScore({ uuid: flowUuid });
    }
    /*if (currentStep === flowSteps.MANUAL_SELLER_SCORE) {
      await dispatch(
        applyMainStatus.endpoints.applyStatus.initiate(
          { uuid: flowUuid },
          {
            forceRefetch: true,
            subscriptionOptions: { pollingInterval: currentStep === flowSteps.MANUAL_SELLER_SCORE ? 10000 : 0 }
          }
        )
      );
    }*/
  }, [currentStep]);

  useAsync(async () => {
    if (isAdditionalScoreRequiredSuccess) {
      await dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [isAdditionalScoreRequiredSuccess]);

  useAsync(async () => {
    await dispatch(fetchLoanPageApi({ step: currentStep, uuid: flowUuid }));
  }, [currentStep, flowUuid]);

  useEffect(() => {
    if (step.is_final && step?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [step]);

  useEffect(() => {
    if (isTerminateAdditionalScoreSuccess) {
      setOpen(false);
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [isTerminateAdditionalScoreSuccess]);

  useEffect(() => {
    if (calculationData?.credit_amount) {
      setMonthlyPayment(
        calculationLoan({
          amount: calculationData?.car_principal - calculationData?.down_payment,
          setGesv: () => {},
          insurance: [],
          percentage: calculationData?.interest_rate,
          paymentType: propOr('ANNUITY', 'repayment_method', calculationData),
          period: pathOr(0, ['period', 'value'], calculationData) * 12
        })
      );
    }
  }, [calculationData]);

  const getStatus = async () => {
    dispatch(resetCommonStatus());
    dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
  };

  const terminateAdditionalScore = () => {
    fetchTerminateAdditionalScore({ stepUuid: additionScoreData.step_uuid });
  };

  const backToAddIdentifierHandler = async () => {
    await dispatch(
      applyVehiclelessBackToAddIdentifier.endpoints.applyVehiclelessBackToAddIdentifier.initiate(
        { uuid: flowUuid },
        { forceRefetch: true }
      )
    );
    await dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
  };

  return (
    <>
      <div tw='relative py-2'>
        <div tw='flex flex-col space-y-3 mb-3'>
          <div tw='flex flex-col space-y-2 p-5 md:pt-0'>
            <SubTitle text={`Уважаем${userGender === 'MALE' ? 'ый' : 'ая'} ${shortName}!`} variant='bold' />
            <SubBody
              text={
                currentStep === flowSteps.ADDITIONAL_BORROWER_SCORE
                  ? 'Вам одобрена неполная сумма. Для увеличения суммы займа добавьте созаемщика и/или отразите ваш дополнительный источник дохода.'
                  : 'Заявка предварительно одобрена Банком. ' +
                    'Для получения финального решения, необходимо подтверждение со стороны продавца'
              }
              twStyle={tw`text-secondary`}
            />
          </div>
          <ContainerBlock title={`${vehicleParams?.vehicle?.brand} ${vehicleParams?.vehicle?.model}`}>
            <Caption
              text={`${vehicleParams?.vehicle?.engine_volume}л • ${
                vehicleParams?.vehicle?.year
              } • ${capitalizeFirstLetter(vehicleParams?.vehicle?.color)}`}
              twStyle={tw`text-secondary -mt-4`}
            />
            <img src={carLoader ? carLoader : car} alt='auto_blank' tw='self-center pb-4' />
            {step?.flow_type === flows.CLIENT_TO_CLIENT_WITHOUT_CAR && (
              <>
                <SubBody
                  text='В случае если продавец отказался от сделки, Вы можете заменить авто и выбрать другие условия'
                  twStyle={tw`text-secondary`}
                />
                <Button
                  variant='ghost'
                  onClick={backToAddIdentifierHandler}
                  disabled={
                    sellerLinkData?.status === 'IN_PROGRESS' ||
                    [flowSteps.MANUAL_SELLER_SCORE, flowSteps.SELLER_SCORE, flowSteps.OPEN_BORROWER_ACCOUNT].some(
                      step => step === step.step
                    )
                  }
                >
                  Заменить авто
                </Button>
              </>
            )}
          </ContainerBlock>
          {/* <div className='space-y-0.5'>
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
                twStyle={tw`p-5 sm:rounded-tl-2xl`}
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
                twStyle={tw`p-5 sm:rounded-tr-2xl`}
              />
              <LongBlock
                above='Ставка'
                text={
                  <CurrencyFormat value={propOr(0, 'interest_rate', calculationData)} displayType={'text'} suffix='%' />
                }
                icon={<PercentIcon />}
                twStyle={tw`p-5 sm:rounded-none`}
              />
              <LongBlock
                above='Ежемесяч. платеж'
                text={<CurrencyFormat value={monthlyPayment} displayType={'text'} thousandSeparator=' ' suffix=' ₸' />}
                icon={<CalcIcon />}
                twStyle={tw`p-5 sm:rounded-none`}
              />
              <LongBlock
                above='Срок'
                text={`${pathOr('-', ['period', 'value'], calculationData)} ${toLower(
                  pathOr('', ['period', 'caption'], calculationData)
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
          </div> */}
        </div>
        {currentStep === flowSteps.ADDITIONAL_BORROWER_SCORE && data?.is_additional_scoring_required && (
          <div tw='flex flex-col space-y-3'>
            <AddCoborrowerBlock
              step={step}
              co_borrower={additionalScoreInfo?.co_borrower}
              block={additionalScoreInfo?.block}
              score_status={additionalScoreInfo?.score_status}
              refetch={refetch}
            />
            <AddIncomeBlock
              step={step}
              additional_income={additionalScoreInfo?.additional_income}
              block={additionalScoreInfo?.block}
              score_status={additionalScoreInfo?.score_status}
              refetch={refetch}
            />
          </div>
        )}
        {currentStep !== flowSteps.ADDITIONAL_BORROWER_SCORE && (
          <AddSellerBlock flowUuid={flowUuid} step={step} sellerDataFromVehicleParams={vehicleParams?.person_seller} />
        )}

        {currentStep === flowSteps.MANUAL_SELLER_SCORE && (
          <div tw='flex items-start text-s14 text-secondary p-5'>
            <img src={wheel} width='40' height='40' tw='relative right-[10px] bottom-[7px]' />
            <span tw='relative right-[10px] text-left'>
              Идет дополнительная проверка. <br />
              Процесс займет не более <Timer2 variant='small' initialSeconds={0} initialMinutes={30} /> минут.
            </span>
          </div>
        )}

        <div className='text-center space-y-3 px-5 mt-5 pt-5 sm:px-0 sm:flex sm:space-y-0 sm:flex-row-reverse md:items-center'>
          {currentStep === flowSteps.ADDITIONAL_BORROWER_SCORE && (
            <div className='flex-1 md:ml-2 md:w-[337px]'>
              <Button type='submit' variant='primary' onClick={() => setOpen(true)}>
                Соглашаюсь с условием
              </Button>
            </div>
          )}
          {currentStep !== flowSteps.ADDITIONAL_BORROWER_SCORE && (
            <div className='flex-1 md:ml-2 md:w-[337px]'>
              <Button
                type='submit'
                disabled={!(step.step === flowSteps.CONSTRUCTOR)}
                loading={
                  step.step === flowSteps.SELLER_SCORE ||
                  step.step === flowSteps.OPEN_BORROWER_ACCOUNT ||
                  step.step === flowSteps.MANUAL_SELLER_SCORE
                }
                variant='primary'
                onClick={getStatus}
              >
                Продолжить
              </Button>
            </div>
          )}
          <div>
            <RejectCreditBlock flowUuid={flowUuid} />
          </div>
        </div>
      </div>
      <ConfirmationModal
        open={open}
        setOpen={setOpen}
        confirmHandler={terminateAdditionalScore}
        title='Вы уверены что хотите продолжить процесс?'
        caption='Займ будет рассчитан с учетом обновленных условий'
        successBtnText='Да, продолжить'
        cancelBtnText='Нет, отмена'
      />
    </>
  );
};
export default MainLoanPage;
