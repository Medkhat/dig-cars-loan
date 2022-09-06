import React from 'react';
import tw from 'twin.macro';

import Logo from '@/assets/images/Logo';
import { Title } from '@/components';

const NoMatchPage = () => {
  return (
    <div tw='flex flex-col justify-center items-center space-y-4 h-screen'>
      <Logo />
      <Title text='Страница не найдена' variant='bold' twStyle={tw`text-green`} />
    </div>
  );
};

export { NoMatchPage };
