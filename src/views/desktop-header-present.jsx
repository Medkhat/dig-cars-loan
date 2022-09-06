import 'twin.macro';

import React from 'react';
import tw from 'twin.macro';

import Logo from '@/assets/images/Logo';
import { Selector, SubBody } from '@/components';
import ThemeToggle from '@/views/theme-toggle';

const lang = [
  { value: 'rus', title: 'Рус' },
  { value: 'kaz', title: 'Каз' }
];

const DesktopHeaderPresent = () => {
  return (
    <>
      <Logo tw='flex-1' />
      <div tw='flex space-x-10'>
        <SubBody text='Главная' twStyle={tw`text-secondary`} />
        <SubBody text='Калькулятор' twStyle={tw`text-secondary`} />
      </div>
      <ThemeToggle />
      <Divider />
      <Selector
        defaultActiveItem={lang[0].value}
        type='lang'
        items={lang}
        getActiveItem={value => {
          console.log(value);
        }}
        small
      />
    </>
  );
};

export default DesktopHeaderPresent;

const Divider = () => {
  return <div tw='w-px bg-white-alpha h-[34px] text-transparent'>.</div>;
};
