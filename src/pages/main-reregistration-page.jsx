import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import tw from 'twin.macro';

import wheel from '@/assets/images/wheel-anim-cropped.gif';
import { Backdrop, Button, Modal, SubTitle } from '@/components';
import { Timer2 } from '@/components/timer';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import {
  applyMainStatus,
  useApplyMainAutoRegisterSignMutation,
  useApplyMainCheckDebtMutation,
  useApplyMainSrtsAppendValidationMutation,
  useApplyMainSrtsPaymentMutation,
  useApplyMainUnRegisterAgrLinkMutation,
  useBipBeeUnrecordAndRecordMutation,
  useSrtsUnrecordAndRecordMutation
} from '@/features/api/apply-main';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetCommonStatus } from '@/features/status/slice';
import { flowStatuses, flowSteps } from '@/helper/constants';
import { bodyContents } from '@/helper/reregistration-data';
import BiometryBackdropContent from '@/views/biometry-backdrop-content';

import ReRegistrationBlock from '../views/main-reregistration-block';

// STATUS TYPES:  finished | examination | wait

const MainReRegistrationPage = () => {
  const dispatch = useDispatch();
  const { isMobile } = useContext(DeviceInfoContext);

  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);

  const flowUuid = useSelector(getFlowUuid);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));

  const unRegisterInfo = useSelector(getStepByName(flowSteps.SELLER_UNREGISTER_AUTO_AGREEMENT));
  const srtsUnRecAndRec = useSelector(getStepByName(flowSteps.SRTS_UNRECORD_AND_RECORD));
  const finalSign = useSelector(getStepByName(flowSteps.AUTO_REGISTER_SIGN));
  const srtsAppendValidation = useSelector(getStepByName(flowSteps.AUTO_SRTS_APPEND_VALIDATION));
  const bipBeeUnrecordAndRecord = useSelector(getStepByName(flowSteps.BIP_BEE_UNRECORD_AND_RECORD));
  const checkDebt = useSelector(getStepByName(flowSteps.BORROWER_AUTO_REGISTER_CHECK_DEBT));

  const [fetchSrtsAppendValidation] = useApplyMainSrtsAppendValidationMutation();
  const [fetchCheckDebt] = useApplyMainCheckDebtMutation();
  const [fetchSrtsPayment] = useApplyMainSrtsPaymentMutation();
  const [fetchSellerUnRegAutoAgr] = useApplyMainUnRegisterAgrLinkMutation();
  const [fetchSrtsUnRecAndRec] = useSrtsUnrecordAndRecordMutation();
  const [fetchBipBeeUnrecordAndRecord] = useBipBeeUnrecordAndRecordMutation();

  console.log(currentStep);

  const { socket_url } = step;
  const [fetchBiometry, { isLoading }] = useApplyMainAutoRegisterSignMutation();

  useGetDataStreamingQuery({ url: socket_url, step: currentStep }, { skip: !socket_url });

  useEffect(() => {
    if (bipBeeUnrecordAndRecord.is_final && bipBeeUnrecordAndRecord.is_success) {
      dispatch(resetCommonStatus());
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [bipBeeUnrecordAndRecord]);

  useEffect(() => {
    if (step.is_final && step?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [step]);

  useEffect(() => {
    if (currentStep === flowSteps.BORROWER_AUTO_REGISTER_CHECK_DEBT) {
      fetchCheckDebt({ step: currentStep, uuid: flowUuid });
    }
    if (currentStep === flowSteps.SRTS_PAYMENT) {
      fetchSrtsPayment({ step: currentStep, uuid: flowUuid });
    }
    if (currentStep === flowSteps.SELLER_UNREGISTER_AUTO_AGREEMENT) {
      fetchSellerUnRegAutoAgr({ step: currentStep, uuid: flowUuid });
    }
    if (currentStep === flowSteps.AUTO_SRTS_APPEND_VALIDATION) {
      fetchSrtsAppendValidation({ step: currentStep, uuid: flowUuid });
    }
    if (currentStep === flowSteps.SRTS_UNRECORD_AND_RECORD) {
      fetchSrtsUnRecAndRec({ step: currentStep, uuid: flowUuid });
    }
    if (currentStep === flowSteps.BIP_BEE_UNRECORD_AND_RECORD) {
      fetchBipBeeUnrecordAndRecord({ step: currentStep, uuid: flowUuid });
    }
  }, [currentStep]);

  useAsync(async () => {
    if (currentStep === flowSteps.AUTO_SRTS_APPEND_VALIDATION) {
      await dispatch(
        applyMainStatus.endpoints.applyStatus.initiate(
          { uuid: flowUuid },
          {
            forceRefetch: true,
            subscriptionOptions: { pollingInterval: currentStep === flowSteps.AUTO_SRTS_APPEND_VALIDATION ? 60000 : 0 }
          }
        )
      );
    }
  }, [currentStep]);

  const onSubmit = e => {
    e.preventDefault();
    fetchBiometry({ flow_uuid: flowUuid, step: currentStep });
    setIsOpenBackdrop(true);
  };

  const firstBlockStatus = (currentStep, flowSteps) => {
    if (currentStep.step === flowSteps.SELLER_UNREGISTER_AUTO_AGREEMENT && currentStep.is_loading) {
      return 'examination';
    } else if (
      (currentStep.step === flowSteps.SELLER_UNREGISTER_AUTO_AGREEMENT && currentStep.is_final) ||
      currentStep.step === flowSteps.BIP_BEE_UNRECORD_AND_RECORD ||
      currentStep.step === flowSteps.AUTO_SRTS_APPEND_VALIDATION ||
      currentStep.step === flowSteps.SRTS_PAYMENT ||
      currentStep.step === flowSteps.BORROWER_AUTO_REGISTER_CHECK_DEBT ||
      currentStep.step === flowSteps.AUTO_REGISTER_SIGN
    ) {
      return 'finished';
    } else {
      return 'wait';
    }
  };

  const secondBlockStatus = (currentStep, flowSteps) => {
    if (currentStep.step === flowSteps.SRTS_UNRECORD_AND_RECORD && currentStep.is_loading) {
      return 'examination';
    } else if (
      (currentStep.step === flowSteps.SRTS_UNRECORD_AND_RECORD && currentStep.is_final) ||
      currentStep.step === flowSteps.AUTO_SRTS_APPEND_VALIDATION ||
      currentStep.step === flowSteps.BIP_BEE_UNRECORD_AND_RECORD
    ) {
      return 'finished';
    } else {
      return 'wait';
    }
  };

  return (
    <>
      <div className='flex flex-col space-y-3'>
        {srtsAppendValidation.is_success || srtsAppendValidation.status === 'DONE' ? (
          <div className='flex pb-5 pl-5'>
            <SubTitle text='Перерегистрация завершена!' variant='bold' twStyle={tw`text-secondary text-s18`} />
          </div>
        ) : (
          <div className='flex flex-col space-y-2 pb-5 pl-5'>
            <SubTitle text='Идет процесс перерегистрации ...' variant='bold' twStyle={tw`text-secondary text-s18`} />
            <Timer2 initialMinutes={179} initialSeconds={59} />
          </div>
        )}
        <div className='flex flex-col space-y-0.5'>
          <ReRegistrationBlock
            className='sm:rounded-2xl'
            status={firstBlockStatus(step, flowSteps)}
            stepInfo={unRegisterInfo}
            step={1}
            title='Снятие авто с учета'
            body={bodyContents.first}
          />
          <ReRegistrationBlock
            className='sm:rounded-2xl'
            status={secondBlockStatus(step, flowSteps)}
            stepInfo={srtsUnRecAndRec}
            step={2}
            title='Постановка авто на учет'
            body={bodyContents.second}
          />
        </div>
        {/* {checkDebt.status === stepStatuses.FAILED && checkDebt.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT && (
          <div tw='m-3'>
            <SubBody text={checkDebt.status_reason} twStyle={tw`text-error`} />
          </div>
        )} */}
        {srtsAppendValidation.status === 'IN_PROGRESS' && (
          <div tw='mt-5 mx-5 flex items-start text-s14 text-secondary'>
            <img src={wheel} width='40' height='40' tw='relative right-[10px] bottom-[7px]' />
            <span tw='relative right-[10px]'>
              Происходит проверка постановки авто на стороне гос органа. <br />
              Процесс займет не более <Timer2 variant='small' initialSeconds={0} initialMinutes={60} /> минут.
            </span>
          </div>
        )}
        <div tw='text-center space-y-2 px-5 mt-3 sm:px-0 sm:flex sm:flex-row-reverse'>
          <Button
            caption='Перейти к подписанию документов'
            variant='primary'
            loading={
              currentStep === flowSteps.SRTS_PAYMENT ||
              currentStep === flowSteps.BORROWER_AUTO_REGISTER_CHECK_DEBT ||
              currentStep === flowSteps.BIP_BEE_UNRECORD_AND_RECORD
            }
            disabled={currentStep !== flowSteps.AUTO_REGISTER_SIGN}
            onClick={onSubmit}
          >
            Продолжить
          </Button>
        </div>
      </div>
      {isMobile ? (
        <Backdrop isOpen={isOpenBackdrop} setIsOpen={setIsOpenBackdrop}>
          <BiometryBackdropContent fetchBiometry={finalSign.redirect_url} disabled={!finalSign.redirect_url} />
        </Backdrop>
      ) : (
        <Modal open={isOpenBackdrop} setOpen={setIsOpenBackdrop} title='Видеоидентификация' twStyle={tw`rounded-2xl`}>
          <BiometryBackdropContent fetchBiometry={finalSign.redirect_url} disabled={!finalSign.redirect_url} />
        </Modal>
      )}
    </>
  );
};
export default MainReRegistrationPage;
