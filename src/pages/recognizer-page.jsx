import { yupResolver } from '@hookform/resolvers/yup';
import imageCompression from 'browser-image-compression';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';
import * as yup from 'yup';

import FlagIcon from '@/assets/images/icons/FlagIcon';
import { Backdrop, Button, Checkbox, ContainerBlock, Input, Input2, InputPhoto, Modal, Selector } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { usePlateRecognizeMutation, useRawRecognizeMutation } from '@/features/api/apply-main';
import { sellerAutoIdentifierType } from '@/helper/constants';
import { checkVinCode, grnzMask, identifierType, letterRegex } from '@/helper/personal-info-helper';
import CarNotFoundContent from '@/views/car-not-found-content';

const RecognizerPage = () => {
  const navigate = useNavigate();
  const { isMobile } = useContext(DeviceInfoContext);
  const [doc, setDoc] = useState();
  const [compressing, setCompressing] = useState(false);

  const schema = yup
    .object({
      iin: yup.string().trim().min(12, 'Неверно указан ИИН').required('Это поле обязательное'),
      mobile_phone: yup.string().trim().min(11, 'Некорректный номер телефона').required(),
      auto_identifier: yup.string().when('auto_identifier_type', {
        is: val => val === 'GRNZ',
        then: yup.string().min(7, 'Неверно указан номер авто').required('Неверно указан номер авто')
      }),
      auto_identifier_vin: yup.string().when('auto_identifier_type', {
        is: val => val === 'VIN',
        then: yup.string().min(17, 'Введите полностью VIN код').required('Введите полностью VIN код')
      }),
      personal_data: yup.bool().oneOf([true], 'Это поле обязательное'),
      foreigner: yup.bool().oneOf([true], 'Это поле обязательное'),
      fatca: yup.bool().oneOf([true], 'Это поле обязательное'),
      ffb: yup.bool().oneOf([true], 'Это поле обязательное')
    })
    .required('Это поле обязательное');

  const [fetchRawRecognize, { data, isSuccess, isLoading }] = useRawRecognizeMutation();
  const [
    fetchPlateRecognize,
    { data: plateRecognizeData, isSuccess: plateRecognizeSuccess, isLoading: plateRecognizeLoading }
  ] = usePlateRecognizeMutation();
  const { control, watch, handleSubmit, setValue, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      iin: '871113000058',
      mobile_phone: '+77777732058',
      auto_identifier: '',
      auto_identifier_type: 'GRNZ',
      personal_data: true,
      foreigner: true,
      fatca: true,
      ffb: true
    }
  });

  const autoIdentifierType = watch('auto_identifier_type');
  const grnz = watch('auto_identifier');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      navigate('/main/car-info', { state: { data } });
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (plateRecognizeSuccess) {
      setValue('auto_identifier', plateRecognizeData?.grnz);
    }
  }, [plateRecognizeSuccess, plateRecognizeData]);

  //console.log(phone);

  const onSubmit = data => {
    const body = {
      iin: data.iin.trim(),
      mobile_phone: data.mobile_phone,
      auto_identifier: data.auto_identifier_type === 'GRNZ' ? data.auto_identifier : data.auto_identifier_vin,
      auto_identifier_type: data.auto_identifier_type
    };
    console.log(body);
    fetchRawRecognize({ body });
  };

  const handleUploadDoc = async e => {
    const imageFile = e.target.files[0];
    setCompressing(true);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: 'jpg'
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);

      if (compressedFile) {
        setCompressing(false);
      }

      const formData = new FormData();

      formData.append('car_image', compressedFile, compressedFile.name);

      await fetchPlateRecognize({ formData });

      setDoc(e.target.files[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDoc = () => {
    setDoc(null);
  };

  const variants = {
    initial: { opacity: 0, x: '-100vw' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100vw' }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} tw='pb-3 pt-3'>
      <div className='space-y-3'>
        <ContainerBlock title='Ваши данные' twStyle={tw`p-5`}>
          <div tw='space-y-4 bg-secondary items-center lg:items-end sm:flex md:flex-col md:space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4 md:space-y-4 sm:rounded-2xl sm:space-x-4 sm:space-y-0'>
            <Input2
              label='Номер моб.телефона'
              inputMode='numeric'
              mask='+7 999 999 99 99'
              name='mobile_phone'
              placeholder='+7 (---) --- -- --'
              control={control}
              rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
              errorStyle={tw`sm:absolute sm:bottom-[-16px ]`}
              disabled={false}
            />
            <Input2
              label='ИИН'
              mask='999999999999'
              inputMode='numeric'
              name='iin'
              placeholder='Введите ваш ИИН'
              control={control}
              errorStyle={tw`sm:absolute sm:bottom-[-16px ]`}
              disabled={false}
            />
          </div>
        </ContainerBlock>
        <ContainerBlock title='Данные о приобретаемом авто' twStyle={tw`pb-7`}>
          <Controller
            name='auto_identifier_type'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Selector
                items={identifierType}
                defaultActiveItem={value}
                getActiveItem={onChange}
                disabled={isLoading || plateRecognizeLoading || compressing}
              />
            )}
          />
          <div tw='flex items-center space-x-2 h-[50px]'>
            {autoIdentifierType === sellerAutoIdentifierType.GRNZ && (
              <>
                {plateRecognizeLoading || compressing ? (
                  <div tw='h-[47px] mt-1 w-full animate-pulse duration-75 bg-primary rounded-2xl' />
                ) : (
                  <Input
                    control={control}
                    name='auto_identifier'
                    icon={!letterRegex.test(grnz[0]) && <FlagIcon />}
                    placeholder='000 AAA 01 или A 001 AAA'
                    rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
                    mask={grnzMask}
                    disabled={isLoading}
                    twStyle={tw`h-full mt-0`}
                    errorStyle={tw`absolute bottom-[-20px]`}
                  />
                )}
              </>
            )}
            {autoIdentifierType === sellerAutoIdentifierType.VIN && (
              <>
                {plateRecognizeLoading || compressing ? (
                  <div tw='h-[47px] mt-1 w-full animate-pulse duration-75 bg-primary rounded-2xl' />
                ) : (
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
                  />
                )}
              </>
            )}
            {plateRecognizeLoading || compressing ? (
              <div tw='h-[47px] mt-1 w-[50px] animate-pulse duration-75 bg-primary rounded-2xl' />
            ) : (
              <InputPhoto
                text='Загрузить фото авто'
                disabled={isLoading}
                onChange={handleUploadDoc}
                file={doc}
                onDelete={handleDeleteDoc}
                name='income'
              />
            )}
          </div>
        </ContainerBlock>

        <ContainerBlock title='Условия соглашения'>
          <Checkbox
            control={control}
            name='personal_data'
            label='Я соглашаюсь на сбор и обработку'
            link={{
              text: 'Персональных данных',
              href: 'https://dev-auto.trafficwave.kz/api/v1/print-forms/borrower-agreement/'
            }}
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            disabled={true}
          />
          <Checkbox
            control={control}
            name='foreigner'
            label='Я не являюсь иностранным публичным должностным лицом'
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            disabled={true}
          />
          <Checkbox
            control={control}
            name='fatca'
            label='Я подтверждаю отсутствие у меня признаков принадлежности к FATCA'
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            disabled={true}
          />
          <Checkbox
            name='ffb'
            control={control}
            label='Я соглашаюсь на открытие счета в FFB'
            rules={{ required: { value: true, message: 'Это поле не может быть пустым' } }}
            disabled={true}
          />
        </ContainerBlock>
        <div className='self-center text-center sm:text-right pt-5'>
          <Button
            type='submit'
            caption='Перейти к оценкe авто'
            variant='primary'
            loading={isLoading || plateRecognizeLoading || compressing}
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
          <CarNotFoundContent />
        </Backdrop>
      ) : (
        <Modal
          open={open}
          setOpen={setOpen}
          title='Авто не найдено'
          twStyle={tw`!p-0 !rounded-2xl`}
          headerStyle={tw`p-5 bg-secondary w-[750px] rounded-t-2xl`}
        >
          <CarNotFoundContent />
        </Modal>
      )}
    </form>
  );
};

export default RecognizerPage;
