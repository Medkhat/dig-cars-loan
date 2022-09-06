import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

import { Button, Checkbox, ContainerBlock } from '@/components';
import { useCoBorrowerAgrSendOtpMutation } from '@/features/api/co-borrower-';
import { vehicleParams } from '@/features/api/credits';
import { getFlowUuid, getVehicleParams } from '@/features/application/selectors';
import { setCoborrowerUuid } from '@/features/application/slice';
import { isAuthSelector } from '@/features/auth/selectors';
import { authCoborrower } from '@/features/auth/tasks';
import { getFullName } from '@/features/user/selectors';
import CoborrowerRejectCreditBlock from '@/views/coborrower-reject-credit-block';
import SellerInfoBlock from '@/views/seller-info-block';

const CoborrowerMainPAge = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const uuid = useSelector(getFlowUuid);
  const isAuth = useSelector(isAuthSelector);
  const fullName = useSelector(getFullName);
  const vehicleParamsData = useSelector(getVehicleParams);

  console.log('FULL+NAME: ', fullName);

  const schema = yup
    .object({
      personal_data: yup.bool().oneOf([true], 'Это поле обязательное'),
      foreigner: yup.bool().oneOf([true], 'Это поле обязательное'),
      fatca: yup.bool().oneOf([true], 'Это поле обязательное'),
      ffb: yup.bool().oneOf([true], 'Это поле обязательное'),
      vehicle_assesment: yup.bool().oneOf([true], 'Это поле обязательное')
    })
    .required('Это поле обязательное');

  const [fetchSendOtp, { isLoading, isSuccess }] = useCoBorrowerAgrSendOtpMutation();

  useEffect(() => {
    const token = searchParams.get('token');
    const coborrowerUuid = searchParams.get('flow_uuid');
    if (token && coborrowerUuid) {
      dispatch(setCoborrowerUuid(coborrowerUuid));
      dispatch(authCoborrower(token));
    } else {
      navigate('/404');
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (uuid && isAuth) {
      dispatch(vehicleParams.endpoints.vehicleParams.initiate({ flow_uuid: uuid }));
    }
  }, [uuid, isAuth]);

  useEffect(() => {
    isSuccess && navigate('/coborrower/verify');
  }, [isSuccess]);

  const {
    handleSubmit,
    control,
    watch,
    formState: { isValid }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      personal_data: true,
      foreigner: true,
      fatca: true,
      ffb: true,
      vehicle_assesment: true
    }
  });

  const onSubmit = data => {
    fetchSendOtp({ uuid: uuid });
  };

  return (
    <div className='seller-confirmation-page'>
      <div className='p-5'>
        <SellerInfoBlock fullName={fullName} borrower={vehicleParamsData?.person_borrower || {}} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ContainerBlock title='Условия соглашения'>
          <div className='flex flex-col space-y-4'>
            <Checkbox
              name='personal_data'
              control={control}
              label='Я соглашаюсь на сбор и обработку'
              link={{
                text: 'Персональных данных',
                href: 'https://auto.bankffin.kz/api/v1/print-forms/borrower-agreement/'
              }}
              rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            />
            <Checkbox
              name='foreigner'
              control={control}
              label='Я не являюсь иностранным публичным должностным лицом'
              rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            />
            <Checkbox
              name='fatca'
              control={control}
              label='Я подтверждаю отсутствие у меня признаков принадлежности к FATCA'
              rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            />
            <Checkbox
              name='ffb'
              control={control}
              label='Я соглашаюсь на открытие счета в FFB'
              rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            />
          </div>
        </ContainerBlock>
        <div className='text-center px-5 mt-3 sm:px-0 sm:flex sm:flex-row-reverse'>
          <Button tw='flex-auto' type='submit' variant='primary' disabled={!isValid} loading={isLoading}>
            Отправить
          </Button>
          <CoborrowerRejectCreditBlock flowUuid={uuid} />
        </div>
      </form>
    </div>
  );
};

export default CoborrowerMainPAge;
