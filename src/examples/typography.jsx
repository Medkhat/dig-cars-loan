import React from 'react';
import tw from 'twin.macro';

import { BigTitle, BodyText, Caption, SubBody, SubTitle, Title } from '@/components';

const Typography = () => {
  return (
    <>
      <BigTitle text='Title 1 Bold' />
      <Title text='Title 2 Bold' />
      <SubTitle text='Subtitle Bold' variant='bold' />
      <SubTitle text='Subtitle Regular' variant='regular' />
      <BodyText text='Body Text Bold' variant='bold' />
      <BodyText text='Body Text Regular' />
      <BodyText text='Body Text Regular2' twStyle={tw`leading-s26`} />
      <SubBody text='Subbody Bold' variant='bold' />
      <SubBody text='Subbody Regular' />
      <SubBody text='Subbody Regular 2' twStyle={tw`leading-s24`} />
      <Caption text='Caption Bold' variant='bold' />
      <Caption text='Caption Regular' />
      <Caption text='Caption Regular 2' twStyle={tw`leading-s18`} />
    </>
  );
};

export { Typography };
