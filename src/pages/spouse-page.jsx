import 'twin.macro';

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import tw from 'twin.macro';

import blank from '@/assets/images/blank.svg';
import FileIcon from '@/assets/images/icons/FileIcon';
import { Backdrop, BodyText, Button, Modal, SubTitle } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { useSpouseAgreementMutation, useSpouseDocumentsQuery } from '@/features/api/spouse-agrement';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { setSposeUuid } from '@/features/application/slice';
import { getTokenSelector } from '@/features/auth/selectors';
import { authSpouse } from '@/features/auth/tasks';
import { getStepByName } from '@/features/status/selectors';
import { getFullName, getUserGender } from '@/features/user/selectors';
import { flowSteps } from '@/helper/constants';
import BiometryBackdropContent from '@/views/biometry-backdrop-content';
import SpouseRejectCreditBlock from '@/views/spouse-reject-credit-block';
import UdvModalContent from '@/views/udv-modal-content';

const SpousePage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);
  const [isOpenDoc, setIsOpenDoc] = useState(false);
  const [doc, setDoc] = useState();

  const { isMobile } = useContext(DeviceInfoContext);
  const fullName = useSelector(getFullName);
  const userGender = useSelector(getUserGender);
  const flowUuid = useSelector(getFlowUuid);
  const token = useSelector(getTokenSelector);
  const spouseSign = useSelector(getStepByName(flowSteps.SPOUSE_SIGN));

  const [fetchSpouseAgreement] = useSpouseAgreementMutation();

  useGetDataStreamingQuery({ url: spouseSign.socket_url, step: spouseSign.step }, { skip: !spouseSign.socket_url });

  const { data: documents } = useSpouseDocumentsQuery({ uuid: flowUuid }, { skip: !token });

  console.log('token: :', token);

  useEffect(() => {
    const token = searchParams.get('token');
    const spouseUuid = searchParams.get('flow_uuid');
    if (token && spouseUuid) {
      dispatch(setSposeUuid(spouseUuid));
      dispatch(authSpouse(token));
    } else {
      navigate('/404');
    }
  }, [searchParams, dispatch]);

  const openBackdrop = () => {
    fetchSpouseAgreement({ uuid: flowUuid, step: spouseSign.step });
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
          <SubTitle text={`Уважаем${userGender === 'MALE' ? 'ый' : 'ая'}, ${fullName}`} variant='bold' />
          <BodyText
            text={`Спешим сообщить, что ____, которому Вы являетесь супруг${
              userGender === 'MALE' ? 'ой' : 'ом'
            }, получил одобрение по ипотечному займу от Freedom Finance Bank! Просим Вас пройти процесс видеоидентификации личности и подписать необходимые документы для завершения оформления займа. Данная процедура займет не более 3-х минут.`}
            twStyle={tw`text-s14 text-secondary`}
          />
        </div>
        <img src={blank} alt='blank' width={isMobile ? '54px' : '98px'} tw='pl-2 sm:pl-0' />
      </div>
      <div tw='space-y-5 p-5 pt-0 mx-auto sm:m-0 items-center'>
        <div tw='space-y-3 max-w-button'>
          <BodyText text='Согласие' variant='bold' />
          {documents?.map((doc, i) => (
            <Button disabled={!doc?.document_url} key={i} variant='download' onClick={() => openDocument(doc)}>
              {doc?.document_name}
            </Button>
          ))}
          {/*<Button variant='download'>Согласие на предоставление ТС в залог</Button>
          <Button variant='download'>Согласие на вне судебную реализацию</Button>*/}
        </div>
        <div tw='w-full  pt-8'>
          <Button
            icon={<FileIcon />}
            variant='primary'
            caption='Для этого Вам необходимо пройти видеоидентификацию'
            onClick={openBackdrop}
          >
            Подписать онлайн
          </Button>
          <SpouseRejectCreditBlock flowUuid={flowUuid} />
        </div>
      </div>
      {isMobile ? (
        <Backdrop isOpen={isOpenBackdrop} setIsOpen={setIsOpenBackdrop}>
          <BiometryBackdropContent fetchBiometry={spouseSign.redirect_url} disabled={!spouseSign.redirect_url} />
        </Backdrop>
      ) : (
        <Modal open={isOpenBackdrop} setOpen={setIsOpenBackdrop} title='Видеоидентификация' twStyle={tw`rounded-2xl`}>
          <BiometryBackdropContent fetchBiometry={spouseSign.redirect_url} disabled={!spouseSign.redirect_url} />
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
export default SpousePage;
