import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdate } from 'react-use';
import tw from 'twin.macro';
import * as yup from 'yup';

import { BodyText, Button, ContainerBlock, Input2, SubBody } from '@/components';
import { useApplySellerLinkMutation } from '@/features/api/apply-main';
import { getSellerData } from '@/features/application/selectors';
import { resetSellerData } from '@/features/application/slice';
import { getStepByName } from '@/features/status/selectors';
import { resetStatus } from '@/features/status/slice';
import { flowStatuses, flowSteps, stepStatuses } from '@/helper/constants';

const AddSellerBlock = ({ flowUuid, step, sellerDataFromVehicleParams }) => {
  const update = useUpdate();
  const dispatch = useDispatch();

  const sellerLinkData = useSelector(getStepByName(flowSteps.SELLER_SCORE_AGREEMENT));
  const openBorrowerAccountData = useSelector(getStepByName(flowSteps.OPEN_BORROWER_ACCOUNT));
  const sellerData = useSelector(getSellerData);

  const schema = yup
    .object({
      iin: yup.string().min(12, 'ИИН должен содержать 12 цифр').required('Это поле обязательное'),
      mobile_phone: yup.string().min(11, 'Введите полностью свой номер телефона').required()
    })
    .required();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      iin: '',
      mobile_phone: ''
    }
  });

  useEffect(() => {
    if (sellerDataFromVehicleParams?.iin) {
      setValue('iin', sellerDataFromVehicleParams?.iin);
      setValue('mobile_phone', sellerDataFromVehicleParams?.mobile_phone);
    }
  }, [sellerDataFromVehicleParams, setValue]);

  const [fetchSellerLinkSend, { isLoading: sellerLinkLoading }] = useApplySellerLinkMutation();

  useEffect(() => {
    if (sellerData?.iin) {
      setValue('iin', sellerData?.iin);
      setValue('mobile_phone', sellerData?.mobile_phone);
    }
  }, [sellerData, setValue]);

  const onSubmit = data => {
    console.log('on submit', data);
    fetchSellerLinkSend({
      step: sellerLinkData.step,
      uuid: flowUuid,
      mobile_phone: data.mobile_phone,
      iin: data.iin
    });
  };

  const changeSellerData = e => {
    e.preventDefault();
    dispatch(resetSellerData());
    dispatch(resetStatus({ step: sellerLinkData.step, flow_type: sellerLinkData?.flow_type }));
    update();
    reset();
  };
  console.log('sellerLinkData: ', sellerLinkData);

  return (
    <ContainerBlock title='Данные продавца'>
      <SubBody
        text='Предупредите продавца, что ему придет SMS со ссылкой для подтверждения личности и права собственности на авто'
        twStyle={tw`text-secondary`}
      />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col sm:flex-row sm:space-x-4'>
          <Input2
            label='ИИН'
            inputMode='numeric'
            mask='999999999999'
            name='iin'
            type='tel'
            placeholder='Введите ИИН продавца'
            disabled={
              step.step !== flowSteps.SELLER_SCORE_AGREEMENT ||
              sellerLinkData.is_loading ||
              sellerLinkData?.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT
            }
            control={control}
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
          />
          <Input2
            label='Номер моб. телефона'
            mask='+7 999 999 99 99'
            inputMode='numeric'
            name='mobile_phone'
            type='tel'
            placeholder='+7 (---) --- -- --'
            disabled={
              step.step !== flowSteps.SELLER_SCORE_AGREEMENT ||
              sellerLinkData.is_loading ||
              sellerLinkData?.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT
            }
            control={control}
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
          />
        </div>

        <div className='space-y-4 mt-4'>
          {sellerLinkData.status !== stepStatuses.INITIAL && (
            <Button variant='link' onClick={changeSellerData} disabled={step.step !== flowSteps.SELLER_SCORE_AGREEMENT}>
              Изменить данные
            </Button>
          )}
          {(sellerLinkData?.status === 'IN_PROGRESS' ||
            step.step === flowSteps.SELLER_SCORE ||
            (step.step === flowSteps.OPEN_BORROWER_ACCOUNT && step.is_loading) ||
            step.step === flowSteps.MANUAL_SELLER_SCORE) && (
            <div className='flex flex-col space-y-2'>
              <BodyText text='SMS отправлен' variant='bold' />
              <SubBody text='Ожидаем подтверждения продавца' twStyle={tw`text-secondary`} />
            </div>
          )}
        </div>
        {openBorrowerAccountData.is_final && sellerLinkData?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT && (
          <div className='flex flex-col mt-4 space-y-4'>
            <BodyText text='Продавец подтвердил личность' variant='bold' />
            <SubBody text='Теперь вы можете продолжить оформление' twStyle={tw`text-secondary`} />
          </div>
        )}
        {sellerLinkData?.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT && (
          <div tw='my-5'>
            <SubBody text={sellerLinkData?.status_reason} twStyle={tw`text-error`} />
          </div>
        )}
        <div className='w-full text-center mt-6'>
          <Button
            variant='ghost'
            type='submit'
            loading={sellerLinkLoading || sellerLinkData?.status === 'IN_PROGRESS'}
            disabled={
              step.step !== flowSteps.SELLER_SCORE_AGREEMENT ||
              sellerLinkData?.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT
            }
          >
            Отправить SMS
          </Button>
        </div>
      </form>
    </ContainerBlock>
  );
};

export default AddSellerBlock;
