import 'twin.macro';

import React, { useEffect } from 'react';
import Iframe from 'react-iframe';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { applyMainStatus } from '@/features/api/apply-main';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';

const FramePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));
  const flowUuid = useSelector(getFlowUuid);

  useEffect(() => {
    if (step.is_final) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [step]);

  useEffect(() => {
    !state?.url && navigate('/main', { replace: true });
  }, [navigate, state]);

  return (
    <object data={state?.url} type='application/pdf' className='w-full h-screen'>
      <Iframe
        url={state?.url}
        tw='w-full h-screen'
        allow='microphone camera midi encrypted-media'
        sandbox='allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation allow-presentation allow-same-origin allow-scripts'
      />
    </object>
  );
};

export { FramePage };
