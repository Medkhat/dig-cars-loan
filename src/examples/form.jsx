import 'twin.macro';

import React from 'react';
import { useForm } from 'react-hook-form';

import NumberPlate from '@/assets/images/NumberPlate';
import { Button, Checkbox, Input, InputFile, Radio, Select } from '@/components';

const options = [
  {
    label: 'Мужчина',
    value: 'male'
  },
  {
    label: 'Женщина',
    value: 'female'
  },
  {
    label: 'Другое',
    value: 'other'
  },
  {
    label: 'Тест',
    value: 'test'
  }
];

const radioOptions = [
  {
    value: 'pay1',
    title: 'Оплатить первоначальный взнос онлайн',
    subText: 'При оплате онлайн, процентная ставка снижается на 1%',
    sale: '1'
  },
  {
    value: 'pay2',
    title: 'Оплатить первоначальный взнос оффлайн',
    subText: 'В ближайшем отделении банка'
  }
];

const Form = () => {
  const { handleSubmit, control } = useForm({
    mode: 'onChange',
    defaultValues: {
      first: '',
      second: '',
      gender: '',
      accept: false,
      pay: '',
      file: ''
    }
  });
  const onSubmit = data => console.log('DATA: ', data);
  return (
    <div tw='w-full flex flex-col items-center space-y-2'>
      <form onSubmit={handleSubmit(onSubmit)} tw='w-full flex flex-col items-center space-y-2'>
        <Checkbox
          name='accept'
          control={control}
          label='Я соглашаюсь на сбор и обработку'
          link={{
            text: 'Персональных данных',
            href: 'https://auto.bankffin.kz/api/v1/print-forms/borrower-agreement/'
          }}
          rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
        />
        <Radio
          name='pay'
          control={control}
          options={radioOptions}
          rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
        />
        <Input
          name='first'
          label='FIRST 1'
          type='text'
          control={control}
          placeholder='Placeholder'
          icon={<NumberPlate />}
          affix='20%'
          rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
          mask={{
            mask: '000 aaa 00',
            prepare: function (str) {
              return str.toUpperCase();
            }
          }}
        />
        <Input
          name='second'
          label='SECOND 1'
          type='tel'
          control={control}
          placeholder='Placeholder2'
          rules={{ required: { value: true, message: 'Это поле не может быть пустым2' } }}
          mask={{
            mask: '+{7}(000)000-00-00'
          }}
        />
        <InputFile text='Загрузить документ' />
        <Select
          name='gender'
          control={control}
          rules={{ required: { value: true, message: 'Это поле не может быть пустым2' } }}
          options={options}
          placeholder='Выберите номер'
          icon={<NumberPlate />}
          subText='Sub text for select'
          label='Label text for select'
        />
        <Button type='submit' variant='text'>
          Отправитиь
        </Button>
      </form>
    </div>
  );
};

export { Form };
