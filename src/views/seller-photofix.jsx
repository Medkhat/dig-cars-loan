import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import tw from 'twin.macro';

import CameraIcon from '@/assets/images/icons/CameraIcon';
import { Button, Title } from '@/components';

const videoConstraints = {
  video: true,
  width: 1280,
  height: 720,
  facingMode: 'environment'
};

const styles = {
  camera: [
    tw`flex justify-center absolute left-0 bottom-5 left-[50%] translate-x-[-50%] bg-green p-4 rounded-full rotate-90`
  ],
  preview: [tw`my-auto relative w-full h-full flex`],
  counter: tw`absolute rotate-90 top-[50%] left-5`,
  title: ({ value }) => {
    if (value === 'vin_image') {
      return tw`absolute rotate-90 top-[50%] right-[-25px]`;
    } else if (value === 'front_side_image') {
      return tw`absolute rotate-90 top-[50%] right-[-150px]`;
    } else {
      return tw`absolute rotate-90 top-[50%] right-[-50px]`;
    }
  },
  img: [tw`absolute w-[120%]  opacity-50 rotate-90 top-[50%] translate-y-[-50%]`]
};

const SellerPhotoFix = ({ setNextPhotoStep, layerInfo }) => {
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const reCapture = useCallback(() => {
    if (image) {
      setImage(null);
    }
  }, [image]);

  const nextPhoto = e => {
    setNextPhotoStep(e, image, layerInfo.value);
    setImage(null);
  };

  return !image ? (
    <div className='webcam-container relative w-full h-full'>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat='image/jpeg'
        style={{ width: '100%', height: '80vh', zIndex: 3 }}
        videoConstraints={videoConstraints}
      />
      <button css={styles.camera} onClick={capture}>
        <CameraIcon />
      </button>
      <Title variant='bold' text={layerInfo.title} twStyle={styles.title({ value: layerInfo?.value })} />
      <Title variant='bold' text={`${layerInfo.id} из 5`} twStyle={styles.counter} />
      {layerInfo.layout && <img src={layerInfo.layout} css={styles.img} alt='layout' />}
      {/* {image && <img src={image} height={500} alt='car1' />} */}
    </div>
  ) : (
    <div css={styles.preview}>
      <div tw='rotate-90 self-center'>
        <img src={image} tw='max-w-full z-50 w-[88vw] mx-auto h-[calc(100vh-58px)]' alt='captured_photo' />
      </div>

      <div tw='flex items-center justify-center space-x-3 absolute top-[50%] translate-y-[-50%] rotate-90 w-[70px] left-5 z-50'>
        <Button variant='ghost' onClick={reCapture}>
          Переснять
        </Button>
        <Button variant='secondary' onClick={nextPhoto}>
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default SellerPhotoFix;
