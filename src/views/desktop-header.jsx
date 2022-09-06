import 'twin.macro';

import React from 'react';

import { landingURL } from '@/app/API-Url';
import Logo from '@/assets/images/Logo';
import ThemeToggle from '@/views/theme-toggle';

const lang = [
  { value: 'rus', title: 'Рус' },
  { value: 'kaz', title: 'Каз' }
];

const DesktopHeader = ({ flow, isCarHistory }) => {
  const redirect = () => {
    console.log(isCarHistory);
    if (isCarHistory) {
      window.open(landingURL);
    }
  };
  return (
    <>
      <Logo tw='flex-1' onClick={redirect} />
      <ThemeToggle />
      {/* <Divider />
       <Selector
        defaultActiveItem={lang[0].value}
        type='lang'
        items={lang}
        getActiveItem={value => {
          console.log(value);
        }}
        small
      /> */}
      {flow === 'main' && <Divider />}
    </>
  );
};

export default DesktopHeader;

const Divider = () => {
  return <div tw='w-px bg-white-alpha h-[34px] text-transparent'>.</div>;
};
