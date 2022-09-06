import 'twin.macro';

import { compose, filter, is, map, pick, uniq } from 'ramda';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import tw from 'twin.macro';

import { BodyText, SubTitle } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { getCurrentStepData } from '@/helper';
import { steps } from '@/helper/steps';
import { StepTitle } from '@/views/step-title';

const isNotNull = item => is(Number, item.step);

const getStepsBlock = () => compose(uniq, filter(isNotNull), map(pick(['step', 'title'])))(steps);

const getStatus = (step, currentStep) => {
  if (step === currentStep) {
    return 'active';
  } else if (step < currentStep) {
    return 'completed';
  } else return '';
};

const StepsBlock = () => {
  const location = useLocation();
  const { isMobile } = useContext(DeviceInfoContext);
  const currentStepData = getCurrentStepData(location.pathname);
  const stepsBlock = getStepsBlock();

  return (
    <div tw='flex flex-col sm:flex-row md:flex-col sm:items-center md:items-start py-6 md:py-0 md:pb-6 md:px-0 space-y-5 sm:space-y-0 md:space-y-5 sm:space-x-5 md:space-x-0'>
      {!isMobile && currentStepData?.description ? (
        <div tw='md:max-w-button'>
          <SubTitle text={currentStepData?.title} variant='bold' />
          <BodyText text={currentStepData?.description} twStyle={tw`text-secondary`} />
        </div>
      ) : (
        stepsBlock.map((item, i) => {
          return (
            <StepTitle
              key={i}
              step={item.step}
              title={item.title}
              status={location.pathname === '/main/success' ? 'completed' : getStatus(item.step, currentStepData?.step)}
            />
          );
        })
      )}
    </div>
  );
};

export { StepsBlock };
