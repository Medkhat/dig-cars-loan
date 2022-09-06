import 'twin.macro';

import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTimer } from 'react-timer-hook';

import { Button, Input2, OtpInput, SubBody } from '@/components';

const LoginContent = ({
  control,
  phone: mobilePhone,
  verifySubmit,
  authSuccess,
  handleCheckRobot,
  recaptchaValue,
  loading,
  reset,
  authReset
}) => {
  const [applyAuth, setApplyAuth] = useState(false);
  const [timerEnd, setTimerEnd] = useState(false);
  const phone = mobilePhone?.replaceAll(' ', '');

  const time = new Date();
  time.setSeconds(time.getSeconds() + 120);

  const { seconds, minutes, start, restart } = useTimer({ expiryTimestamp: time, onExpire: () => setTimerEnd(true) });

  useEffect(() => {
    setApplyAuth(authSuccess);
    start();
  }, [authSuccess]);

  const resetHandler = () => {
    reset();
    authReset();
    setApplyAuth(false);
    restart(time);
    setTimerEnd(false);
  };

  return (
    <div tw='flex flex-col'>
      <div tw='bg-secondary p-5 space-y-4'>
        <Input2
          label='Номер моб. телефона'
          name='mobile_phone'
          type='tel'
          control={control}
          rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
          mask='+7 999 999 99 99'
          placeholder='+7 (---) --- -- --'
        />
        <ReCAPTCHA sitekey={import.meta.env.AC_RECAPTCHA_SECRET_KEY} onChange={handleCheckRobot} />
        {applyAuth && (
          <>
            <OtpInput
              control={control}
              name='code'
              label='Введите код из SMS'
              shouldAutoFocus={applyAuth}
              rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            />
            <div tw='mt-3'>
              {timerEnd ? (
                <Button variant='link' onClick={resetHandler}>
                  Переотправить код
                </Button>
              ) : (
                <SubBody
                  text={`Переотправить код через: ${minutes < 10 ? '0' + minutes : minutes}:${
                    seconds < 10 ? '0' + seconds : seconds
                  }`}
                />
              )}
            </div>
          </>
        )}
      </div>

      <div tw='bg-secondary p-5 sm:rounded-b-2xl mt-3'>
        <Button
          variant='secondary'
          onClick={verifySubmit}
          disabled={phone?.length !== 12 && recaptchaValue}
          loading={loading}
        >
          {authSuccess ? 'Отправить SMS-код' : 'Получить SMS-код'}
        </Button>
      </div>
    </div>
  );
};
export default LoginContent;
