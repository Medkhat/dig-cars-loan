import React from 'react';
import tw from 'twin.macro';

import photocontrol from '@/assets/images/photocontrol.svg';
import { Button, SubBody, SubTitle } from '@/components';

const CommonPhotocontrol = ({
  title = 'Фотоконтроль транспортного средства',
  subtitle = 'Пришлите фотографии своего транспортного средства для проверки',
  verifyBiometry,
  loading = false
}) => {
  return (
    <div tw='flex flex-col space-y-4'>
      <div className='w-full flex flex-col space-y-6 bg-wrapper sm:rounded-2xl items-center p-8 text-center'>
        <div>
          <img src={photocontrol} alt='photo_control' />
        </div>
        <div tw='flex flex-col items-center'>
          <SubTitle text={title} variant='bold' />
          <SubBody text={subtitle} twStyle={tw`text-secondary mt-3 block`} />
          <SubBody
            text={'Важно: Фото необходимо сделать в альбомной ориентации.'}
            twStyle={tw`text-secondary mt-3 block`}
          />
        </div>
        <div className='w-full max-w-button mt-5'>
          <Button variant='primary' caption='Пройдите фотоконтроль' onClick={verifyBiometry} loading={loading}>
            Продолжить
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CommonPhotocontrol;
