import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';

import { BigTitle, BodyText, SubBody } from '.';

const Timer2 = ({ initialSeconds, initialMinutes, resendOtp, variant = 'big' }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [minutes, setMinutes] = useState(initialMinutes);

  const handleResendOtp = () => {
    resendOtp();
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
  };

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          if (variant === 'small') {
            setMinutes(initialMinutes);
            setSeconds(initialSeconds);
          }

          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [minutes, seconds]);

  return (
    <>
      {variant === 'big' && (
        <div>
          {variant === 'big' && (
            <BigTitle text={`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`} twStyle={tw`pl-1`} />
          )}
        </div>
      )}
      {variant === 'small' && (
        <SubBody text={`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`} twStyle={tw`text-green font-bold`} />
      )}
    </>
  );
};

export { Timer2 };

const Timer = ({ initialSeconds, initialMinutes, resendOtp, variant = 'otp-verify' }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [minutes, setMinutes] = useState(initialMinutes);

  const handleResendOtp = () => {
    resendOtp();
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
  };

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [minutes, seconds]);

  return (
    <div className='mt-3'>
      {variant === 'otp-verify' && minutes === 0 && seconds === 0 ? (
        <div onClick={handleResendOtp} onKeyDown={handleResendOtp} aria-hidden='true'>
          <BodyText
            text='Переотправить код'
            twStyle={tw`text-secondary cursor-pointer text-s14 text-green`}
            variant='bold'
          />
        </div>
      ) : (
        <p>
          <BodyText text='Переотправить код через: ' twStyle={tw`text-secondary text-s14`} />
          <BodyText variant='bold' text={`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`} twStyle={tw`pl-1`} />
        </p>
      )}
    </div>
  );
};

export default Timer;
