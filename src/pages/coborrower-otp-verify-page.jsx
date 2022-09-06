import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { applyMainStatus } from '@/features/api/apply-main';
import {
  useCoBorrowerAgreementResendOtpMutation,
  useCoBorrowerAgreementVerifyMutation
} from '@/features/api/co-borrower-';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { getPhoneNumber } from '@/features/user/selectors';
import OtpVerify from '@/views/common-otp-verify';

const CoborrowerOtpVerifyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const phoneNumber = useSelector(getPhoneNumber);
  const uuid = useSelector(getFlowUuid);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty }
  } = useForm({
    mode: 'onChange',
    defaultValues: { code: '' }
  });

  const [fetchResendOtp] = useCoBorrowerAgreementResendOtpMutation();
  const [fetchVerify, { isSuccess }] = useCoBorrowerAgreementVerifyMutation();

  useEffect(() => {
    dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid }, { forceRefetch: true }));
  }, []);

  const handleVerify = async data => {
    let otp = data;
    if (data.code) {
      otp = data.code;
    }
    await fetchVerify({ uuid: step.step_uuid, otp });
    await dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid }, { forceRefetch: true }));
  };

  const resendOtp = () => {
    reset();
    fetchResendOtp({ uuid: step.step_uuid });
    console.log('resend otp logic');
  };

  return (
    <OtpVerify
      control={control}
      isValid={isDirty && isValid}
      phone={phoneNumber}
      handleSubmit={handleSubmit}
      handleVerify={handleVerify}
      resendOtp={resendOtp}
      initialMinutes={0}
      showChangePhone={false}
      timerVariant='otp-verify'
      initialSeconds={59}
    />
  );
};
export default CoborrowerOtpVerifyPage;
