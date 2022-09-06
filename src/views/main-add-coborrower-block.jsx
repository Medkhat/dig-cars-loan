import { yupResolver } from '@hookform/resolvers/yup';
import { any } from 'ramda';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdate } from 'react-use';
import tw from 'twin.macro';
import * as yup from 'yup';

import { BodyText, Button, ContainerBlock, Input2, SubBody } from '@/components';
import { useApplyMainCoborrowerLinkMutation, useApplyMainDeleteCoBorrowerMutation } from '@/features/api/apply-main';
import { coborrowerStatuses, scoreStatuses } from '@/helper/constants';

const AddCoborrowerBlock = ({ co_borrower, step, refetch, score_status, block }) => {
  const update = useUpdate();

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

  const [fetchCoborrowerLinkSend, { isSuccess: coborrowerLinkSuccess, isLoading: coborrowerLinkLoading }] =
    useApplyMainCoborrowerLinkMutation();

  const [deleteCoBorrower, { isSuccess: coborrowerDeleteSuccess, isLoading: coborrowerDeleteLoading }] =
    useApplyMainDeleteCoBorrowerMutation();

  useEffect(() => {
    coborrowerLinkSuccess && refetch();
  }, [coborrowerLinkSuccess]);

  useEffect(() => {
    if (coborrowerDeleteSuccess) {
      refetch();
      update();
      reset({ iin: '', mobile_phone: '' });
    }
  }, [coborrowerDeleteSuccess]);

  useEffect(() => {
    if (co_borrower?.iin) {
      setValue('iin', co_borrower?.iin);
      setValue('mobile_phone', co_borrower?.mobile_phone);
    }
  }, [co_borrower]);

  console.log('step: ', step);
  const onSubmit = data => {
    console.log('on submit', data);
    fetchCoborrowerLinkSend({
      step: step.step,
      stepUuid: step.step_uuid,
      mobile_phone: '+' + data.mobile_phone,
      iin: data.iin
    });
  };

  const deleteCoborrower = e => {
    e.preventDefault();
    deleteCoBorrower({ stepUuid: step.step_uuid });
  };

  return (
    <ContainerBlock title='Добавление созаемщика'>
      <div tw='flex flex-col space-y-4'>
        <SubBody
          text='Предупредите созаемщика, что ему придет SMS со ссылкой на подтверждение личнных данных и согласие быть Вашим созаемщиком. Ссылка активна 24 часа.'
          twStyle={tw`text-secondary`}
        />
      </div>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div tw='flex flex-col'>
          <div tw='flex flex-col sm:flex-row space-y-[5px] space-y-4  sm:space-y-0 sm:space-x-4 mb-4'>
            <div tw='w-full sm:w-1/2'>
              <Input2
                label='ИИН'
                inputMode='numeric'
                mask='999999999999'
                name='iin'
                placeholder='Введите ИИН созаемщика'
                disabled={
                  block ||
                  any(
                    item => item === co_borrower?.status,
                    [
                      coborrowerStatuses.DONE,
                      coborrowerStatuses.DELETING,
                      coborrowerStatuses.DECLINED,
                      coborrowerStatuses.IN_PROGRESS
                    ]
                  )
                }
                control={control}
                rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                errorStyle={tw`sm:absolute sm:bottom-[-16px ]`}
              />
            </div>
            <div tw='w-full sm:w-1/2 relative bottom-[1px]'>
              <Input2
                label='Номер моб.телефона'
                inputMode='numeric'
                mask='+7 999 999 99 99'
                name='mobile_phone'
                placeholder='+7 (---) --- -- --'
                disabled={
                  block ||
                  any(
                    item => item === co_borrower?.status,
                    [
                      coborrowerStatuses.DONE,
                      coborrowerStatuses.DELETING,
                      coborrowerStatuses.DECLINED,
                      coborrowerStatuses.IN_PROGRESS
                    ]
                  )
                }
                control={control}
                rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                errorStyle={tw`sm:absolute sm:bottom-[-16px ]`}
              />
            </div>
          </div>
          {co_borrower?.status !== coborrowerStatuses.DELETING && (
            <div>
              {co_borrower?.iin && (
                <Button variant='link' onClick={deleteCoborrower} loading={coborrowerDeleteLoading}>
                  Удалить созаемщика
                </Button>
              )}
              {co_borrower?.status === coborrowerStatuses.IN_PROGRESS && (
                <div className='flex flex-col space-y-2 my-3'>
                  <BodyText text='SMS отправлен' variant='bold' />
                  <SubBody text='Ожидаем подтверждения созаемщика' twStyle={tw`text-secondary`} />
                </div>
              )}
            </div>
          )}
          {co_borrower?.status === coborrowerStatuses.DONE &&
            (score_status === scoreStatuses.APPROVED || score_status === scoreStatuses.CONTINUE) && (
              <div className='flex flex-col my-4 space-y-4'>
                <BodyText text='Созаемщик подтвердил личность' variant='bold' />
                <SubBody text='Теперь вы можете продолжить оформление' twStyle={tw`text-secondary`} />
              </div>
            )}
          {co_borrower?.status === coborrowerStatuses.DONE && score_status === scoreStatuses.PARTIAL_APPROVE && (
            <div className='flex flex-col my-4 space-y-4'>
              <BodyText text='Созаемщик подтвердил личность' variant='bold' />
              <SubBody
                text='К сожалению, созаемщик не прошел проверку Банком. Пожалуйста, добавьте другого созаемщика или загрузите выписку о дополнительных доходах'
                twStyle={tw`text-secondary`}
              />
            </div>
          )}
          {co_borrower?.status === coborrowerStatuses.DECLINED && (
            <div tw='my-3'>
              <SubBody
                text='К сожалению, созаемщик не прошел проверку Банком. Пожалуйста, добавьте другого созаемщика'
                twStyle={tw`text-error`}
              />
            </div>
          )}
          {co_borrower?.status === coborrowerStatuses.DELETING && (
            <div tw='my-3'>
              <SubBody text='Происходит удаление созаемщика' twStyle={tw`text-error`} />
            </div>
          )}
          <div tw='w-full text-center'>
            <Button
              variant='ghost'
              type='submit'
              disabled={
                block ||
                any(
                  item => item === co_borrower?.status,
                  [coborrowerStatuses.DONE, coborrowerStatuses.IN_PROGRESS, coborrowerStatuses.DECLINED]
                )
              }
              loading={coborrowerLinkLoading || co_borrower?.status === coborrowerStatuses.DELETING}
            >
              Отправить SMS
            </Button>
          </div>
        </div>
      </form>
    </ContainerBlock>
  );
};

export default AddCoborrowerBlock;
