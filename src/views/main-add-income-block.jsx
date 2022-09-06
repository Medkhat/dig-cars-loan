import { any } from 'ramda';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';

import DeleteIcon from '@/assets/images/icons/DeleteIcon';
import { BodyText, Button, Caption, ContainerBlock, InputFile, SubBody } from '@/components';
import {
  useApplyMainAddAdditionalIncomeMutation,
  useApplyMainDeleteAdditionalIncomeMutation
} from '@/features/api/apply-main';
import { getStepByName } from '@/features/status/selectors';
import { coborrowerStatuses, flowSteps, scoreStatuses } from '@/helper/constants';
import BanksBlock from '@/views/banks-block';

const AddIncomeBlock = ({ additional_income, step, refetch, score_status, block }) => {
  const [doc, setDoc] = useState();

  const additionalScoreStep = useSelector(getStepByName(flowSteps.ADDITIONAL_BORROWER_SCORE));

  const [
    fetchAddAdditionalIncome,
    { isSuccess: isAddAdditionalIncomeSuccess, isLoading: isAddAdditionalIncomeLoading }
  ] = useApplyMainAddAdditionalIncomeMutation();

  const [
    deleteAdditionalIncome,
    { isSuccess: deleteAdditionalIncomeSuccess, isLoading: deleteAdditionalIncomeLoading }
  ] = useApplyMainDeleteAdditionalIncomeMutation();

  useEffect(() => {
    isAddAdditionalIncomeSuccess && refetch();
  }, [isAddAdditionalIncomeSuccess]);

  useEffect(() => {
    if (deleteAdditionalIncomeSuccess) {
      refetch();
    }
  }, [deleteAdditionalIncomeSuccess]);

  const handleUploadDoc = e => {
    const files = e.target.files;
    const formData = new FormData();

    formData.append('doc', files[0]);

    setDoc(e.target.files[0]);
  };

  const handleDeleteDoc = () => {
    setDoc(null);
  };

  const onSubmit = e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', doc);
    fetchAddAdditionalIncome({ step_uuid: additionalScoreStep.step_uuid, formData });
  };

  const handleDeleteAdditionalIncome = () => {
    deleteAdditionalIncome({ stepUuid: additionalScoreStep.step_uuid });
  };

  console.log('DOC: ', doc);

  return (
    <ContainerBlock title='Дополнительный доход'>
      <div tw='flex flex-col space-y-3'>
        <SubBody
          text='Для предоставления информации о дополнительном доходе необходимо загрузить выписку по счету с одного из следующих банков за последние 6 месяцев: '
          twStyle={tw`text-secondary`}
        />
      </div>
      <BanksBlock />
      <form noValidate onSubmit={onSubmit} tw='flex flex-col space-y-3'>
        <div className='flex flex-col space-y-[4px]'>
          <InputFile
            text='Загрузить выписку из банка'
            onChange={handleUploadDoc}
            file={doc}
            disabled={block}
            onDelete={handleDeleteDoc}
            name='income'
          />
          <Caption
            text={<span>Файл должен быть в формате PDF и размером не более 5 мб</span>}
            twStyle={tw`text-dark pl-4`}
          />
        </div>
        {additional_income?.file_url && (
          <div tw='flex'>
            <a
              href={additional_income?.file_url}
              target='_blank'
              className='block text-green text-s14 underline pl-1 mr-5'
              rel='noreferrer'
            >
              {additional_income?.file_name}
            </a>
            <Button variant='link' onClick={handleDeleteAdditionalIncome} loading={deleteAdditionalIncomeLoading}>
              <DeleteIcon />
            </Button>
          </div>
        )}
        {additional_income?.status === coborrowerStatuses.IN_PROGRESS && (
          <div className='flex flex-col space-y-2'>
            <BodyText text='Выписка отправлена Банку' variant='bold' />
            <SubBody
              text='Информация по дополнительному доходу принята к рассмотрению, ожидайте ответ'
              twStyle={tw`text-secondary`}
            />
          </div>
        )}
        {additional_income?.status === coborrowerStatuses.DONE &&
          (score_status === scoreStatuses.APPROVED || score_status === scoreStatuses.CONTINUE) && (
            <div className='flex flex-col space-y-2'>
              <SubBody
                text='Ваш дополнительный доход подтвержден Банком!'
                variant='bold'
                twStyle={tw`text-secondary`}
              />
            </div>
          )}
        {additional_income?.status === coborrowerStatuses.DONE && score_status === scoreStatuses.PARTIAL_APPROVE && (
          <div className='flex flex-col space-y-2'>
            <SubBody
              text='Ваш дополнительный доход был подтвержден Банком! Вам одобрена не полная сумма, ознакомьтесь с условиями'
              twStyle={tw`text-secondary`}
            />
          </div>
        )}
        {additional_income?.status === coborrowerStatuses.DECLINED && (
          <div tw='my-3'>
            <SubBody
              text='К сожалению по вложенной выписке банк не может произвести анализ ваших доходов. Удалите текущую выписку и загрузите новую или продолжите без учета дополнительных доходов'
              twStyle={tw`text-error`}
            />
          </div>
        )}
        {additional_income?.status === coborrowerStatuses.DELETING && (
          <div tw='my-3'>
            <SubBody text='Происходит удаление выписки' variant='bold' twStyle={tw`text-error`} />
          </div>
        )}
        <div tw=''>
          <Button
            variant='ghost'
            type='submit'
            disabled={
              block ||
              any(
                item => item === additional_income?.status,
                [coborrowerStatuses.DONE, coborrowerStatuses.IN_PROGRESS, coborrowerStatuses.DECLINED]
              )
            }
            loading={isAddAdditionalIncomeLoading || additional_income?.status === coborrowerStatuses.DELETING}
          >
            Отправить выписку
          </Button>
        </div>
      </form>
    </ContainerBlock>
  );
};

export default AddIncomeBlock;
