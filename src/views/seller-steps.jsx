import 'twin.macro';

import { propOr } from 'ramda';
import React from 'react';

import { BodyText } from '@/components';

const SellerSteps = ({ currentStep }) => {
  console.log(currentStep);

  return (
    <div tw='py-8'>
      <BodyText text={propOr('Подтверждение личности', 'title', currentStep)} variant='bold' />
    </div>
  );
};

export { SellerSteps };
