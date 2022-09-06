import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { applyMainStatus } from '@/features/api/apply-main';
import { useApplySellerrResendOtpMutation, useApplySellerVerifyMutation } from '@/features/api/apply-seller';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { getPhoneNumber } from '@/features/user/selectors';
import OtpVerify from '@/views/common-otp-verify';

const SellerOtpVerifyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const flowUuid = useSelector(getFlowUuid);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));
  const phoneNumber = useSelector(getPhoneNumber);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty }
  } = useForm({
    mode: 'onChange',
    defaultValues: { code: '' }
  });

  const [fetchResendOtp] = useApplySellerrResendOtpMutation();
  const [fetchSellerVerify, { isSuccess }] = useApplySellerVerifyMutation();

  // console.log({ currentRoute });
  // console.log({ isSuccess });

  useEffect(() => {
    dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
  }, []);

  const handleVerify = async data => {
    let otp = data;
    if (data.code) {
      otp = data.code;
    }
    await fetchSellerVerify({ uuid: step.step_uuid, otp });
    await dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
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
      initialMinutes={1}
      showChangePhone={false}
      timerVariant='otp-verify'
      initialSeconds={59}
    />
  );
};
export default SellerOtpVerifyPage;
