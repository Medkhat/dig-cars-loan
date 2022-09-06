import 'twin.macro';

import React from 'react';
import Div100vh from 'react-div-100vh';
import { Outlet } from 'react-router-dom';
import tw from 'twin.macro';

import Wrapper from '@/components/wrapper';
import { ContactsInfo } from '@/views/contacts-info';
import { MainHeader } from '@/views/main-header';
import { SellerSteps } from '@/views/seller-steps';

const SellerFlowLayout = ({ flow, currentStep }) => {
  console.log(currentStep);
  return (
    <Div100vh tw='flex flex-col pb-20 h-full'>
      <MainHeader flow={flow} currentStep={currentStep} />
      <Wrapper twStyles={tw`px-0 sm:px-5 flex-1`}>
        <div tw='flex sm:flex-col md:flex-row h-full justify-between md:space-x-5 w-full'>
          <div tw='hidden sm:flex sm:justify-between md:justify-start md:flex-col md:w-[307px] md:divide-white-alpha md:divide-y'>
            {<SellerSteps currentStep={currentStep} />}
            <ContactsInfo />
          </div>
          <div tw='flex-1 flex flex-col max-w-full md:max-w-content md:pt-6'>
            <Outlet />
          </div>
        </div>
      </Wrapper>
    </Div100vh>
  );
};

export { SellerFlowLayout };
