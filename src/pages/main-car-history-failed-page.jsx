import React from 'react';
import Div100vh from 'react-div-100vh';
import tw from 'twin.macro';

import ErrorIcon from '@/assets/images/errorIcon.svg';
import { Button, Caption, SubTitle } from '@/components';

function MainCarHistoryFailedPage() {
  return (
    <div>
      <Div100vh tw='flex flex-col items-center justify-center w-full'>
        <img src={ErrorIcon} alt='' />
        <SubTitle text='Не удалось загрузить данные' twStyle={tw`mt-3 text-s24 font-bold`} />
        <Caption
          text='Проверьте интернет подключение, и попробуйте загрузить снова'
          twStyle={tw`text-dark-grey text-s14 text-center w-[70%] leading-s22 mt-3`}
        />

        <Button variant='shadow' twStyle={tw`w-[90%] rounded-s20 mt-4`}>
          Попробовать снова
        </Button>
      </Div100vh>
    </div>
  );
}

export default MainCarHistoryFailedPage;
