import 'twin.macro';

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';

import blank from '@/assets/images/blank.svg';
import FileIcon from '@/assets/images/icons/FileIcon';
import { Backdrop, BodyText, Button, Modal, SubTitle } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { ThemeContext } from '@/contexts/theme-context';
import { applyMainStatus, useApplyFinalSignMutation, useApplyMainDocumentsQuery } from '@/features/api/apply-main';
import { useGoalByClicksQuery } from '@/features/api/cpa-track';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid, getLeadUuid } from '@/features/application/selectors';
import { getCalculationData } from '@/features/calculation/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { getIin } from '@/features/user/selectors';
import { flowStatuses, flowSteps } from '@/helper/constants';
import BiometryBackdropContent from '@/views/biometry-backdrop-content';
import UdvModalContent from '@/views/udv-modal-content';

const MainSignDocPage = () => {
  const { isMobile } = useContext(DeviceInfoContext);
  const { theme } = useContext(ThemeContext);

  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);
  const flowUuid = useSelector(getFlowUuid);
  const lead_uuid = useSelector(getLeadUuid);
  const iin = useSelector(getIin);
  const calculationData = useSelector(getCalculationData);
  const currentStep = useSelector(getCurrentStep);
  const finalSign = useSelector(getStepByName(flowSteps.FINAL_SIGN));
  const step = useSelector(getStepByName(currentStep));
  const dispatch = useDispatch();

  const [isOpenDoc, setIsOpenDoc] = useState(false);
  const [doc, setDoc] = useState();

  const [fetchFinalSign] = useApplyFinalSignMutation();

  const { socket_url } = step;

  useGetDataStreamingQuery({ url: socket_url, step: currentStep }, { skip: !socket_url });

  const { data: documents } = useApplyMainDocumentsQuery(
    { uuid: flowUuid },
    { skip: currentStep !== flowSteps?.FINAL_SIGN }
  );

  useEffect(() => {
    if (step.is_final && step?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [step]);

  useGoalByClicksQuery(
    {
      goal_id: 121,
      click_code: calculationData?.click_code,
      lead_uuid,
      amount: calculationData?.credit_amount,
      iin: iin,
      status: 'approved'
    },
    { skip: step.flow_status !== flowStatuses.ISSUED }
  );

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
        <div tw='w-full  pt-8'>
          <Button
            icon={<FileIcon />}
            variant='primary'
            disabled={!(currentStep === flowSteps.FINAL_SIGN)}
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
            <a href={doc?.document_url} download target='_blank' tw='text-green font-bold' rel='noreferrer'>
              Скачать договор
            </a>
          )}
          <UdvModalContent url={doc?.document_url} />
        </div>
      </Modal>
    </>
  );
};
export default MainSignDocPage;
