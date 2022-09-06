import 'twin.macro';

import QRCode from 'qrcode.react';
import React from 'react';
import tw from 'twin.macro';

import { BodyText, Caption } from '@/components';

const conditions = [
  'откройте камеру на вашем смартфоне',
  'наведите на QR код',
  'перейдите на предложенный сайт',
  'пройдите видеоидентификацию личности'
];

const QrCodeBlock = ({ url = 'https://bankffin.kz/', loading = false }) => {
  return (
    <div tw='w-full flex justify-between rounded-2xl pt-5 hidden sm:flex bg-wrapper p-7'>
      <div tw='pr-3'>
        <QRCode value={url} includeMargin bgColor='white' level='L' size={150} />
      </div>
      <div tw='mt-[-8px]'>
        <Caption text='Если у вас нет камеры на текущем устройстве' variant='bold' twStyle={tw`text-s16 mt-1`} />
        <div className='flex flex-col mt-3'>
          {conditions?.map((condition, i) => (
            <BodyText key={i} text={`• ${condition}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default QrCodeBlock;
