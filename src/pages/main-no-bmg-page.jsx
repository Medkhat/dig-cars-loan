import React from 'react';
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import ExclamationIcon from '@/assets/images/icons/ExclamationIcon';
import { Checkbox, InputFile, SubBody, SubTitle } from '@/components';

const MainNoBmgPage = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: { document: '' }
  });

  return (
    <div className='flex flex-col space-y-3 p-5'>
      <div className='flex flex-col space-y-2'>
        <SubTitle text='Цифровое удостоверение личности' variant='bold' />
        <SubBody
          text='Для предоставления временного доступа Банку к вашему цифровому удостоверению личности, пожалуйста, подтвердите согласие SMS-кодом с номера 1414.'
          twStyle={tw`text-secondary`}
        />
      </div>
      <div className='flex space-x-3 bg-secondary p-3 sm:rounded-2xl'>
        <div className='pt-1'>
          <ExclamationIcon />
        </div>
        <div>
          <SubBody
            text='Ваш текущий номер отличается от номера телефона в Базе мобильных граждан (БМГ). Мы можем заменить номер в БМГ на текущий номер, но для этого необходимо ваше согласие'
            twStyle={tw`text-secondary`}
          />
        </div>
      </div>
      <Checkbox
        control={control}
        name='personal_data'
        label='Я подтверждаю свое согласие на изменение номера телефона в базе мобильных граждан (БМГ)'
        rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
      />
      <div>
        <InputFile name='document' />
      </div>
    </div>
  );
};
export default MainNoBmgPage;
