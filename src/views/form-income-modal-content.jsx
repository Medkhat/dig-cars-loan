import 'twin.macro';

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import tw from 'twin.macro';
import * as yup from 'yup';

import { Button, CurrencyInput, SubBody } from '@/components';
import { applyMainStatus, useApplyMainFormIncomeMutation } from '@/features/api/apply-main';
import { getFlowUuid } from '@/features/application/selectors';
import { formatter } from '@/helper';

const schema = yup
  .object({
    form_income: yup.number().max(9999999, ({ max }) => `Максимальная сумма ${formatter.format(max.toFixed(0))} ₸`)
  })
  .required();

const FormIncomeModalContent = ({ setIsOpenFormIncome }) => {
  const dispatch = useDispatch();

  const flowUuid = useSelector(getFlowUuid);

  const [fetchFormIncome, { isLoading: formIncomeLoading, isSuccess: formIncomeSuccess }] =
    useApplyMainFormIncomeMutation();

  useEffect(() => {
    if (formIncomeSuccess) {
      setIsOpenFormIncome(false);
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [formIncomeSuccess, setIsOpenFormIncome, dispatch, flowUuid]);

  const { control, getValues } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      form_income: 0
    }
  });

  const submitFormIncome = () => {
    fetchFormIncome({
      flow_uuid: flowUuid,
      form_income: getValues('form_income')
    });
  };

  return (
    <div tw='w-auto flex flex-col space-y-3 sm:w-[350px]'>
      <form noValidate tw='flex flex-col space-y-3 m-3 mt-5'>
        <SubBody
          text='Укажите среднемесячный доход (за вычетом налогов) за последние 6 месяцев'
          twStyle={tw`text-secondary`}
        />
        <CurrencyInput name='form_income' control={control} />
        <Button variant='secondary' onClick={submitFormIncome} loading={formIncomeLoading}>
          Отправить
        </Button>
      </form>
    </div>
  );
};
export default FormIncomeModalContent;
