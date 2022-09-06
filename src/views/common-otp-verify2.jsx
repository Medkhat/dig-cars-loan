import React from 'react';
import CurrencyFormat from 'react-currency-format';
import tw from 'twin.macro';

import { BodyText, Button, Input2 } from '@/components';
import Timer from '@/components/timer';

const OtpVerify2 = ({
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
          <Input2
            label={otpLabel}
            mask='999 999'
            name='code'
            control={control}
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            errorStyle={tw`sm:absolute sm:bottom-[-16px ]`}
            disabled={loading}
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
          <Button variant='ghost' type='submit' disabled={!isValid} loading={loading}>
            Отправить код
          </Button>
        </div>
      )}
    </form>
  );
};
export default OtpVerify2;
