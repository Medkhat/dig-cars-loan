import 'twin.macro';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { inc, propOr } from 'ramda';
import React, { useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAsync, useInterval } from 'react-use';
import tw from 'twin.macro';

import CarIcon from '@/assets/images/camry.svg';
import CheckRounded from '@/assets/images/icons/CheckRounded';
import wheel from '@/assets/images/wheel-anim-cropped.gif';
import { BigTitle, SubBody, Title } from '@/components';
import { applyMainStatus } from '@/features/api/apply-main';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid, getVehicleImageByType } from '@/features/application/selectors';
import { getCommonStatus, getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetCommonStatus } from '@/features/status/slice';
import { fetchProcessPageApi } from '@/features/status/tasks';
import { carImageTypes, commonStatuses } from '@/helper/constants';

const processTitle = {
  PRE_SCORE: 'Идет процесс проверки',
  CALCULATE_INSURANCE: 'Идет процесс проверки',
  BORROWER_SCORE: 'Идет процесс проверки'
};

const styles = {
  message: status => [
    tw`flex space-x-3 items-center`,
    status === 'done' && tw`text-green`,
    status === 'active' && tw`text-primary`,
    status === 'wait' && tw`text-secondary opacity-50`
  ]
};

const ProcessWsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [duration, setDuration] = useState(1000);

  const commonStatus = useSelector(getCommonStatus);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));
  const flowUuid = useSelector(getFlowUuid);
  const carLoader = useSelector(getVehicleImageByType(carImageTypes.SIDE_VIEW_SMALL));

  const [progress, setProgress] = useState(1);
  const [messages, setMessages] = useState(() =>
    currentStep === 'CALCULATE_INSURANCE' && step.flow_type !== 'CLIENT_TO_CLIENT_WITHOUT_CAR'
      ? [
          { status: 'done', progressStart: 0, progressEnd: 0, message: 'Личность успешно подтверждена' },
          { status: 'wait', progressStart: 0, progressEnd: 5, message: 'Внутренние проверки Банка' },
          { status: 'wait', progressStart: 35, progressEnd: 75, message: 'Внешние проверки Банка' }
        ]
      : [
          { status: 'wait', progressStart: 0, progressEnd: 5, message: 'Внутренние проверки Банка' },
          { status: 'wait', progressStart: 35, progressEnd: 75, message: 'Внешние проверки Банка' }
        ]
  );

  useAsync(async () => {
    await dispatch(fetchProcessPageApi({ step: currentStep, uuid: flowUuid }));
  }, [currentStep, flowUuid]);

  useGetDataStreamingQuery({ url: step?.socket_url, step: currentStep }, { skip: !step?.socket_url });

  useAsync(async () => {
    if (step.is_final) {
      await dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
      if (!step.is_success) setDuration(80);
    }
  }, [step.is_final]);

  useEffect(() => {
    if (commonStatus === commonStatuses.DONE) {
      setDuration(80);
    }
  }, [commonStatus]);

  useInterval(() => {
    if (progress < 99) {
      setProgress(value => inc(value));
      messages.map(item => {
        if (progress > item.progressEnd) {
          item.status = 'done';
        } else if (progress > item.progressStart && progress < item.progressEnd) {
          item.status = 'active';
        }
      });
    }
  }, duration);

  useEffect(() => {
    if (progress === 99) {
      if (commonStatus !== commonStatuses.PROGRESS) {
        dispatch(resetCommonStatus());
        step?.route && navigate(step?.route);
      }
    }
  }, [progress, commonStatus, step]);

  const variants = {
    initial: { width: '0%', transition: { ease: 'linear' } },
    animate: ({ progress, duration }) => ({
      width: `${progress}%`,
      transition: { duration: duration / 1000, ease: 'linear' }
    })
  };
  const carVariants = {
    initial: { left: '10%', x: -160, transition: { ease: 'linear' } },
    animate: ({ progress, duration }) => ({
      left: progress > 10 ? `${progress}%` : '10%',
      x: -100,
      transition: { duration: progress < 10 ? 2 : duration / 1000, ease: 'linear' }
    })
  };
  const whiteLine = {
    initial: { x: -200, width: '0%' },
    animate: { x: 0, width: '100%', transition: { duration: 1.5, ease: 'easeOut' } }
  };

  return (
    <Div100vh tw='max-w-layout w-full mx-auto px-5 flex flex-col items-center justify-center h-screen -translate-y-1'>
      <motion.div initial={{ y: 180 }} animate={{ y: 0 }} transition={{ duration: 0.7 }} tw='text-center'>
        <SubBody text='Пожалуйста подождите' twStyle={tw`text-secondary`} />
        <BigTitle
          text={propOr('Идет процесс проверки', currentStep, processTitle)}
          twStyle={tw`mb-[88px] text-center`}
        />
      </motion.div>
      <div tw='flex flex-col w-full'>
        <LayoutGroup>
          <motion.div
            tw='h-[4px] bg-secondary-inverted relative rounded-full mb-[32px]'
            variants={whiteLine}
            initial='initial'
            animate='animate'
            layout
          >
            <motion.img
              src={carLoader ? carLoader : CarIcon}
              alt='camry'
              width={109}
              height={22}
              tw='absolute bottom-1.5'
              layoutId='car'
              variants={carVariants}
              initial='initial'
              animate='animate'
              custom={{ progress, duration }}
            />
            <motion.div
              tw='absolute top-0 left-0 bottom-0 h-[4px] bg-button transition rounded-full'
              layout
              variants={variants}
              initial='initial'
              animate='animate'
              custom={{ progress, duration }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} tw='self-center'>
            <Title text={`${progress}%`} twStyle={tw`text-green`} variant='bold' />
          </motion.div>

          <motion.ul
            tw='flex flex-col space-y-5 h-[250px] max-w-[400px] m-auto w-full self-center mt-8 sm:mt-16 translate-x-5  sm:translate-x-8'
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.2, delayChildren: 0.9, staggerChildren: 0.9 }
            }}
          >
            <AnimatePresence>
              {messages.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5 * i, delay: 10 * i } }}
                >
                  <div css={styles.message(item.status)} tw='flex justify-start pl-4 sm:pl-7 lg:pl-10'>
                    {(item.status === 'wait' || item.status === 'active') && (
                      <span>
                        <img src={wheel} width={40} alt='wheel' tw='h-5/6' />
                        {/*<Loader variant='small' />*/}
                      </span>
                    )}
                    {item.status === 'done' && (
                      <span
                        css={item.status === 'done' ? tw`visible` : tw`invisible`}
                        tw='w-[40px] flex justify-center'
                      >
                        <CheckRounded />
                      </span>
                    )}
                    <span>{item.message}</span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>
    </Div100vh>
  );
};

export { ProcessWsPage };
