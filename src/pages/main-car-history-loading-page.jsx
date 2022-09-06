import React from 'react';
import Div100vh from 'react-div-100vh';
import tw from 'twin.macro';

import { Caption, SubTitle } from '@/components';
import Loader from '@/views/loader';

function MainCarHistoryLoadingPage() {
  return (
    <div>
      <Div100vh tw='flex flex-col items-center justify-start w-full mt-20'>
        <Loader variant='middle' />
        <SubTitle text='Загрузка...' twStyle={tw`font-bold text-s24 mt-3`} />
        <Caption twStyle={tw`text-dark-grey text-s14 text-center mt-1`} text='Пожалуйста подождите'></Caption>
      </Div100vh>
    </div>
  );
}

export default MainCarHistoryLoadingPage;
