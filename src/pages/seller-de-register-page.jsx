import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import { Button, Modal, SubBody, SubTitle } from '@/components';
import { applyMainStatus } from '@/features/api/apply-main';
import {
  useSellerUnregisterAutoValidationMutation,
  useSellerUnregisterDocumentsQuery
} from '@/features/api/seller-unregister';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { getShortName, getUserGender } from '@/features/user/selectors';
import { flowStatuses } from '@/helper/constants';
import SellerUnregisterRejectCreditBlock from '@/views/seller-unregister-reject-credit-block';
import UdvModalContent from '@/views/udv-modal-content';

const SellerDeRegisterPage = () => {
  const [isOpenDoc, setIsOpenDoc] = useState(false);
  const [doc, setDoc] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userGender = useSelector(getUserGender);
  const shortName = useSelector(getShortName);
  const flowUuid = useSelector(getFlowUuid);

  const [fetchAutoValidation] = useSellerUnregisterAutoValidationMutation();

  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));

  const { data: documents } = useSellerUnregisterDocumentsQuery(
    { uuid: flowUuid, step: currentStep },
    { skip: !flowUuid }
  );

  console.log(step);

  const { socket_url } = step;

  useGetDataStreamingQuery({ url: socket_url, step: currentStep }, { skip: !socket_url });

  const handleSubmit = async () => {
    await fetchAutoValidation({ uuid: flowUuid, step: currentStep });
  };

  useEffect(() => {
    if (step.is_final && step?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [step]);

  const openDocument = doc => {
    setDoc(doc);
    setIsOpenDoc(true);
  };

  return (
    <>
      <div className='de-reigstration-page p-5'>
        <div className='mb-5'>
          <SubTitle text={`Уважаем${userGender === 'MALE' ? 'ый' : 'ая'}, ${shortName}!`} variant='bold' />
          <SubBody text={`Заемщик принял условия банка, начинается процедура снятия с учета.`} />
        </div>
        <div className='mb-5'>
          <SubTitle text='Процесс займет не более 15 минут' variant='bold' twStyle={tw`text-[14px]`} />
        </div>
        <div className='mb-10'>
          {documents?.map((doc, i) => (
            <div tw='my-3' key={i}>
              <Button disabled={!doc?.document_url} variant='download' onClick={() => openDocument(doc)}>
                {doc?.document_name}
              </Button>
            </div>
          ))}
        </div>
        <div className='text-center mt-3 sm:px-0 sm:flex sm:flex-row-reverse'>
          <Button
            tw='flex-auto'
            type='submit'
            loading={step?.is_loading}
            disabled={step?.is_loading}
            variant='primary'
            caption='Сведения о покупателе'
            onClick={handleSubmit}
          >
            Отправить
          </Button>
          <SellerUnregisterRejectCreditBlock flowUuid={flowUuid} />
        </div>
      </div>
      <Modal
        open={isOpenDoc}
        setOpen={setIsOpenDoc}
        title={doc?.document_name}
        twStyle={tw`!p-0 sm:!p-5 w-[95%] sm:w-[950px] sm:rounded-t-2xl  sm:rounded-b-2xl`}
        headerStyle={tw`p-5`}
      >
        <div tw='flex flex-col space-y-3'>
          {doc && (
            <Button
              variant='link'
              on
              tw='pl-5 text-green font-bold'
              onClick={() => window.open(doc?.document_url, '_blank')}
            >
              Скачать договор
            </Button>
          )}
          <UdvModalContent url={doc?.document_url} />
        </div>
      </Modal>
    </>
  );
};
export default SellerDeRegisterPage;
