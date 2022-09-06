import 'twin.macro';

import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import tw from 'twin.macro';

import Wrapper from '@/components/wrapper';
import { getAppLoading } from '@/features/auth/selectors';
import { ContactsInfo } from '@/views/contacts-info';
import Loader from '@/views/loader';
import { MainHeader } from '@/views/main-header';
import { StepsBlock } from '@/views/steps-block';

const MainFlowLayout = ({ flow, currentStep }) => {
  /* console.log(flow);
  console.log(currentStep);*/

  const isAppLoading = useSelector(getAppLoading);
  /* console.log(flow);
  console.log(currentStep);*/

  //useCreditsStatusQuery(null, { skip: !isAuth });

  /*  useEffect(() => {
    dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: '576f5e36-1d90-465b-9003-412feb06e52d' }));
  }, []);*/

  /* useEffect(() => {
    //flowUuid && dispatch(getApplyStatus({ uuid: flowUuid }));
    //currentRoute && navigate(currentRoute);
  }, [flowUuid]);*/

  /*  useEffect(() => {
    if (isAuth && currentRoute) {
      console.log(currentRoute);
      navigate(currentRoute);
    }
  }, [currentRoute, isAuth]);*/

  return (
    <div tw='flex flex-col pb-20 h-full'>
      <MainHeader flow={flow} currentStep={currentStep} />
      <Wrapper twStyles={tw`px-0 sm:px-5 flex-1`}>
        <div tw='flex sm:flex-col md:flex-row h-full justify-between md:space-x-5 w-full md:pt-6'>
          <div tw='hidden sm:flex sm:justify-between md:justify-start md:flex-col md:w-[307px] md:divide-white-alpha md:divide-y'>
            <StepsBlock />
            <ContactsInfo />
          </div>
          <div tw='flex-1 flex flex-col max-w-full md:max-w-content overflow-hidden'>
            {isAppLoading ? <Loader /> : <Outlet />}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export { MainFlowLayout };
