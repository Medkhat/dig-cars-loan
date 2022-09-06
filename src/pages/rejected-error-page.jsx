import React from 'react';
import Div100vh from 'react-div-100vh';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PURGE } from 'redux-persist';
import tw from 'twin.macro';

import img500 from '@/assets/images/img500.svg';
import { BigTitle, Button, Caption } from '@/components';
import Wrapper from '@/components/wrapper';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { getFullName } from '@/features/user/selectors';

const RejectedErrorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentStep = useSelector(getCurrentStep);
  const stepInfo = useSelector(getStepByName(currentStep));
  const fullName = useSelector(getFullName);

  const goToMainPage = () => {
    dispatch({ type: PURGE, result: () => null });
    window.open(import.meta.env.DEV ? import.meta.env.AC_DEV_LANDING : import.meta.env.AC_PROD_LANDING, '_self');
  };

  return (
    <Div100vh>
      <Wrapper twStyles={tw`min-h-screen flex flex-col justify-center items-center -translate-y-20 pt-[100px] sm:pt-0`}>
        <img src={img500} alt='500' tw='mb-0 sm:mb-16' />
        <div tw='flex flex-col justify-center items-center space-y-2 text-center mt-5 mb-14'>
          <BigTitle text={fullName} />
          <Caption
            text={stepInfo?.status_reason}
            twStyle={tw`text-secondary lg:max-w-[512px] text-center text-s14 leading-7`}
          />
        </div>
        <div>
          <Button variant='shadow' twStyle={tw`w-[350px]`} onClick={goToMainPage}>
            Вернуться на главную
          </Button>
        </div>
      </Wrapper>
    </Div100vh>
  );
};

export default RejectedErrorPage;
