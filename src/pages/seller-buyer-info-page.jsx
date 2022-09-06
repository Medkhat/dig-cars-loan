import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTimer } from 'react-timer-hook';
import tw from 'twin.macro';

import { Backdrop, Button, Checkbox, Input, Modal, SubBody, SubTitle } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { applyMainStatus } from '@/features/api/apply-main';
import {
  useGetBorrowerDeliveryInfoQuery,
  useSellerUnregisterCheckDebtMutation,
  useSellerUnregisterCreditInfoQuery,
  useSellerUnregisterFinalSignMutation,
  useSetSellerDeliveryInfoMutation
} from '@/features/api/seller-unregister';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { flowStatuses, flowSteps, stepStatuses } from '@/helper/constants';
import BiometryBackdropContent from '@/views/biometry-backdrop-content';
import SellerBuyerInfoBlock from '@/views/seller-buyer-info-block';
import SellerBuyerInfoItem from '@/views/seller-buyer-info-item';
import SellerCarInfo from '@/views/seller-car-info';

const SellerBuyerInfoPage = () => {
  const dispatch = useDispatch();

  const { isMobile } = useContext(DeviceInfoContext);

  const { control, handleSubmit, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      isStorage: false
    }
  });
  const flowUuid = useSelector(getFlowUuid);

  const {
    control: addressControl,
    watch: addressWatch,
    getValues
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      isOwnAddress: false,
      street: '',
      building: '',
      flat: '',
      comment: ''
    }
  });

  const saveGrnz = watch('isStorage');
  const isOwnAddress = addressWatch('isOwnAddress');

  const [fetchCheckDebt] = useSellerUnregisterCheckDebtMutation();

  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);
  const currentStep = useSelector(getCurrentStep);
  const finalSignInfo = useSelector(getStepByName(flowSteps.SELLER_UNREGISTER_FINAL_SIGN));
  const step = useSelector(getStepByName(currentStep));

  const checkDebtInfo = useSelector(getStepByName(flowSteps.SELLER_UNREGISTER_CHECK_DEBT));

  const { data: borrowerDeliveryInfo } = useGetBorrowerDeliveryInfoQuery({ uuid: flowUuid }, { skip: !flowUuid });

  const eventTime = new Date(checkDebtInfo?.retry_at * 1000);

  const { isRunning, start, restart, pause } = useTimer({
    expiryTimestamp: eventTime
  });

  const { data: creditInfo } = useSellerUnregisterCreditInfoQuery({ uuid: flowUuid }, { skip: !flowUuid });

  const [fetchFinalSign, { isLoading: finalSignLoading }] = useSellerUnregisterFinalSignMutation();
  const [fetchDelivery, { isLoading, isSuccess }] = useSetSellerDeliveryInfoMutation();

  const onSubmit = async data => {
    fetchFinalSign({ uuid: flowUuid, step: currentStep });
    // navigate('/seller/amount-info');
  };

  const onSubmitDelivery = () => {
    const deliveryInfo = getValues();

    const delivery = {
      save_grnz: saveGrnz,
      delivery: {
        street: deliveryInfo.street,
        building: deliveryInfo.building,
        flat: deliveryInfo.flat,
        comment: deliveryInfo.comment
      }
    };

    if (!deliveryInfo?.isOwnAddress) {
      delivery.delivery.street = borrowerDeliveryInfo?.street;
      delivery.delivery.building = borrowerDeliveryInfo?.building;
      delivery.delivery.flat = borrowerDeliveryInfo?.flat;
    }

    fetchDelivery({ uuid: flowUuid, delivery });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [isSuccess]);

  const checkDebt = async data => {
    if (!borrowerDeliveryInfo?.street && !borrowerDeliveryInfo?.building && !borrowerDeliveryInfo?.flat && !isSuccess) {
      await fetchDelivery({
        uuid: flowUuid,
        delivery: {
          save_grnz: saveGrnz,
          delivery: null
        }
      });

      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }

    await fetchCheckDebt({ uuid: flowUuid, step: currentStep });
    //dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    // navigate('/seller/amount-info');
  };

  const { socket_url } = step;

  useGetDataStreamingQuery({ url: socket_url, step: currentStep }, { skip: !socket_url });

  useEffect(() => {
    if (
      (checkDebtInfo.is_final && checkDebtInfo.status === stepStatuses.IN_PROGRESS) ||
      step.step === flowSteps.SELLER_UNREGISTER_CHECK_DEBT
    ) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
    if (
      checkDebtInfo.status === stepStatuses.FAILED &&
      checkDebtInfo.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT
    ) {
      restart(eventTime);
    }
  }, [checkDebtInfo]);

  useEffect(() => {
    if (finalSignInfo.redirect_url) {
      setIsOpenBackdrop(true);
    }
  }, [finalSignInfo]);

  useEffect(() => {
    if (finalSignInfo?.is_success) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [finalSignInfo?.is_success]);

  return (
    <div className='seller-buyer-info-page mt-5'>
      <div className=' sm:rounded-t-2xl sm:py-0'>
        <div className='p-5 bg-secondary sm:rounded-t-2xl'>
          <SubTitle text='Данные покупателя' twStyle={tw`text-s16`} variant='bold' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-[1px]'>
          <SellerBuyerInfoBlock twStyle={tw`sm:rounded-bl-2xl`}>
            <SellerBuyerInfoItem title='Имя' body={creditInfo?.full_name} />
          </SellerBuyerInfoBlock>
          <SellerBuyerInfoBlock>
            <SellerBuyerInfoItem title='ИИН' body={creditInfo?.borrower_iin} />
          </SellerBuyerInfoBlock>
          <SellerBuyerInfoBlock twStyle={tw`sm:rounded-br-2xl`}>
            <SellerBuyerInfoItem title='Номер телефона' body={creditInfo?.borrower_mobile_phone} />
          </SellerBuyerInfoBlock>
        </div>
      </div>
      <SellerCarInfo carInfo={creditInfo} />
      <div className='p-5 bg-secondary mt-[2px] sm:rounded-b-2xl'>
        <Checkbox control={control} name='isStorage' label='Оставить на хранение (30 дней)' />
      </div>
      {(borrowerDeliveryInfo?.street || borrowerDeliveryInfo?.building || borrowerDeliveryInfo?.flat) && (
        <div tw='bg-secondary p-5 sm:rounded-2xl mt-3'>
          <p tw='text-secondary text-s14'>
            {creditInfo?.full_name}, оплатил курьерскую доставку нового гос. номера и тех. паспорта по адресу:
            {borrowerDeliveryInfo?.street || ''}, {borrowerDeliveryInfo?.building || ''},{' '}
            {borrowerDeliveryInfo?.flat || ''}. Укажите адрес по которому курьер сможет забрать Ваш гос. номер и тех.
            паспорт для передачи в СЦОН.
          </p>
          <p tw='my-5'>
            <Checkbox name='isOwnAddress' control={addressControl} label='Я укажу свой адрес:' />
          </p>
          <div>
            <form>
              <Input
                control={addressControl}
                disabled={!isOwnAddress || isLoading || isSuccess}
                name='street'
                mask={{ mask: String }}
                placeholder='Введите название улицы'
                label='Улица'
              />
              <Input
                control={addressControl}
                disabled={!isOwnAddress || isLoading || isSuccess}
                name='building'
                mask={{ mask: String }}
                placeholder='Введите номер дома'
                label='Дом'
              />
              <Input
                control={addressControl}
                disabled={!isOwnAddress || isLoading || isSuccess}
                name='flat'
                mask={{ mask: String }}
                placeholder='Введите номер квартиры'
                label='Квартира'
              />
              <Input
                control={addressControl}
                name='comment'
                mask={{ mask: String }}
                disabled={!isOwnAddress || isLoading || isSuccess}
                placeholder='Введите дополнительные детали'
                label='Комментарий'
              />
              <div tw='mt-5'>
                <Button
                  variant='secondary'
                  type='button'
                  caption=''
                  onClick={onSubmitDelivery}
                  loading={finalSignLoading}
                  disabled={currentStep !== flowSteps.SELLER_UNREGISTER_SET_DELIVERY_INFO}
                >
                  Продолжить
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <form>
        <div className='bg-secondary p-5 sm:rounded-2xl mt-3'>
          <SubTitle text='Штрафы и налоги' twStyle={tw`text-s16`} variant='bold' />
          <div className='mt-5'>
            <Button
              variant='ghost'
              type='button'
              onClick={checkDebt}
              disabled={
                currentStep === flowSteps.SELLER_UNREGISTER_FINAL_SIGN ||
                checkDebtInfo?.is_loading ||
                checkDebtInfo?.is_success ||
                (new Date() < eventTime && isRunning)
              }
              loading={checkDebtInfo?.is_loading}
            >
              Проверить на штрафы
            </Button>
            {checkDebtInfo?.status_reason && (
              <div tw='mt-3'>
                <SubBody text={checkDebtInfo?.status_reason} twStyle={tw`text-s16 text-error `} />
              </div>
            )}
            {checkDebtInfo?.is_success && (
              <SubBody text='Штрафы и задолженности по налогам не найдены' twStyle={tw`text-s16 pt-2 text-secondary`} />
            )}
            <div tw='mt-3'>
              <SubBody
                text='«Уведомляем о необходимости уплаты налога за текущий календарный год»'
                twStyle={tw`text-s14 text-secondary`}
              />
            </div>
          </div>
        </div>

        <div className='w-full text-center sm:text-right my-5'>
          <Button
            variant='primary'
            type='submit'
            caption='Посчитать итог'
            loading={finalSignLoading}
            onClick={onSubmit}
            disabled={currentStep !== flowSteps.SELLER_UNREGISTER_FINAL_SIGN}
          >
            Продолжить
          </Button>
        </div>
        {isMobile ? (
          <Backdrop isOpen={isOpenBackdrop} setIsOpen={setIsOpenBackdrop}>
            <BiometryBackdropContent
              fetchBiometry={finalSignInfo?.redirect_url}
              disabled={!finalSignInfo.redirect_url}
            />
          </Backdrop>
        ) : (
          <Modal open={isOpenBackdrop} setOpen={setIsOpenBackdrop} title='Видеоидентификация' twStyle={tw`rounded-2xl`}>
            <BiometryBackdropContent
              fetchBiometry={finalSignInfo?.redirect_url}
              disabled={!finalSignInfo.redirect_url}
            />
          </Modal>
        )}
      </form>
    </div>
  );
};
export default SellerBuyerInfoPage;
