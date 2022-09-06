import 'twin.macro';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import Wrapper from '@/components/wrapper';
import { useCreditsStatusQuery } from '@/features/api/credits';
import { getCurrentRoute, getFlowUuid } from '@/features/application/selectors';
import { isAuthSelector } from '@/features/auth/selectors';
import { MainHeader } from '@/views/main-header';

const MainPresentLayout = ({ flow, currentStep }) => {
  /* console.log(flow);
  console.log(currentStep);*/
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const flowUuid = useSelector(getFlowUuid);
  const currentRoute = useSelector(getCurrentRoute);
  const isAuth = useSelector(isAuthSelector);
  /* console.log(flow);
  console.log(currentStep);*/

  useCreditsStatusQuery(null, { skip: !isAuth });

  /* useEffect(() => {
    flowUuid && dispatch(getApplyStatus({ uuid: flowUuid }));

    //currentRoute && navigate(currentRoute);
  }, [flowUuid]);*/

  useEffect(() => {
    if (isAuth && currentRoute) {
      console.log(currentRoute);
      navigate(currentRoute);
    }
  }, [currentRoute, isAuth]);

  return (
    <div tw='flex flex-col pb-20 h-full'>
      <MainHeader flow={flow} currentStep={currentStep} />
      <Wrapper twStyles={tw`px-0 sm:px-5 flex-1`}>
        <div tw='flex sm:flex-col md:flex-row h-full justify-between md:space-x-5 w-full md:pt-6'>
          <Outlet />
        </div>
      </Wrapper>
    </div>
  );
};

export { MainPresentLayout };
