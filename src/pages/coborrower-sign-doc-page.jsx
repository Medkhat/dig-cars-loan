import 'twin.macro';

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';
import * as yup from 'yup';

import blank from '@/assets/images/blank.svg';
import FileIcon from '@/assets/images/icons/FileIcon';
import { Backdrop, BodyText, Button, Modal, SubTitle } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { ThemeContext } from '@/contexts/theme-context';
import { applyMainStatus } from '@/features/api/apply-main';
import { useCoBorrowerDocumentsQuery, useCoBorrowerFinalSignMutation } from '@/features/api/co-borrower-';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { flowStatuses, flowSteps } from '@/helper/constants';
import BiometryBackdropContent from '@/views/biometry-backdrop-content';
import UdvModalContent from '@/views/udv-modal-content';

const schema = yup
  .object({
    dbz: yup.bool().oneOf([true], 'Это поле обязательное'),
    dz: yup.bool().oneOf([true], 'Это поле обязательное'),
    payment_schedule: yup.bool().oneOf([true], 'Это поле обязательное'),
    fiz_agreement: yup.bool().oneOf([true], 'Это поле обязательное'),
    standing_order: yup.bool().oneOf([true], 'Это поле обязательное')
  })
  .required('Это поле обязательное');

const CoborrowerSignDocPage = () => {
  const { isMobile } = useContext(DeviceInfoContext);
  const { theme } = useContext(ThemeContext);

  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);
  const flowUuid = useSelector(getFlowUuid);
  const currentStep = useSelector(getCurrentStep);
  const finalSign = useSelector(getStepByName(flowSteps.CO_BORROWER_FINAL_SIGN));
  const step = useSelector(getStepByName(currentStep));
  const dispatch = useDispatch();

  const [isOpenDoc, setIsOpenDoc] = useState(false);
  const [doc, setDoc] = useState();

  const [fetchFinalSign] = useCoBorrowerFinalSignMutation();

  const { socket_url } = step;

  useGetDataStreamingQuery({ url: socket_url, step: currentStep }, { skip: !socket_url });

  const { data: documents } = useCoBorrowerDocumentsQuery(
    { uuid: flowUuid },
    { skip: currentStep !== flowSteps?.CO_BORROWER_FINAL_SIGN }
  );

  useEffect(() => {
    if (step.is_final && step?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [step]);

  const openBackdrop = () => {
    fetchFinalSign({ uuid: flowUuid, step: currentStep });
    setIsOpenBackdrop(true);
  };

  const openDocument = doc => {
    setDoc(doc);
    setIsOpenDoc(true);
  };

  return (
    <>
      <div className='relative p-5 flex items-start md:pt-0'>
        <div tw='border-b border-dark pb-5'>
          <SubTitle text='Подписание документов' variant='bold' />
          <BodyText
            text='Все документы необходимо подписать с 9:00 до 21:00. Если Вы не успели, то Вы можете подписать документы на следующий день в указанное время'
            twStyle={tw`text-s14 text-secondary`}
          />
        </div>
        <img src={blank} alt='blank' width={isMobile ? '54px' : '98px'} tw='pl-2 sm:pl-0' />
      </div>
      <div tw='pl-5 pb-1'>
        <BodyText text='Договоры' variant='bold' />
      </div>
      <div tw='flex flex-col space-y-3 p-5 pt-0 m-auto sm:m-0 items-center'>
        {documents?.map((doc, i) => (
          <Button disabled={!doc?.document_url} key={i} variant='download' onClick={() => openDocument(doc)}>
            {doc?.document_name}
          </Button>
        ))}
        {/* <div tw='space-y-3 max-w-button'>
          <BodyText text='Договоры' variant='bold' />
          <Button variant='download'>Договор банковского займа</Button>
          <Button variant='download'>Договор залога</Button>
        </div>
        <div tw='space-y-3 pt-3 max-w-button'>
          <BodyText text='График платежей' variant='bold' />
          <Button variant='download'>График платежей</Button>
        </div>
        <div tw='flex flex-col space-y-3 pt-3 max-w-button'>
          <BodyText text='Поручения и распоряжения' variant='bold' />
          <Button variant='download'>Открытие текущего счета</Button>
          <Button variant='download'>Платежное поручение заемщика на пеервод денег</Button>
          <Button variant='download' twStyle={tw`py-5`}>
            Постоянное распоряжение для списания просроченной задолженности
          </Button>
        </div> */}
        <div tw='w-full  pt-8'>
          <Button
            icon={<FileIcon />}
            variant='primary'
            disabled={!(currentStep === flowSteps.CO_BORROWER_FINAL_SIGN)}
            caption='Для этого Вам необходимо пройти видеоидентификацию'
            onClick={openBackdrop}
          >
            Подписать онлайн
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
      <Modal
        open={isOpenDoc}
        setOpen={setIsOpenDoc}
        title={doc?.document_name}
        twStyle={tw`!p-0 sm:!p-5 w-[95%] sm:w-[950px] sm:rounded-t-2xl  sm:rounded-b-2xl`}
        headerStyle={tw`p-5`}
      >
        <div tw='flex flex-col space-y-3'>
          {doc && (
            <Button variant='link' on tw='pl-5 text-green font-bold' onClick={() => console.log('doc url')}>
              Скачать договор
            </Button>
          )}
          <UdvModalContent url={doc?.document_url} />
        </div>
      </Modal>
    </>
  );
};
export default CoborrowerSignDocPage;
