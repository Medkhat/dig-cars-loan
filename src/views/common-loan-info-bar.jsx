import { find, propEq } from 'ramda';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import tw from 'twin.macro';

import ExclamationIcon from '@/assets/images/icons/ExclamationIcon';
import { Caption } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { getCalculationData } from '@/features/calculation/selectors';
import { getStepByName } from '@/features/status/selectors';
import { flowSteps } from '@/helper/constants';
import { steps } from '@/helper/steps';
import NewInfoLoanInfoBar from '@/views/new-loan-info-bar';

export const CommonLoanInfoBar = () => {
  const [display, setDisplay] = useState(false);
  const calculationData = useSelector(getCalculationData);
  const step = useSelector(getStepByName(flowSteps.CONSTRUCTOR));
  const finalSolution = step?.finalSolution;
  const location = useLocation();
  const { pathname } = location;
  const { isMobile } = useContext(DeviceInfoContext);

  useEffect(() => {
    const progressItem = find(propEq('route', location.pathname))(steps);

    if (progressItem?.showLoanInfo) {
      setDisplay(true);
    } else {
      setDisplay(false);
    }
  }, [location, pathname]);

  return (
    <>
      {display && <NewInfoLoanInfoBar calculationData={calculationData} finalSolution={finalSolution} />}
      {finalSolution && finalSolution?.included_in_credit && Number(finalSolution?.additional_principal) > 0 && (
        <div
          className='flex items-center space-x-1 px-3 pb-3  max-w-[960px] m-auto pt-6'
          css={[isMobile ? tw`bg-tertiary` : tw`bg-secondary`]}
        >
          <ExclamationIcon />
          <Caption
            text={`Сумма ${finalSolution?.included_in_credit ? 'кредита' : 'первоначального взноса'} изменилась`}
          />
        </div>
      )}
    </>
  );
};

{
  /* <div className='flex items-center space-x-1 mt-2'>
  <ExclamationRedIcon />
  <Caption text='Сумма первоначального взноса изменилась' />
</div> */
}
