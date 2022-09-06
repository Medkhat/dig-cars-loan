/*
import 'twin.macro';

import { motion } from 'framer-motion';
import { compose, converge, equals, findIndex, identity, inc, nth, propOr, split } from 'ramda';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInterval, useUpdate } from 'react-use';
import tw from 'twin.macro';

import CarIcon from '@/assets/images/camry.svg';
import { BigTitle, Title } from '@/components';
import Wrapper from '@/components/wrapper';
import { useMainFlowCheckStatus } from '@/contexts/main-flow-check-status-context';
import { clearWsUrl } from '@/features/apply-main/slice';
import { useGetDataStreamingQuery } from '@/features/ws-data/api';
import { isFinal, isSuccess } from '@/features/ws-data/selectors';
import { clearWsData } from '@/features/ws-data/slice';

const defineProcess = url => {
  return compose(converge(nth, [compose(inc, findIndex(equals('sub'))), identity]), split('/'))(url);
};

const processTitle = {
  PRE_SCORE: 'Идет процесс проверки',
  CALCULATE_INSURANCE: 'Идет процесс проверки',
  BORROWER_SCORE: 'Идет процесс проверки'
};

const ProcessWsPage = () => {
  const update = useUpdate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { refetch } = useMainFlowCheckStatus();

  const isSuccessResult = useSelector(isSuccess);
  const isFinalResult = useSelector(isFinal);

  const duration = 5;

  const [progress, setProgress] = useState(0);
  // const progress = useMotionValue(0);

  //const [progress, setProgress] = useState(0);

  console.log({ progress });

  useInterval(() => {
    if (progress < 50) {
      setProgress(val => inc(val));
    }
  }, 1000);

  /!* useEffect(() => {
    !state?.url && navigate('/main', { replace: true });
  }, [state, navigate]);*!/

  /!* useEffect(() => {
    if (progress === 100) {
      dispatch(clearWsUrl());
      dispatch(clearWsData());
      refetch();
    }
  }, [progress, refetch]);*!/

  useGetDataStreamingQuery(state?.url, { skip: !state?.url });

  const variants = {
    start: { width: '0%', transition: { duration: duration } },
    process: { width: `${progress}%`, transition: { duration: duration } },
    carStart: { left: '0%', transition: { duration: duration } },
    car: {
      left: `calc(${progress}%-100px)`,
      transition: { duration: duration }
    }
  };

  const processName = useMemo(() => state?.step, [state]);

  useEffect(() => {
    if (processName === 'BORROWER_SCORE' && isFinalResult) {
      setProgress(100);
      refetch();
    }
  }, [processName]);

  console.log(processName);

  useEffect(() => {
    if (processName !== 'BORROWER_SCORE' && (isSuccessResult || isFinalResult)) {
      dispatch(clearWsUrl());
      dispatch(clearWsData());
      refetch();
    }
  }, [isSuccessResult, isFinalResult]);

  return (
    <Wrapper twStyles={tw`flex flex-col items-center justify-center h-screen space-y-16 -translate-y-20 px-5`}>
      <BigTitle text={propOr('Идет процесс проверки', processName, processTitle)} />
      <div tw='flex flex-col w-full space-y-3'>
        <div tw='h-[4px] bg-secondary-inverted relative rounded-full'>
          <motion.img
            src={CarIcon}
            alt='camry'
            width={109}
            height={22}
            tw='absolute bottom-1.5'
            layout
            variants={variants}
            initial='carStart'
            animate='car'
          />
          <motion.div
            tw='absolute top-0 left-0 bottom-0 h-[4px] bg-button transition rounded-full'
            variants={variants}
            initial='start'
            animate='process'
          />
        </div>
        <Title text={`${progress}%`} twStyle={tw`text-green self-center`} variant='bold' />
      </div>
    </Wrapper>
  );
};

export { ProcessWsPage };
*/
