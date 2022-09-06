import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import tw from 'twin.macro';

import udo from '@/assets/images/udo.png';
import wheel from '@/assets/images/wheel-anim-cropped.gif';
import { BodyText, Button, Caption, Input2, InputFile, Modal, SubBody, SubTitle } from '@/components';
import { Timer2 } from '@/components/timer';
import { ThemeContext } from '@/contexts/theme-context';
import {
  applyMainStatus,
  useApplyFetchDocsMutation,
  useApplyMainDdocsUploadMutation,
  useApplyMainDdocsVerifyMutation,
  useApplySpouseExistingQuery,
  useApplySpouseLinkMutation,
  useApplyTerminateSpouseLinkMutation,
  useCoBorrowerExistingQuery,
  useCoBorrowerFinalSignLinkMutation,
  useTerminateCoBorrowerFinalSignLinkMutation
} from '@/features/api/apply-main';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetCommonStatus, resetStatus } from '@/features/status/slice';
import { fetchSignDocApi } from '@/features/status/tasks';
import { getPhoneNumber, getUserGender } from '@/features/user/selectors';
import { flowStatuses, flowSteps, stepStatuses } from '@/helper/constants';
import OtpVerify2 from '@/views/common-otp-verify2';
import UdvModalContent from '@/views/udv-modal-content';

const getCaptionTextButton = step => {
  switch (step?.step) {
    case flowSteps.REGISTER_IN_COLVIR:
    case flowSteps.GENERATE_MAIN_DOCUMENTS:
      return 'Идет проверка документов';
    case flowSteps.CO_BORROWER_FINAL_SIGN_AGREEMENT:
      return '';
    default:
      return 'Перейти к подписанию документов';
  }
};

const MainDigitalDocPage = () => {
  const [doc, setDoc] = useState();

  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
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

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { mobile_phone: '', iin: '' }
  });

  const currentStep = useSelector(getCurrentStep);
  const ddocStep = useSelector(getStepByName(flowSteps.FETCH_DDOCS));
  const spouseStep = useSelector(getStepByName(flowSteps.SPOUSE_AGREEMENT));
  const generateMainDocuments = useSelector(getStepByName(flowSteps.GENERATE_MAIN_DOCUMENTS));
  const validateMainDocuments = useSelector(getStepByName(flowSteps.DOCUMENTS_VALIDATION));
  const registerInColvir = useSelector(getStepByName(flowSteps.REGISTER_IN_COLVIR));
  const coBorrowerFinalSign = useSelector(getStepByName(flowSteps.CO_BORROWER_FINAL_SIGN_AGREEMENT));
  const step = useSelector(getStepByName(currentStep));

  const [fetchDdocs, { isSuccess: dDocsSuccess, isLoading: dDocsLoading }] = useApplyFetchDocsMutation();
  const [fetchDdocsVerify, { isLoading: dDocsVerifyLoading }] = useApplyMainDdocsVerifyMutation();

  const { data: spouseExiting } = useApplySpouseExistingQuery(
    { uuid: flowUuid },
    { skip: currentStep !== 'SPOUSE_AGREEMENT' }
  );
  const [fetchTerminateSpouse, { isSuccess: terminateSpouseLinkSuccess }] = useApplyTerminateSpouseLinkMutation();
  const [fetchSpouseLink, { isLoading: spouseLinkLoading, error: spouseError }] = useApplySpouseLinkMutation();

  const { data: coBorrowerExisting } = useCoBorrowerExistingQuery(
    { uuid: flowUuid },
    { skip: currentStep !== flowSteps.CO_BORROWER_FINAL_SIGN_AGREEMENT }
  );
  const [fetchTerminateCoBorrowerFinalSignLink, { isSuccess: terminateCoBorrowerFinalSignLinkSuccess }] =
    useTerminateCoBorrowerFinalSignLinkMutation();
  const [fetchCoBorrowerFinalSignLink, { isSuccess: coBorrowerFinalSignLinkSuccess }] =
    useCoBorrowerFinalSignLinkMutation();
  const [fetchDdocsUpload, { isSuccess: ddocsUploadSuccess, isLoading: ddocsUploadLoading }] =
    useApplyMainDdocsUploadMutation();

  const { socket_url } = step;

  useAsync(async () => {
    if (
      currentStep === flowSteps.REGISTER_IN_COLVIR ||
      currentStep === flowSteps.GENERATE_MAIN_DOCUMENTS ||
      currentStep === flowSteps.DOCUMENTS_VALIDATION
    ) {
      await dispatch(fetchSignDocApi({ step: currentStep, uuid: flowUuid }));
    }
  }, [currentStep, flowUuid]);

  useEffect(() => {
    if (spouseExiting && !spouseExiting?.is_spouse_exists) {
      fetchTerminateSpouse({ uuid: flowUuid });
    }
  }, [spouseExiting]);

  useEffect(() => {
    if (coBorrowerExisting && !coBorrowerExisting?.is_co_borrower_exists) {
      fetchTerminateCoBorrowerFinalSignLink({ uuid: flowUuid });
    }
    if (coBorrowerExisting && coBorrowerExisting?.is_co_borrower_exists) {
      fetchCoBorrowerFinalSignLink({ uuid: flowUuid });
    }
  }, [coBorrowerExisting]);

  useEffect(() => {
    terminateSpouseLinkSuccess &&
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
  }, [terminateSpouseLinkSuccess]);

  useEffect(() => {
    terminateCoBorrowerFinalSignLinkSuccess &&
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
  }, [terminateCoBorrowerFinalSignLinkSuccess]);

  useEffect(() => {
    if (ddocStep.document_url) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [ddocStep]);

  useEffect(() => {
    if (dDocsSuccess) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [dDocsSuccess]);

  useEffect(() => {
    if (registerInColvir.is_final && registerInColvir?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [registerInColvir]);

  useEffect(() => {
    if (generateMainDocuments.is_final && generateMainDocuments?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [generateMainDocuments]);

  useEffect(() => {
    if (validateMainDocuments.is_final && validateMainDocuments?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [validateMainDocuments]);

  useEffect(() => {
    if (ddocsUploadSuccess) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [ddocsUploadSuccess, flowUuid, dispatch]);

  useGetDataStreamingQuery({ url: socket_url, step: currentStep }, { skip: !socket_url });

  const handleSendSms = () => {
    fetchDdocs({ uuid: flowUuid, step: currentStep });
  };

  const onSubmit = data => {
    console.log(data);
    fetchSpouseLink({
      uuid: flowUuid,
      mobile_phone: '+' + data.mobile_phone,
      iin: data.iin,
      step: currentStep
    });
  };

  console.log(step);

  const openUdv = () => {
    setOpen(true);
  };

  const changeSellerData = async e => {
    e.preventDefault();
    dispatch(resetStatus({ step: spouseStep.step, flow_type: spouseStep?.flow_type }));
    reset();
  };

  const variants = {
    initial: { opacity: 0, y: 150 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -150 }
  };

  const getStatus = async e => {
    e.preventDefault();
    await dispatch(resetCommonStatus());
    await dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
  };

  const handleVerify = data => {
    let otp = data;
    if (data.code) {
      otp = data.code;
    }

    fetchDdocsVerify({ step: ddocStep.step, stepUuid: ddocStep.step_uuid, code: otp.replaceAll(' ', '') });
  };

  // console.log({ currentStepResult });

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
            text='Для предоставления единовременного доступа Банку к вашему цифровому удостоверению личности, пожалуйста, подтвердите согласие SMS-кодом с номера 1414.'
            twStyle={tw`text-secondary`}
          />
        </div>
        <AnimatePresence exitBeforeEnter>
          {currentStep === flowSteps.FETCH_DDOCS && !ddocStep.document_url && (
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
                loading={dDocsVerifyLoading}
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
          {currentStep === flowSteps.FETCH_DDOCS && !ddocStep?.is_final && (
            <motion.div
              key={'button'}
              variants={variants}
              initial={false}
              animate={'animate'}
              exit={'exit'}
              className='sm:max-w-button px-5 pb-5'
            >
              <Button
                variant='ghost'
                onClick={handleSendSms}
                loading={dDocsLoading || ddocStep.is_loading}
                disabled={currentStep !== flowSteps.FETCH_DDOCS}
              >
                Отправить SMS
              </Button>
            </motion.div>
          )}
          {ddocStep?.status === stepStatuses.IN_PROGRESS && currentStep === flowSteps.FETCH_DDOCS && (
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
          {currentStep === flowSteps.DOCUMENTS_VALIDATION && (
            <div tw='px-5 flex items-start text-s14 text-secondary'>
              <img src={wheel} width='40' height='40' tw='relative right-[10px] bottom-[7px]' />
              <span tw='relative right-[10px]'>
                Идет дополнительная проверка документов. <br />
                Процесс займет не более <Timer2 variant='small' initialSeconds={0} initialMinutes={30} /> минут.
              </span>
            </div>
          )}
        </AnimatePresence>
        {currentStep === flowSteps.SPOUSE_AGREEMENT && spouseExiting?.is_spouse_exists && (
          <div>
            <div className='flex flex-col space-y-2 p-5'>
              <SubTitle text={`Согласие супруг${userGender === 'MALE' ? 'и' : 'а'}`} variant='bold' />
              <SubBody
                text={`Теперь, необходимо получить согласие вашей супруг${
                  userGender === 'MALE' ? 'и' : 'а'
                } на сделку. Для этого, необходимо ввести следующие данные:`}
                twStyle={tw`text-secondary`}
              />
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              css={[tw`p-5 flex flex-col space-y-2 bg-secondary sm:rounded-2xl`]}
            >
              <div className='flex flex-col space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 mb-4'>
                <Input2
                  label='Номер моб.телефона'
                  inputMode='numeric'
                  mask='+7 999 999 99 99'
                  name='mobile_phone'
                  placeholder='+7 (---) --- -- --'
                  control={control}
                  rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                  errorStyle={tw`sm:absolute sm:bottom-[-16px ]`}
                />
                <Input2
                  label='ИИН'
                  mask='999999999999'
                  name='iin'
                  placeholder='Введите ваш ИИН'
                  control={control}
                  rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                  errorStyle={tw`sm:absolute sm:bottom-[-16px ]`}
                />
              </div>
              <Button
                variant='ghost'
                loading={spouseLinkLoading || step?.is_loading}
                //disabled={isSpouseAgreementSuccessFinish(currentStepResult) || !spouseExiting?.is_spouse_exists}
              >
                Отправить SMS
              </Button>
              <div>
                {spouseError && spouseError?.code === 'ERROR_TO_FORM' && (
                  <Caption text={spouseError?.description} twStyle={tw`text-error`} />
                )}
                {spouseStep?.is_loading && (
                  <div className='flex flex-col space-y-2 !mt-4'>
                    <Button variant='link' onClick={changeSellerData}>
                      Изменить данные
                    </Button>
                    <BodyText text='SMS отправлен' variant='bold' />
                    <SubBody
                      text='Вы можете продолжить заявку после получения согласия супруги(а)'
                      twStyle={tw`text-secondary`}
                    />
                  </div>
                )}
                {spouseStep.is_final && spouseStep.is_success && (
                  <div className='flex flex-col mt-4 space-y-4'>
                    <BodyText text='Согласие супруги(а) получено' variant='bold' />
                    <SubBody text='Теперь вы можете продолжить оформление заявки' twStyle={tw`text-secondary`} />
                  </div>
                )}
                {spouseStep?.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT && (
                  <div tw='my-3'>
                    <SubBody text={spouseStep?.status_reason} variant='bold' twStyle={tw`text-error`} />
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
        {currentStep !== flowSteps.FETCH_DDOCS && (
          <div className='p-5 w-full text-center sm:text-right sm:pr-0'>
            <Button
              variant='primary'
              caption={getCaptionTextButton(step)}
              loading={!coBorrowerFinalSign?.is_success}
              onClick={getStatus}
            >
              Продолжить
            </Button>
          </div>
        )}
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
export default MainDigitalDocPage;
