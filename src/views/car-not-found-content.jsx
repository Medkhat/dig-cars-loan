import 'twin.macro';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import ExclamationIcon from '@/assets/images/icons/ExclamationIcon';
import { Button, Select, SubBody } from '@/components';
import { useApplyMainVerifyCarMutation } from '@/features/api/apply-main';
import { getLeadUuid } from '@/features/application/selectors';

const brands = [{ value: 'toyota', label: 'Toyota' }];
const model = [{ value: 'camry', label: 'Camry' }];
const years = [{ value: '2020', label: '2020' }];

const CarNotFoundContent = ({ models, phone }) => {
  const navigate = useNavigate();
  const lead_uuid = useSelector(getLeadUuid);

  const { control, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      brand: '',
      model: '',
      year: ''
    }
  });

  const masterModels = models.map(item => ({ value: item, label: item }));

  const master_model = watch('model');

  const [fetchVerifyCar, { isSuccess, isLoading }] = useApplyMainVerifyCarMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate('/main/verify', { state: { phone } });
    }
  }, [navigate, isSuccess, phone]);

  const handleClick = () => {
    fetchVerifyCar({ lead_uuid, master_model });
  };

  return (
    <div tw='bg-primary rounded-b-2xl'>
      <div tw='mt-4 flex flex-col space-y-4 bg-secondary p-5'>
        <div tw='flex items-center bg-[#ffffff0f] p-5 rounded-2xl space-x-2'>
          <ExclamationIcon />
          <SubBody
            text={
              <span>
                Банк не смог определить модель приобретаемого авто. <br /> Пожалуйста выберите модель из списка.
              </span>
            }
            twStyle={tw`text-secondary`}
          />
        </div>
        {/* <Input
          name='brand'
          label='Марка'
          disabled
          control={control}
          rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
          placeholder='Выберите марку автомобиля'
        />
        <Input
          name='year'
          label='Год выпуска'
          disabled
          control={control}
          rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
          placeholder='Выберите год выпуска автомобиля'
        /> */}
        <Select
          name='model'
          label='Модель'
          control={control}
          rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
          options={masterModels}
          placeholder='Выберите модель автомобиля'
        />
      </div>

      <div tw='p-5 bg-secondary mt-4 sm:rounded-b-2xl'>
        <Button variant='secondary' onClick={handleClick} loading={isLoading}>
          Далее
        </Button>
      </div>
    </div>
  );
};
export default CarNotFoundContent;
