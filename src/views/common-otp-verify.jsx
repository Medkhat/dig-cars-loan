import React from 'react';
import CurrencyFormat from 'react-currency-format';
import tw from 'twin.macro';

import { BodyText, Button, OtpInput } from '@/components';
import Timer from '@/components/timer';

const OtpVerify = ({
  phone,
  isValid,
  loading,
  handleSubmit,
  handleVerify,
  control,
  initialMinutes = 0,
  initialSeconds = 59,
  showChangePhone = true,
  changeNumber = () => {},
  resendOtp = () => {},
  timerVariant = 'otp-verify',
  label = 'На ваш моб. номер выслан код',
  otpLabel = 'Введите код из SMS',
  showButton = true,
  numInputs
}) => {
  return (
    <form onSubmit={handleSubmit(handleVerify)}>
      <div className='bg-secondary p-5 sm:rounded-2xl'>
        <div>
          <BodyText text={label} variant='bold' />
          <div className='my-3 flex flex-col space-y-[5x]'>
            <BodyText text='Код отправлен на номер' twStyle={tw`text-dark text-s14`} />
            <CurrencyFormat
              value={phone}
              displayType={'text'}
              format='+# (###) ### ## ##'
              tw='font-bold text-s14 my-2 block'
            />
            {showChangePhone && (
              <div tw='pb-3'>
                <Button variant='link' onClick={changeNumber}>
                  Изменить номер
                </Button>
                {/*<SubTitle text='Изменить номер' variant='bold' twStyle={tw`text-green text-s14 cursor-pointer`} />*/}
              </div>
            )}
          </div>
        </div>
        <div>
          <OtpInput
            label={otpLabel}
            control={control}
            name='code'
            numInputs={numInputs}
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
          />
        </div>
        <Timer
          initialMinutes={initialMinutes}
          initialSeconds={initialSeconds}
          resendOtp={resendOtp}
          variant={timerVariant}
        />
      </div>
      {showButton && (
        <div className='w-full my-5 sm:p-0 fixed sm:static bottom-5 text-center sm:text-right'>
          <Button
            variant='primary'
            type='submit'
            caption='Пройти видеоидентификацию'
            disabled={!isValid}
            loading={loading}
          >
            Продолжить
          </Button>
        </div>
      )}
    </form>
  );
};
export default OtpVerify;
