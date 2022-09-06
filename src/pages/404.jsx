import React from 'react';
import Div100vh from 'react-div-100vh';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import img404 from '@/assets/images/img404.svg';
import { BigTitle, Button, SubBody } from '@/components';
import Wrapper from '@/components/wrapper';

const Page404 = () => {
  const navigate = useNavigate();

  const goToMain = () => {
    window.open(import.meta.env.DEV ? import.meta.env.AC_DEV_LANDING : import.meta.env.AC_PROD_LANDING, '_self');
  };
  return (
    <Div100vh>
      <Wrapper twStyles={tw`h-screen flex flex-col justify-center items-center -translate-y-20 pt-7 sm:pt-0`}>
        <img src={img404} alt='404' tw='mb-0 sm:mb-16' />
        <BigTitle text={<span tw='block text-center mx-auto'>К сожалению, такой страницы нет</span>} />
        <div tw=' text-center mt-1 sm:mt-5'>
          <SubBody text={'Возможно в адресе есть ошибка или страница была удалена'} twStyle={tw`text-secondary`} />
        </div>
        <Button variant='ghost' twStyle={tw`max-w-button mt-14`} onClick={goToMain}>
          Вернуться на главную
        </Button>
      </Wrapper>
    </Div100vh>
  );
};

export default Page404;
