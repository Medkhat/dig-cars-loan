import 'twin.macro';

import { find } from 'ramda';
import { propEq } from 'ramda';
import { values } from 'ramda';
import { mergeAll } from 'ramda';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';

import carBack from '@/assets/images/car_back.png';
import carFront from '@/assets/images/car_front.png';
import carLeft from '@/assets/images/car_left.png';
import carRight from '@/assets/images/car_right.png';
import { Backdrop, Button, Modal, SubBody, SubTitle } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { applyMainStatus } from '@/features/api/apply-main';
import { useApplySellerVehiclePhotoControlMutation } from '@/features/api/apply-seller';
import { getFlowUuid, getPhotocontrolStep } from '@/features/application/selectors';
import { setPhotocontrolStep } from '@/features/application/slice';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import CommonPhotocontrol from '@/views/common-photocontrol';
import PhotoControlBackdropContent from '@/views/photocontrol-backdrop-content';
import SellerPhotoFix from '@/views/seller-photofix';

const photoSteps = [
  {
    id: 1,
    title: 'Автомобиль слева',
    layout: carLeft,
    value: 'left_side_image'
  },
  {
    id: 2,
    title: 'Автомобиль справа',
    layout: carRight,
    value: 'right_side_image'
  },
  {
    id: 3,
    title: 'Автомобиль спереди с гос. номером',
    layout: carFront,
    value: 'front_side_image'
  },
  {
    id: 4,
    title: 'Автомобиль сзади',
    layout: carBack,
    value: 'back_side_image'
  },
  {
    id: 5,
    title: 'VIN-код на авто',
    layout: '',
    value: 'vin_image'
  }
];

const SellerPhotocontrolPage = () => {
  const [photos, setPhotos] = useState([]);
  const dispatch = useDispatch();
  const { isMobile } = useContext(DeviceInfoContext);

  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);

  const flowUuid = useSelector(getFlowUuid);
  const photoStep = useSelector(getPhotocontrolStep);

  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));

  const [fetchPhotoControl, { isSuccess }] = useApplySellerVehiclePhotoControlMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [isSuccess, flowUuid, dispatch]);

  const openBackdrop = () => {
    setIsOpenBackdrop(true);
  };

  const startPhotocontrol = useCallback(() => {
    setIsOpenBackdrop(false);
    dispatch(setPhotocontrolStep(1));
  }, [dispatch]);

  const setNextPhotoStep = useCallback(
    (e, image, type) => {
      e.preventDefault();
      setPhotos([...photos, { [type]: image }]);
      dispatch(setPhotocontrolStep(photoStep + 1));
    },
    [photoStep, photos, dispatch]
  );
  console.log('PHOSTOS: ', photos);

  const sendPhotos = useCallback(() => {
    let body = { flow_uuid: flowUuid, ...mergeAll(photos) };
    fetchPhotoControl({ uuid: flowUuid, body });
  }, [photos, flowUuid, fetchPhotoControl]);

  if (photoStep !== 0 && photoStep !== 6) {
    return <SellerPhotoFix setNextPhotoStep={setNextPhotoStep} layerInfo={find(propEq('id', photoStep), photoSteps)} />;
  } else if (photoStep === 0) {
    return (
      <>
        <CommonPhotocontrol verifyBiometry={openBackdrop} />
        {isMobile ? (
          <Backdrop isOpen={isOpenBackdrop} setIsOpen={setIsOpenBackdrop}>
            <PhotoControlBackdropContent startPhotocontrol={startPhotocontrol} />
          </Backdrop>
        ) : (
          <Modal
            open={isOpenBackdrop}
            setOpen={setIsOpenBackdrop}
            title='Видеоидентификация'
            twStyle={tw`rounded-2xl !p-0`}
            headerStyle={tw`p-5 pb-0`}
          >
            <PhotoControlBackdropContent startPhotocontrol={startPhotocontrol} />
          </Modal>
        )}
      </>
    );
  } else {
    return <PhotoPreviews photos={photos} sendPhotos={sendPhotos} />;
  }
};
export default SellerPhotocontrolPage;

const PhotoPreviews = ({ photos, sendPhotos }) => {
  return (
    <>
      <div tw='m-5'>
        <SubTitle text='Отправляем фотографии?' variant='bold' />
        <SubBody
          text='Изображение должно соответствовать подписи. Чтобы переснять, нажмите на фото'
          twStyle={tw`text-secondary block mt-5`}
        />
      </div>

      <div tw='grid grid-cols-2 gap-4 p-5 bg-secondary'>
        {photos.map((photo, i) => (
          <img src={values(photo)[0]} key={i} alt='previews' tw='block rounded-md' />
        ))}
      </div>
      <div tw='mt-5 text-center'>
        <Button variant='primary' caption='Перейти к подписанию документов' onClick={sendPhotos}>
          Продолжить
        </Button>
      </div>
    </>
  );
};
