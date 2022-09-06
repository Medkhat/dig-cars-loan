import 'twin.macro';

import { has, is, propOr } from 'ramda';
import React from 'react';

import { landingURL } from '@/app/API-Url';
import Logo from '@/assets/images/Logo';
import { BodyText } from '@/components';
import { Menu } from '@/views/menu';
import { StepTitle } from '@/views/step-title';

const MobileHeader = ({ height, currentStep, isCarHistory }) => {
  return (
    <div tw='pl-9 flex-1 h-[34px] flex items-center'>
      <Menu height={height} currentStep={currentStep} />
      {isCarHistory ? (
        <div>
          <Logo tw='flex-1' onClick={() => window.open(landingURL)} />
        </div>
      ) : null}
      {is(Number, currentStep?.step) ? (
        <StepTitle step={currentStep.step} title={currentStep.title} status='active' />
      ) : (
        <div tw='h-full flex items-center'>
          <BodyText text={has('description', currentStep) ? '' : propOr('', 'title', currentStep)} variant='bold' />{' '}
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
