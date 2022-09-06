import 'twin.macro';

import React from 'react';

import { BodyText, Button } from '@/components';

const biometryConditions = [
  '1. Что вы фотографируете в светлое время суток',
  '2. Что транспортное средство входит в кадр со всех сторон',
  '3. Что на фотографиях присутствует 2-3 метра свободного пространства с 4 сторон',
  '4. Что осветительные приборы выключены'
];

const PhotoControlBackdropContent = ({ startPhotocontrol }) => {
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
        <Button type='button' variant='secondary' onClick={startPhotocontrol}>
          Начать
        </Button>
      </div>
    </>
  );
};

export default PhotoControlBackdropContent;
