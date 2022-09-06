import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import tw from 'twin.macro';
import * as yup from 'yup';

import { APIUrl } from '@/app/API-Url';
import FlagIcon from '@/assets/images/icons/FlagIcon';
import { Backdrop, Button, Caption, Checkbox, ContainerBlock, Input, Input2, Modal, Selector } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { useApplyMainMutation } from '@/features/api/apply-main';
import { useApplyVehiclelessMutation } from '@/features/api/apply-vehicleless';
import { getPersonalPageData } from '@/features/application/selectors';
import { getCalculationData } from '@/features/calculation/selectors';
import { setData } from '@/features/calculation/slice';
import { declOfNum, validateIIN } from '@/helper';
import { flows, sellerAutoIdentifierType } from '@/helper/constants';
import { flowTypes } from '@/helper/loan-approve-data';
import { checkVinCode, grnzMask, letterRegex } from '@/helper/personal-info-helper';
import CarNotFoundContent from '@/views/car-not-found-content';

const flowsOptions = [
  { label: 'C2C', value: flows.CLIENT_TO_CLIENT },
  { label: 'B2C', value: flows.BUSINESS_TO_CLIENT },
  { label: 'DEMO', value: flows.DEMO },
  { label: 'TEST', value: flows.TEST }
];

const radioOptions = [
  {
    value: 'without_auto',
    title: <span tw='font-normal text-secondary'>Указать гос номер авто позже</span>
  },
  {
    value: 'with_auto',
    title: <span tw='font-normal text-secondary'>Ввести гос номер авто</span>
  }
];

const PersonalInfoPage = () => {
  const [recaptchaValue, setRecaptchaValue] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const formData = useSelector(getPersonalPageData);
  const { isMobile } = useContext(DeviceInfoContext);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const calculationData = useSelector(getCalculationData);

  useEffect(() => {
    const period = searchParams.get('period');
    const repayment_method = searchParams.get('repayment_method');
    const down_payment = searchParams.get('down_payment');
    const car_principal = searchParams.get('car_principal');
    const monthly_payment = searchParams.get('monthly_payment');
    const gesv = searchParams.get('gesv');
    const is_laborer = searchParams.get('is_laborer');
    const interest_rate = searchParams.get('interest_rate');
    const credit_amount = searchParams.get('credit_amount');
    const click_code = searchParams.get('click_code');

    if (car_principal && credit_amount) {
      dispatch(
        setData({
          period: { value: period / 12, caption: declOfNum(period / 12) },
          repayment_method,
          down_payment,
          car_principal,
          monthly_payment,
          gesv,
          interest_rate,
          credit_amount,
          is_laborer: is_laborer === 'true',
          click_code
        })
      );
    } else {
      navigate('/404');
    }
  }, [searchParams]);

  const schema = yup
    .object({
      iin: yup
        .string()
        .trim()
        .min(12, 'ИИН не найден')
        .test('check-iin', 'ИИН не найден', function (value) {
          return validateIIN(value);
        })
        .required('Это поле обязательное'),
      mobile_phone: yup.string().trim().min(11, 'Некорректный номер телефона').required(),
      auto_identifier: yup.string().when('flow_type', {
        is: val => val === 'with_auto',
        then: yup.string().min(7, 'Неверно указан номер авто').required('Неверно указан номер авто')
      }),
      // auto_identifier_vin: yup.string().when('auto_identifier_type', {
      //   is: val => val === 'VIN',
      //   then: yup.string().min(17, 'Введите полностью VIN код').required('Введите полностью VIN код')
      // }),
      personal_data: yup.bool().oneOf([true], 'Это поле обязательное'),
      foreigner: yup.bool().oneOf([true], 'Это поле обязательное'),
      fatca: yup.bool().oneOf([true], 'Это поле обязательное'),
      ffb: yup.bool().oneOf([true], 'Это поле обязательное'),
      recaptcha: yup.string().required()
    })
    .required('Это поле обязательное');

  const [fetchApplyMain, { isSuccess, isLoading, error, reset, data: applyMainData }] = useApplyMainMutation();
  const [
    fetchApplyVehicleless,
    { isSuccess: succesVehicleless, isLoading: loadingVehicleless, error: errorVehicleless }
  ] = useApplyVehiclelessMutation();

  const { control, watch, handleSubmit, setValue, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      recaptcha: null,
      flow_type: 'without_auto',
      ...formData
    }
  });

  useEffect(() => {
    if (applyMainData?.models && applyMainData?.models?.length > 0) {
      setOpen(true);
    }
  }, [applyMainData]);

  const autoIdentifierType = watch('auto_identifier_type');
  const grnz = watch('auto_identifier');
  const iin = watch('iin');
  const flowType = watch('flow_type');

  useEffect(() => {
    if (error && grnz) {
      reset();
    }
  }, [grnz]);

  useEffect(() => {
    if ((isSuccess || succesVehicleless) && !applyMainData?.models) {
      navigate('/main/verify', {
        state: {
          phone: getValues('mobile_phone'),
          iin,
          utm_source: searchParams.get('utm_source'),
          utm_medium: searchParams.get('utm_medium'),
          utm_campaign: searchParams.get('utm_campaign'),
          utm_content: searchParams.get('utm_content'),
          utm_term: searchParams.get('utm_term')
        }
      });
    }
  }, [isSuccess, navigate, succesVehicleless, applyMainData, getValues, iin, searchParams]);

  const onSubmit = data => {
    const mobilePhone = data.mobile_phone.startsWith('+') ? data.mobile_phone : '+' + data.mobile_phone;
    const body = {
      iin: data.iin.trim(),
      mobile_phone: mobilePhone.replaceAll(' ', ''),
      auto_identifier: data.auto_identifier_type === 'GRNZ' ? data.auto_identifier : data.auto_identifier_vin,
      auto_identifier_type: data.auto_identifier_type,
      flow: data.flow,
      program: searchParams.get('is_laborer') === 'true' ? 'AUTO_STANDARD_LABORER' : data.program,
      recaptcha: data.recaptcha,
      params: {
        period: calculationData.period.value * 12,
        repayment_method: calculationData.repayment_method,
        down_payment: calculationData.down_payment,
        car_principal: calculationData.car_principal
      },
      is_laborer: calculationData?.is_laborer
    };

    if (flowType === 'with_auto') {
      fetchApplyMain({ body });
    } else {
      body.flow = 'CLIENT_TO_CLIENT_WITHOUT_CAR';
      fetchApplyVehicleless({ body });
    }
  };

  const handleCheckRobot = value => {
    if (value && value?.length > 0) {
      console.log(value);
      setValue('recaptcha', value, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} tw='pb-3 pt-3'>
      <div className='space-y-3'>
        <ContainerBlock title='Ваши данные' twStyle={tw`p-5`}>
          <div tw='space-y-4 bg-secondary items-center lg:items-end sm:flex md:flex-col md:space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4 md:space-y-4 sm:rounded-2xl sm:space-x-4 sm:space-y-0'>
            <Input2
              label='Номер моб.телефона'
              mask='+7 999 999 99 99'
              inputMode='numeric'
              name='mobile_phone'
              placeholder='+7 (---) --- -- --'
              control={control}
              rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
              errorStyle={tw`sm:absolute sm:bottom-[-16px ]`}
              disabled={isLoading}
            />
            <Input2
              label='ИИН'
              mask='999999999999'
              inputMode='numeric'
              name='iin'
              placeholder='Введите ваш ИИН'
              control={control}
              errorStyle={tw`sm:absolute sm:bottom-[-16px ]`}
              disabled={isLoading}
            />
          </div>
        </ContainerBlock>

        <ContainerBlock title='Данные о приобретаемом авто'>
          {/*<Controller
            name='auto_identifier_type'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Selector
                items={identifierType}
                defaultActiveItem={value}
                getActiveItem={onChange}
                disabled={isLoading}
              />
            )}
          />*/}
          {/* <Radio
            name='flow_type'
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            control={control}
            radioStyle={tw`p-0 py-4`}
            options={radioOptions}
          /> */}
          <Controller
            name='flow_type'
            control={control}
            render={({ field: { value, onChange } }) => {
              return <Selector items={flowTypes} defaultActiveItem={flowType} getActiveItem={onChange} />;
            }}
          />
          {flowType === 'with_auto' && (
            <>
              {autoIdentifierType === sellerAutoIdentifierType.GRNZ && (
                <Input
                  control={control}
                  name='auto_identifier'
                  icon={!letterRegex.test(grnz[0]) && <FlagIcon />}
                  placeholder='000 AAA 01 или A 001 AAA'
                  rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                  mask={grnzMask}
                  disabled={isLoading}
                />
              )}
              {autoIdentifierType === sellerAutoIdentifierType.VIN && (
                <Input
                  control={control}
                  name='auto_identifier_vin'
                  placeholder='Введите 17 символов'
                  rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                  mask={{
                    mask: '*****************',
                    prepare: function (str) {
                      if (checkVinCode(str)) {
                        return str.toUpperCase();
                      }
                    }
                  }}
                  disabled={isLoading}
                />
              )}
            </>
          )}
          {(error || errorVehicleless) && (
            <span tw='ml-s13 leading-3 bottom-4 flex flex-col space-y-2'>
              <Caption
                text={error?.description || errorVehicleless?.description || 'Ошибка'}
                twStyle={tw`text-error`}
              />
              <Caption
                text={
                  'Критерии по Авто: не старше 15 лет на момент окончания кредита для машин мировых брендов (Европа, Южная Корея, США, Япония) и не более трёх лет ‒ для произведённых в странах СНГ и КНР. Максимальная стоимость авто 25 000 000 ₸'
                }
                twStyle={tw`text-secondary`}
              />
            </span>
          )}
        </ContainerBlock>

        <ContainerBlock title='Условия соглашения'>
          <Checkbox
            control={control}
            name='personal_data'
            label='Я соглашаюсь на сбор и обработку'
            link={{
              text: 'Персональных данных',
              href: `${APIUrl}/print-forms/borrower-agreement/`
            }}
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            disabled={isLoading}
          />
          <Checkbox
            control={control}
            name='foreigner'
            label='Я не являюсь иностранным публичным должностным лицом'
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            disabled={isLoading}
          />
          <Checkbox
            control={control}
            name='fatca'
            label='Я подтверждаю отсутствие у меня признаков принадлежности к FATCA'
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            disabled={isLoading}
          />
          <Checkbox
            name='ffb'
            control={control}
            label='Я соглашаюсь на открытие счета в FFB'
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            disabled={isLoading}
          />
          <ReCAPTCHA sitekey={import.meta.env.AC_RECAPTCHA_SECRET_KEY} onChange={handleCheckRobot} />
          {/*<Select options={flowsOptions} control={control} name='flow' />*/}
        </ContainerBlock>
        <div className='self-center text-center sm:text-right pt-5'>
          <Button
            type='submit'
            caption='Получите SMS код для подтверждения'
            variant='primary'
            disabled={!formState.isValid}
            loading={isLoading || loadingVehicleless}
          >
            Продолжить
          </Button>
        </div>
      </div>
      {isMobile ? (
        <Backdrop
          isOpen={open}
          setIsOpen={setOpen}
          title='Авто не найдено'
          twStyle={tw`bg-primary p-0`}
          headerStyle={tw`bg-secondary p-5`}
        >
          <CarNotFoundContent models={applyMainData?.models} phone={getValues('mobile_phone')} />
        </Backdrop>
      ) : (
        <Modal
          open={open}
          setOpen={setOpen}
          title='Авто не найдено'
          twStyle={tw`!p-0 !rounded-2xl`}
          headerStyle={tw`p-5 bg-secondary rounded-t-2xl`}
        >
          <CarNotFoundContent models={applyMainData?.models} phone={getValues('mobile_phone')} />
        </Modal>
      )}
    </form>
  );
};

export default PersonalInfoPage;
