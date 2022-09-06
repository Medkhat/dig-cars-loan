import React, { useContext } from 'react';
import tw from 'twin.macro';

import faceDark from '@/assets/images/fr-anim-dark.gif';
import faceLight from '@/assets/images/fr-anim-light.gif';
import { Button, SubBody, SubTitle } from '@/components';
import { ThemeContext } from '@/contexts/theme-context';

import QrCodeBlock from './qr-code-block';

const CommonBiometry = ({
  title = 'Видеоидентификация личности',
  subtitle = 'Процесс выполняется на сайте Digital ID',
  verifyBiometry,
  biometryUrl = '',
  loading = false
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div tw='flex flex-col space-y-4'>
      <div className='w-full flex flex-col space-y-6 bg-wrapper sm:rounded-2xl items-center p-8 text-center'>
        <div>
          {theme === 'dark' ? <img src={faceDark} alt='face dark' /> : <img src={faceLight} alt='face light' />}
        </div>
        <div>
          <SubTitle text={title} variant='bold' />
          <SubBody text={subtitle} twStyle={tw`text-secondary mt-3 block`} />
        </div>
        <div className='w-full max-w-button mt-5'>
          <Button variant='primary' caption='Пройти видеоидентификацию' onClick={verifyBiometry}>
            Продолжить
          </Button>
        </div>
      </div>

      <QrCodeBlock url={biometryUrl} loading={!biometryUrl} />
    </div>
  );
};
export default CommonBiometry;
