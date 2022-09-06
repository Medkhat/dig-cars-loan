import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import { SubBody, Title } from '@/components';
import CarLoader from '@/components/loader';

const BiometryProcess = ({ setStep, flow }) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        const random = Math.random() * (5 - 3) + 3;
        setProgress(val => {
          const sum = val + random;

          if (sum >= 100) {
            return 100;
          }

          return sum;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
      navigate('/finalize2');
      /* if (flow === 'main-flow') {
        navigate('/application-loan');
      } else if (flow === 'sign-doc') {
        navigate('/finalize2');
      } else {
        setStep(4);
      }*/
    }
  }, [progress]);

  return (
    <div className='flex flex-col items-center justify-center mt-[120px]'>
      <div className='text-center'>
        <SubBody twStyle={tw`text-secondary`} text='Пожалуйста подождите' />
        <Title text='Идет процесс проверки' variant='bold' />
      </div>
      <div className='w-[100%] px-[20px] mt-[65px]'>
        <CarLoader progress={progress} />
      </div>
      <div>
        <Title text={`${Number(progress).toFixed(0)}%`} twStyle={tw`text-green text-[30px] mt-[25px]`} variant='bold' />
      </div>
    </div>
  );
};
export default BiometryProcess;
