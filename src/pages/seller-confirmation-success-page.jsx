import React from 'react';
import tw from 'twin.macro';

import { Button } from '@/components';
import CommonSuccessBlock from '@/views/common-success-block';

const SellerConfirmationSuccessPage = () => {
  const goToBank = () => {
    window.open('https://bankffin.kz', '_self');
  };

  return (
    <CommonSuccessBlock
      title={
        <span>
          Процесс подтверждения <br /> успешной пройдена
        </span>
      }
      twStyle={tw`justify-center`}
    >
      <div className='w-full mt-5 text-center p-5'>
        <Button variant='ghost' onClick={goToBank}>
          Вернуться на сайт банка
        </Button>
      </div>
    </CommonSuccessBlock>
  );
};
export default SellerConfirmationSuccessPage;
