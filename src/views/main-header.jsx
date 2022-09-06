import { test } from 'ramda';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAsync } from 'react-use';
import tw from 'twin.macro';

import { withProfileMenu } from '@/app/HOC/with-profile-menu';
import { Backdrop, Button, Caption, Dropdown, Modal } from '@/components';
import StickyContainer from '@/components/sticky-container';
import Wrapper from '@/components/wrapper';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { useApplyAuthMutation, useVerifyAuthMutation } from '@/features/api/apply-auth';
import { getConditionBlockVisible } from '@/features/application/selectors';
import { getActiveApplication, isAuthSelector } from '@/features/auth/selectors';
import { fetchVerify } from '@/features/auth/tasks';
import { getFullName, getUserType } from '@/features/user/selectors';
import { userTypes } from '@/helper/constants';
import CommonLoanProgress from '@/views/common-loan-progress';
import DesktopHeader from '@/views/desktop-header';
import MobileHeader from '@/views/mobile-header';

import { CommonLoanInfoBar } from './common-loan-info-bar';
import LoginContent from './login';

const MainHeader = ({ flow, currentStep, isCarHistory }) => {
  const [recaptchaValue, setRecaptchaValue] = useState();
  const [authOpen, setAuthOpen] = useState(false);

  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { height, isMobile } = useContext(DeviceInfoContext);

  const fullName = useSelector(getFullName);
  const userType = useSelector(getUserType);
  const isAuth = useSelector(isAuthSelector);
  const hasActiveApplication = useSelector(getActiveApplication);
  const isConditionBlockVisible = useSelector(getConditionBlockVisible);

  const {
    control: authControl,
    watch: authWatch,
    reset: authReset,
    setError
  } = useForm({
    mode: 'onChange',
    defaultValues: { mobile_phone: '', code: '' }
  });

  const mobile_phone = authWatch('mobile_phone');
  const code = authWatch('code');

  const [
    fetchApplyAuth,
    { error: applyAuthError, isSuccess: applyAuthSuccess, isLoading: applyAuthLoading, reset: applyAuthReset }
  ] = useApplyAuthMutation();
  const [fetchApplyAuthVerify, { error: authVerivyError, isSuccess: authVerifySuccess }] = useVerifyAuthMutation();

  const sendOtp = useCallback(() => {
    const phone = mobile_phone?.replaceAll(' ', '');

    if (phone?.length === 12 && !applyAuthSuccess) {
      fetchApplyAuth({ mobile_phone: phone, recaptcha: recaptchaValue });
    }
  }, [mobile_phone, applyAuthSuccess, fetchApplyAuth, recaptchaValue]);

  const handleCheckRobotForAuth = useCallback(
    value => {
      if (value && value?.length > 0) {
        setRecaptchaValue(value);
      }
    },
    [setRecaptchaValue]
  );

  useAsync(async () => {
    if (code?.length === 4) {
      await dispatch(fetchVerify({ mobile_phone, code }))
        .unwrap()
        .then(() => {
          setAuthOpen(false);
        })
        .catch(error => setError('code', error.message));
    }
  }, [code]);

  useEffect(() => {
    if (applyAuthError) {
      toast.error(applyAuthError?.description || 'Ошибка авторизации', {
        hideProgressBar: true
      });
    }
  }, [authVerivyError, applyAuthError]);

  useEffect(() => {
    if (hasActiveApplication) {
      setAuthOpen(true);
    }
  }, [hasActiveApplication]);

  //console.log(!isConditionBlockVisible);

  const goToAuth = () => {
    setAuthOpen(true);
  };

  const ProfileMenu = withProfileMenu(Dropdown);

  return (
    <>
      <div tw=' w-full bg-secondary h-[58px] sm:h-[95px]'>
        <Wrapper twStyles={tw`flex items-center space-x-3 sm:space-x-reverse sm:space-x-6 py-3 sm:py-6`}>
          {isMobile ? (
            <MobileHeader isCarHistory={isCarHistory} height={height} flow={flow} currentStep={currentStep} />
          ) : (
            <DesktopHeader flow={flow} isCarHistory={isCarHistory} />
          )}
          {isAuth && userType === userTypes.BORROWER ? (
            <ProfileMenu fullName={fullName} />
          ) : (
            test(/^main/)(flow) && (
              <Button variant='link' onClick={goToAuth}>
                <Caption text='ВОЙТИ' twStyle={tw`text-green`} />
              </Button>
            )
          )}
        </Wrapper>
      </div>
      {pathname !== '/main/success' && (
        <StickyContainer>
          <CommonLoanProgress />
          {!isConditionBlockVisible && pathname !== '/main/calculation' && <CommonLoanInfoBar />}
        </StickyContainer>
      )}
      {isMobile ? (
        <Backdrop
          title='Войти в личный кабинет'
          isOpen={authOpen}
          setIsOpen={setAuthOpen}
          twStyle={tw`p-0 bg-primary`}
          headerStyle={tw`bg-secondary p-5 mb-3 flex items-center justify-between`}
        >
          <LoginContent
            phone={mobile_phone}
            control={authControl}
            authSuccess={applyAuthSuccess}
            verifySubmit={sendOtp}
            handleCheckRobot={handleCheckRobotForAuth}
            recaptchaValue={recaptchaValue}
            loading={applyAuthLoading}
            reset={authReset}
            authReset={applyAuthReset}
          />
        </Backdrop>
      ) : (
        <Modal
          title='Войти в личный кабинет'
          open={authOpen}
          setOpen={setAuthOpen}
          twStyle={tw`!p-0 bg-primary w-[460px] rounded-2xl`}
          headerStyle={tw`p-5 bg-secondary rounded-t-2xl mb-3 flex items-center justify-between`}
        >
          <LoginContent
            phone={mobile_phone}
            control={authControl}
            authSuccess={applyAuthSuccess}
            verifySubmit={sendOtp}
            handleCheckRobot={handleCheckRobotForAuth}
            recaptchaValue={recaptchaValue}
            loading={applyAuthLoading}
            reset={authReset}
            authReset={applyAuthReset}
          />
        </Modal>
      )}
    </>
  );
};

export { MainHeader };
