import 'twin.macro';

import { assoc } from 'ramda';
import React, { useCallback, useEffect } from 'react';
import Div100vh from 'react-div-100vh';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import Logo from '@/assets/images/Logo';
import { Input, OtpInput, SubBody, Title } from '@/components';
import { useApplyAuthMutation } from '@/features/api/apply-auth';
import { isAuthSelector } from '@/features/auth/selectors';
import { fetchVerify } from '@/features/auth/tasks';

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, watch, setError, clearErrors, getValues, setValue } = useForm({
    defaultValues: { mobile_phone: '', code: '', recaptcha: '' }
  });

  const [fetchApplyAuth, { error: authError, isSuccess: authSuccess }] = useApplyAuthMutation();

  const verifySubmit = useCallback(() => {
    const data = assoc('mobile_phone', '+' + getValues().mobile_phone, getValues());
    dispatch(fetchVerify(data))
      .unwrap()
      .catch(error => setError('code', error.message));
  }, [dispatch, getValues, setError]);

  const mobile_phone = watch('mobile_phone');
  const recaptcha = watch('recaptcha');

  useEffect(() => {
    if (mobile_phone?.length === 11 && recaptcha.length > 0) {
      fetchApplyAuth({ mobile_phone: '+' + mobile_phone, recaptcha });
    }
  }, [fetchApplyAuth, mobile_phone, recaptcha]);

  useEffect(() => {
    authError &&
      setError('mobile_phone', {
        type: 'manual',
        message: authError.description
      });
  }, [setError, authError]);

  const isAuth = useSelector(isAuthSelector);

  useEffect(() => {
    isAuth && navigate('/main', { replace: true });
  }, [navigate, isAuth]);

  const handleCheckRobot = value => {
    if (value && value?.length > 0) {
      setValue('recaptcha', value, { shouldValidate: true });
    }
  };

  return (
    // onSubmit={handleSubmit(onSubmit)}
    <Div100vh tw='flex flex-col justify-center items-center origin-center -translate-y-20'>
      <div tw='flex flex-col items-center space-y-5'>
        <Logo />
        <Title text='Автокредитование' variant='bold' />
        <SubBody text='Вход в личный кабинет' twStyle={tw`text-secondary`} />
      </div>

      <form noValidate tw='flex flex-col space-y-4 bg-secondary p-5 rounded-s14 mt-20'>
        <Input
          label='Номер моб. телефона'
          inputMode='numeric'
          name='mobile_phone'
          type='tel'
          control={control}
          rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
          mask={{
            mask: '+{7}(000)000-00-00'
          }}
          clearErrors={clearErrors}
        />
        <ReCAPTCHA sitekey={import.meta.env.AC_RECAPTCHA_SECRET_KEY} onChange={handleCheckRobot} />
        {authSuccess && (
          <OtpInput
            control={control}
            name='code'
            label='Введите код из SMS'
            shouldAutoFocus={authSuccess}
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            handleVerify={verifySubmit}
          />
        )}
      </form>
    </Div100vh>
  );
};

export default AuthPage;
