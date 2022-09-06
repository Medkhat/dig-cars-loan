import React from 'react';
import tw from 'twin.macro';

import CheckIcon from '@/assets/images/icons/CheckIcon';
import CheckRounded from '@/assets/images/icons/CheckRounded';
import HeroiconsOutlineExclamation from '@/assets/images/icons/HeroiconsOutlineExclamation';
import { BodyText, SubBody } from '@/components';
import { flowStatuses, flowSteps, stepStatuses } from '@/helper/constants';
import Loader from '@/views/loader';

const withdrawalContent = {
  unRegisterInfo: {
    status: 'finished',
    text: 'Запрос отправлен продавцу авто'
  },
  autoSrtsRemove: {
    status: 'examination',
    text: 'Продавец снял авто с учета'
  }
};

const contentText = step => {
  if (step === flowSteps.SELLER_UNREGISTER_AUTO_AGREEMENT) {
    return 'Запрос отправлен продавцу авто';
  }

  if (step === flowSteps.AUTO_SRTS_REMOVE) {
    return 'Продавец снял с учета авто';
  }
};

const Finished = ({ step, title, className }) => {
  return (
    <div className={`flex justify-between bg-secondary p-5 ${className}`}>
      <div className='flex flex-col'>
        <SubBody text={`Этап ${step}`} twStyle={tw`text-s12`} />
        <BodyText text={title} variant='bold' />
      </div>
      <CheckIcon />
    </div>
  );
};

const Error = ({ step, title, text, className }) => {
  return (
    <div className={`flex justify-between bg-secondary p-5 ${className}`}>
      <div className='flex flex-col space-y-2'>
        <SubBody text={`Этап ${step}`} twStyle={tw`text-s12`} />
        <BodyText text={title} variant='bold' twStyle={tw`text-error`} />
        <BodyText text={text} variant='bold' twStyle={tw`text-error text-s14`} />
      </div>
      <div tw='flex items-center'>
        <HeroiconsOutlineExclamation tw='text-red-500 w-[30px]' />
      </div>
    </div>
  );
};

const Wait = ({ step, title, className }) => {
  return (
    <div className={`flex justify-between p-5 opacity-30 ${className}`}>
      <div className='flex flex-col'>
        <SubBody text={`Этап ${step}`} twStyle={tw`text-s12 text-dark`} />
        <BodyText text={title} variant='bold' twStyle={tw`text-dark`} />
      </div>
    </div>
  );
};

const Examination = ({ step, title, body, className, stepInfo }) => {
  return (
    <div className={`flex flex-col bg-secondary p-5 ${className}`}>
      <div className='flex flex-col space-y-1'>
        <SubBody text={`Этап ${step}`} twStyle={tw`text-s12 text-green`} />
        <BodyText text={title} variant='bold' />
      </div>
      <div className='flex flex-col space-y-1'>
        <div className='flex items-center'>
          <div className='w-[40px] h-[40px] flex justify-center items-center'>
            <CheckRounded />
          </div>
          <SubBody text={body[0].text} twStyle={tw`text-secondary`} />
        </div>

        <div className='flex items-center'>
          <div className='w-[40px] h-[40px] relative top-[1px] flex justify-center items-center'>
            {stepInfo.is_success ? <CheckRounded /> : <Loader variant='small' />}
          </div>
          <SubBody text={body[1].text} twStyle={tw`text-secondary`} />
        </div>
      </div>
    </div>
  );
};

const ReRegistrationBlock = ({ step, title, status = 'finished', body, className, stepInfo }) => {
  return (
    <>
      {stepInfo?.status !== stepStatuses?.IN_PROGRESS &&
      stepInfo?.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT ? (
        <Error step={step} title={title} text={stepInfo?.status_reason} className={className} />
      ) : (
        <>
          {status === 'finished' && <Finished step={step} title={title} className={className} />}
          {status === 'examination' && (
            <Examination step={step} title={title} body={body} className={className} stepInfo={stepInfo} />
          )}
          {status === 'wait' && <Wait step={step} title={title} className={className} />}
        </>
      )}
    </>
  );
};
export default ReRegistrationBlock;
