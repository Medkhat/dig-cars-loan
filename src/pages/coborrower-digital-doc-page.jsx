import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';

import udo from '@/assets/images/udo.png';
import { BodyText, Button, Caption, InputFile, Modal, SubBody, SubTitle } from '@/components';
import { applyMainStatus } from '@/features/api/apply-main';
import {
  useCoBorrowerDdocsUploadMutation,
  useCoBorrowerDdocsVerifyMutation,
  useCoBorrowerFetchDdocsMutation,
  useCoBorrowerOpenAccountMutation
} from '@/features/api/co-borrower-';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetCommonStatus } from '@/features/status/slice';
import { getPhoneNumber, getUserGender } from '@/features/user/selectors';
import { flowStatuses, flowSteps, stepStatuses } from '@/helper/constants';
import OtpVerify2 from '@/views/common-otp-verify2';
import UdvModalContent from '@/views/udv-modal-content';

const CoborrowerDigitalDocPage = () => {
  const [doc, setDoc] = useState();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const flowUuid = useSelector(getFlowUuid);
  const userGender = useSelector(getUserGender);
  const mobilePhone = useSelector(getPhoneNumber);

  const {
    control: ddocsControl,
    handleSubmit: ddocsHandleSubmit,
    formState: { isValid, isDirty }
  } = useForm({
    mode: 'onChange',
    defaultValues: { code: '' }
  });

  const currentStep = useSelector(getCurrentStep);
  const currentStepInfo = useSelector(getStepByName(currentStep));
  const ddocStep = useSelector(getStepByName(flowSteps.CO_BORROWER_FETCH_DDOCS));
  const openAccount = useSelector(getStepByName(flowSteps.OPEN_CO_BORROWER_ACCOUNT));

  const [fetchDdocs, { isSuccess: dDocsSuccess, isLoading: dDocsLoading }] = useCoBorrowerFetchDdocsMutation();
  const [fetchDdocsVerify] = useCoBorrowerDdocsVerifyMutation();
  const [fetchCoBorrowerOpenAccount] = useCoBorrowerOpenAccountMutation();
  const [fetchDdocsUpload, { isSuccess: ddocsUploadSuccess, isLoading: ddocsUploadLoading }] =
    useCoBorrowerDdocsUploadMutation();

  useEffect(() => {
    if (dDocsSuccess) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }

    if (ddocStep.document_url) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }

    if (
      openAccount.status === stepStatuses.IN_PROGRESS &&
      openAccount.is_final &&
      openAccount?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT
    ) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }

    if (ddocsUploadSuccess) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [openAccount, dDocsSuccess, ddocStep.document_url, dispatch, flowUuid, ddocsUploadSuccess]);

  useEffect(() => {
    if (currentStep === flowSteps.OPEN_CO_BORROWER_ACCOUNT) {
      fetchCoBorrowerOpenAccount({ uuid: flowUuid, step: flowSteps.OPEN_CO_BORROWER_ACCOUNT });
    }
  }, [currentStep]);

  useGetDataStreamingQuery(
    { url: currentStepInfo?.socket_url, step: currentStep },
    { skip: !currentStepInfo?.socket_url }
  );

  const handleSendSms = () => {
    fetchDdocs({ uuid: flowUuid, step: currentStep });
  };

  const openUdv = () => {
    setOpen(true);
  };

  const variants = {
    initial: { opacity: 0, y: 150 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -150 }
  };

  const getStatus = () => {
    dispatch(resetCommonStatus());
    dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
  };

  const handleVerify = data => {
    let otp = data;
    if (data.code) {
      otp = data.code;
    }

    fetchDdocsVerify({ step: ddocStep.step, stepUuid: ddocStep.step_uuid, code: otp.replaceAll(' ', '') });
  };

  const handleUploadDoc = e => {
    setDoc(e.target.files[0]);
  };

  const handleDeleteDoc = () => {
    setDoc(null);
  };

  const onSubmitUploadDoc = e => {
    e.preventDefault();

    const formData = new FormData();
    console.log(doc);
    formData.append('document_file', doc);
    fetchDdocsUpload({ step_uuid: ddocStep.step_uuid, formData });
  };

  return (
    <LayoutGroup>
      <div className='flex flex-col space-y-3'>
        <div tw='flex flex-col space-y-2 sm:pt-0 p-5'>
          <SubTitle text='Цифровое удостоверение личности' variant='bold' />
          <SubBody
            text='Для предоставления единовременного доступа Банку к вашему цифровому удостоверению личности, пожалуйста, подтвердите согласие SMS-кодом с номера 1414.     '
            twStyle={tw`text-secondary`}
          />
        </div>
        <AnimatePresence exitBeforeEnter>
          {currentStep === flowSteps.CO_BORROWER_FETCH_DDOCS && !ddocStep.document_url && (
            <motion.div
              key={'redirectUrl'}
              variants={variants}
              initial={'initial'}
              animate={'animate'}
              exit={'exit'}
              tw='flex flex-col p-5 pt-0'
            >
              <OtpVerify2
                control={ddocsControl}
                isValid={isDirty && isValid}
                loading={dDocsLoading}
                phone={mobilePhone || ''}
                handleSubmit={ddocsHandleSubmit}
                handleVerify={handleVerify}
                showChangePhone={false}
                timerVariant='otp-timer'
                initialMinutes={1}
                initialSeconds={59}
              />
            </motion.div>
          )}
          {currentStep === flowSteps.CO_BORROWER_FETCH_DDOCS && !ddocStep?.is_final && (
            <motion.div
              key={'button'}
              variants={variants}
              initial={false}
              animate={'animate'}
              exit={'exit'}
              className='sm:max-w-button px-5 pb-5'
            >
              <Button variant='ghost' onClick={handleSendSms} loading={dDocsLoading || currentStepInfo.is_loading}>
                Отправить SMS
              </Button>
            </motion.div>
          )}
          {ddocStep?.status === stepStatuses.IN_PROGRESS && currentStep === flowSteps.CO_BORROWER_FETCH_DDOCS && (
            <form noValidate onSubmit={onSubmitUploadDoc} tw='flex flex-col space-y-3 p-5'>
              <SubBody
                text='В случае если смс-код с номера 1414 не был получен, Вы можете загрузить скан. копию/цифровую версию удостоверения личности с обеих сторон единым .pdf файлом.'
                twStyle={tw`text-secondary`}
              />
              <div className='flex flex-col space-y-[4px]'>
                <InputFile
                  text='Загрузить удос. личности'
                  onChange={handleUploadDoc}
                  file={doc}
                  onDelete={handleDeleteDoc}
                  name='document_file'
                />
                <Caption
                  text={<span>Файл должен быть в формате PDF и размером не более 5 мб</span>}
                  twStyle={tw`text-dark pl-4`}
                />
              </div>
              <div tw=''>
                <Button variant='ghost' type='submit' disabled={false} loading={ddocsUploadLoading}>
                  Отправить удос. личности
                </Button>
              </div>
            </form>
          )}
          {ddocStep?.document_url && (
            <motion.div
              key={'documentUrl'}
              variants={variants}
              initial={'initial'}
              animate={'animate'}
              exit={'exit'}
              tw='flex flex-col p-5 space-y-4 bg-secondary sm:rounded-2xl'
            >
              <BodyText
                text={
                  <>
                    <span>
                      Спасибо, Банк получил Ваше цифровое <br /> удостоверение личности
                    </span>
                  </>
                }
                variant='bold'
              />
              <div tw='flex items-center space-x-3'>
                <Button variant='link' onClick={openUdv}>
                  <img src={udo} alt='udo' />
                </Button>
                <SubBody text='Номер: 036324033' twStyle={tw`text-secondary`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {currentStep === flowSteps.OPEN_CO_BORROWER_ACCOUNT && (
          <div tw='p-5'>
            <BodyText text='Идет процесс открытия текущего счета...' variant='bold' />
            <Caption
              text='Пожалуйста, не закрывайте данную вкладку до получения успешного статуса.'
              twStyle={tw`text-secondary`}
            />
          </div>
        )}
        {currentStepInfo.is_final && currentStepInfo.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT && (
          <div tw='p-5'>
            <SubBody text={currentStepInfo.status_reason} twStyle={tw`text-secondary`} />
          </div>
        )}
        <div className='p-5 w-full text-center sm:text-right sm:pr-0'>
          <Button
            variant='primary'
            caption={'Перейти к подписанию документов'}
            disabled={!ddocStep.document_url}
            loading={!ddocStep?.is_final || currentStepInfo.is_loading}
            onClick={getStatus}
          >
            Продолжить
          </Button>
        </div>
        <Modal
          open={open}
          setOpen={setOpen}
          title='Удостоверение личности'
          twStyle={tw`!p-0 sm:!pb-5 sm:w-[950px] sm:rounded-t-2xl  sm:rounded-b-2xl`}
          headerStyle={tw`p-5`}
        >
          <UdvModalContent url={ddocStep?.document_url} />
        </Modal>
      </div>
    </LayoutGroup>
  );
};
export default CoborrowerDigitalDocPage;
