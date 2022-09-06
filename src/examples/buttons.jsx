import 'twin.macro';

import React, { useCallback } from 'react';

import BiArrowRightShort from '@/assets/images/icons/BiArrowRightShort';
import BiCircleFill from '@/assets/images/icons/BiCircleFill';
import DownloadIcon from '@/assets/images/icons/DownloadIcon';
import FileEarmarkFill from '@/assets/images/icons/FileEarmarkFill';
import { Button, IconButton, LongButton, Selector } from '@/components';

const selectorItems = [
  { value: 'annuity', title: 'Аннуитет' },
  { value: 'equal', title: 'Равными долями' }
];

const selectorItems2 = [
  { value: '2', title: '2', subItem: 'года' },
  { value: '3', title: '3', subItem: 'года' },
  { value: '4', title: '4', subItem: 'лет' },
  { value: '5', title: '5', subItem: 'лет' },
  { value: '6', title: '6', subItem: 'лет' }
];

const Buttons = () => {
  const getActiveItem = useCallback(({ activeItem }) => {
    console.log(activeItem);
  }, []);

  return (
    <div tw='w-3/4 flex flex-col space-y-2 items-center'>
      <Selector items={selectorItems} getActiveItem={getActiveItem} />
      <Selector items={selectorItems2} getActiveItem={getActiveItem} small />
      <IconButton onClick={() => {}}>
        <BiArrowRightShort />
      </IconButton>
      <LongButton prefix={<FileEarmarkFill tw='text-xl' />} suffix={<DownloadIcon />}>
        Открытие текущего счета
      </LongButton>
      <Button variant='primary' caption='Subtitle для того чтобы продолжить kkkkkkkkkk'>
        Продолжить
      </Button>
      <Button variant='ghost' icon={<BiCircleFill />}>
        Отправить SMS
      </Button>
      <Button variant='secondary' icon={<BiCircleFill />}>
        Начать для того чтобы
      </Button>
      <Button variant='text' icon={<BiCircleFill />}>
        Начать для того чтобы
      </Button>
      <Button variant='link' icon={<BiCircleFill />}>
        Начать для того чтобы
      </Button>
    </div>
  );
};

export { Buttons };
