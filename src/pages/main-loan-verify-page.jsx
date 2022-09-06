import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { useApplyResendMutation } from '@/features/api/apply-main';
import { useGoalByClicksQuery } from '@/features/api/cpa-track';
import { getFlowUuid, getLeadUuid } from '@/features/application/selectors';
import { verifyLoan } from '@/features/application/tasks';
import { getCalculationData } from '@/features/calculation/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import OtpVerify from '@/views/common-otp-verify';

const LoanVerifyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const calculationData = useSelector(getCalculationData);
  const leadUuid = useSelector(getLeadUuid);
  const flowUuid = useSelector(getFlowUuid);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));

  //const currentRoute = useSelector(getCurrentRoute);

  const utm_params = {
    utm_content: state.utm_content?.length > 0 ? state.utm_content : null,
    utm_source: state.utm_source?.length > 0 ? state.utm_source : null,
    utm_medium: state.utm_medium?.length > 0 ? state.utm_medium : null,
    utm_campaign: state.utm_campaign?.length > 0 ? state.utm_campaign : null,
    utm_term: state.utm_term?.length > 0 ? state.utm_term : null
  };

  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid, isDirty }
  } = useForm({
    mode: 'onChange',
    defaultValues: { code: '' }
  });
  const [fetchVerifyResend] = useApplyResendMutation();

  useGoalByClicksQuery(
    {
      goal_id: 120,
      click_code: calculationData?.click_code,
      lead_uuid: leadUuid,
      amount: calculationData?.credit_amount,
      iin: state.iin,
      status: 'pending'
    },
    { skip: !leadUuid }
  );

  useEffect(() => {
    !leadUuid && navigate('/main/calculation');
  }, [leadUuid, navigate]);

  useEffect(() => {
    step?.route && navigate(step?.route);
  }, [step]);

  console.log('STEP: ', step);
  console.log('current_step: ', currentStep);

  const handleVerify = data => {
    let otp = data;
    if (data.code) {
      otp = data.code;
    }
    setLoading(true);
    dispatch(verifyLoan({ uuid: leadUuid, code: otp, utm_params, setError }))
      .unwrap()
      .catch(err => {
        setError('code');
      })
      .finally(res => {
        console.log(res);
        //dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
        setLoading(false);
      });
  };

  const resendOtp = useCallback(() => {
    fetchVerifyResend({ uuid: leadUuid });
  }, [leadUuid]);

  const changeNumber = () => {
    navigate(-1);
  };

  return (
    <OtpVerify
      control={control}
      isValid={isDirty && isValid}
      loading={loading}
      phone={state?.phone || ''}
      handleSubmit={handleSubmit}
      handleVerify={handleVerify}
      resendOtp={resendOtp}
      showChangePhone={true}
      changeNumber={changeNumber}
      timerVariant='otp-verify'
      initialMinutes={1}
      initialSeconds={59}
    />
  );
};
export default LoanVerifyPage;
