import 'twin.macro';

import React, { useContext, useEffect, useState } from 'react';

import { BodyText, Button } from '@/components';
import { ThemeContext } from '@/contexts/theme-context';

const biometryConditions = [
  '1. Что Ваше лицо полностью помещается в рамку на экране предпросмотра',
  '2. Что помещение не слишком темное и сзади Вас нет источника света',
  '3. Что на Вас нет солнечных очков и маски',
  '4. Что телефон расположен на расстоянии 20-100 см от Вашего лица',
  '5. Что камера направлена только на Ваше лицо'
];

const BiometryBackdropContent = ({ fetchBiometry, forensics, disabled }) => {
  const { theme } = useContext(ThemeContext);
  const [isDisabled, setDisabled] = useState(false);

  // useEffect(() => {
  //   let timer;
  //   if (isDisabled) {
  //     timer = setTimeout(() => {
  //       setDisabled(false);
  //     }, 6000);
  //   }
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isDisabled]);

  useEffect(() => {
    if (disabled) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [disabled]);

  const openBiometryPage = () => {
    if (forensics) {
      forensics();
    } else {
      setDisabled(true);
      window.open(`${fetchBiometry}&theme=${theme === 'dark' ? 'freedom_dark' : 'freedom_light'}`, '_self');
    }
  };

  return (
    <>
      <div className='mt-[40px] sm:mt-0 sm:bg-primary sm:p-5'>
        <div className='mb-[16px]'>
          <BodyText text='Убедитесь, что:' variant='bold' />
        </div>
        {biometryConditions.map((condition, i) => (
          <div key={i} className='mb-[16px]'>
            <BodyText text={condition} />
          </div>
        ))}
      </div>
      <div className='mt-[24px] text-center w-[100%] sm:p-5'>
        <Button type='button' variant='secondary' onClick={openBiometryPage} loading={isDisabled}>
          Начать
        </Button>
      </div>
    </>
  );
};

export default BiometryBackdropContent;
