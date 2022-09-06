import React from 'react';
import tw from 'twin.macro';

import CheckIcon from '@/assets/images/icons/CheckIcon';
import CheckRounded from '@/assets/images/icons/CheckRounded';
import HeroiconsOutlineExclamation from '@/assets/images/icons/HeroiconsOutlineExclamation';
import { BodyText, SubBody } from '@/components';
import { flowStatuses, reregistrationLoadingStep, stepStatuses } from '@/helper/constants';
import Loader from '@/views/loader';

// TODO: НУЖНО УБРАТЬ, ТЕНИЗ ПОТОРОПИЛ СДЕЛАТЬ!

const removeSrtsContent = {
  autoRegisterCheckDebt: {
    status: 'finished',
    text: 'Запрос отправлен в гос. орган'
  },
  srtsPayment: {
    status: 'examination',
    text: 'Процесс постановки авто на учет завершен'
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

const Examination = ({ step, title, currentStep, className, stepInfo, steps }) => {
  const [finalSign, autoSrtsAppend, autoSrtsAppendValidation] = steps;

  console.log('final sign: ', currentStep);

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
          <SubBody text={removeSrtsContent.autoRegisterCheckDebt.text} twStyle={tw`text-secondary`} />
        </div>

        <div className='flex items-center'>
          <div className='w-[40px] h-[40px] flex justify-center items-center'>
            {reregistrationLoadingStep.includes(currentStep) && !autoSrtsAppendValidation?.is_success ? (
              <Loader variant='small' />
            ) : (
              <CheckRounded />
            )}
            {/* {autoSrtsAppend?.is_loading && <Loader variant='small' />}
            {autoSrtsAppend?.is_success && <CheckRounded />} */}
          </div>
          <SubBody text={removeSrtsContent.srtsPayment.text} twStyle={tw`text-secondary`} />
        </div>
      </div>
    </div>
  );
};

const ReRegistrationBlock2 = ({ step, title, status = 'finished', body, className, stepInfo, steps, currentStep }) => {
  console.log(status);

  return (
    <>
      {stepInfo?.status !== stepStatuses?.IN_PROGRESS &&
      stepInfo?.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT ? (
        <Error step={step} title={title} text={stepInfo?.status_reason} className={className} />
      ) : (
        <>
          {status === 'finished' && <Finished step={step} title={title} className={className} />}
          {status === 'examination' && (
            <Examination
              currentStep={currentStep}
              steps={steps}
              step={step}
              title={title}
              body={body}
              className={className}
            />
          )}
          {status === 'wait' && <Wait step={step} title={title} className={className} />}
        </>
      )}
    </>
  );
};
export default ReRegistrationBlock2;
