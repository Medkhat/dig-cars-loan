/*
import 'twin.macro';

import { LayoutGroup, motion } from 'framer-motion';
import { inc, propOr } from 'ramda';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInterval } from 'react-use';
import tw from 'twin.macro';

import CarIcon from '@/assets/images/camry.svg';
import { BigTitle, Title } from '@/components';
import { CheckStatusContext } from '@/contexts/check-status-context';
import { useGetDataStreamingQuery } from '@/features/ws-data/api';
import { getIsFinishProcess, isFinal, isSuccess } from '@/features/ws-data/selectors';
import { clearWsData } from '@/features/ws-data/slice';

const processTitle = {
  PRE_SCORE: 'Идет процесс проверки',
  CALCULATE_INSURANCE: 'Идет процесс проверки',
  BORROWER_SCORE: 'Идет процесс проверки'
};

const ProcessWsPage = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [duration, setDuration] = useState(50);
  const { refetch } = useContext(CheckStatusContext);
  //console.log('REFETCH: ', refetch);

  const isSuccessResult = useSelector(isSuccess);
  const isFinalResult = useSelector(isFinal);
  const isFinishProcess = useSelector(getIsFinishProcess);

  const [progress, setProgress] = useState(1);

  const processName = state?.step;
  const processUrl = state?.url;

  useEffect(() => {
    isFinishProcess && setDuration(10);
  }, [dispatch, isFinishProcess]);

  useEffect(() => {
    if (isFinalResult) {
      dispatch(clearWsData());
      setTimeout(() => {
        refetch();
      }, 3000);
    }
  }, [isFinalResult]);

  useInterval(() => {
    if (progress < 99) {
      setProgress(value => inc(value));
    }
  }, (duration * 1000) / 100);

  /!* useEffect(() => {
    !state?.url && navigate('/main', { replace: true });
  }, [state, navigate]);*!/

  /!*useEffect(() => {
    if (progress === 100) {
      dispatch(clearWsUrl());
      dispatch(clearWsData());
      refetch();
    }
  }, [progress, refetch]);*!/

  useGetDataStreamingQuery(processUrl, { skip: !processUrl });

  const onCompleteAnimation = definition => {
    console.log('DEF: ', definition);
    //dispatch(clearWsUrl());
  };
  const variants = {
    initial: { width: '0%', transition: { duration, ease: 'linear' } },
    animate: { width: '99%', transition: { duration, ease: 'linear' } }
  };
  const carVariants = {
    initial: { left: '0%', transition: { duration, ease: 'linear' } },
    animate: {
      left: 'calc(100% - 110px)',
      transition: { duration, ease: 'linear' }
    }
  };

  return (
    <div tw='max-w-layout w-full mx-auto px-5 flex flex-col items-center justify-center h-screen -translate-y-20'>
      <BigTitle text={propOr('Идет процесс проверки', processName, processTitle)} twStyle={tw`mb-[88px]`} />
      <div tw='flex flex-col w-full space-y-3'>
        <div tw='h-[4px] bg-secondary-inverted relative rounded-full mb-[24px]'>
          <LayoutGroup>
            <motion.img
              src={CarIcon}
              alt='camry'
              width={109}
              height={22}
              tw='absolute bottom-1.5'
              layoutId='car'
              variants={carVariants}
              initial='initial'
              animate='animate'
            />
            <motion.div
              tw='absolute top-0 left-0 bottom-0 h-[4px] bg-button transition rounded-full'
              layout
              variants={variants}
              initial='initial'
              animate='animate'
              onAnimationComplete={onCompleteAnimation}
            />
          </LayoutGroup>
        </div>
        <motion.div>{`${progress}%`}</motion.div>
        <Title text={`${progress}%`} twStyle={tw`text-green self-center`} variant='bold' />
      </div>
    </div>
  );
};

export { ProcessWsPage };
*/
