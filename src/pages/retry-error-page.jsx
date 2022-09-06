import React from 'react';
import Div100vh from 'react-div-100vh';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
import tw from 'twin.macro';

import PillarIcon from '@/assets/images/icons/PillarIcon';
import RetryIcon from '@/assets/images/icons/RetryIcon';
import { BigTitle, BodyText, Button, SubBody } from '@/components';
import Wrapper from '@/components/wrapper';
import { getFlowUuid } from '@/features/application/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetStatus } from '@/features/status/slice';

const RetryErrorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const flowUuid = useSelector(getFlowUuid);
  const currentStep = useSelector(getCurrentStep);
  const status = useSelector(getStepByName(currentStep));

  const eventTime = new Date(status?.retry_at * 1000);

  const { seconds, minutes, hours, isRunning, restart } = useTimer({
    expiryTimestamp: eventTime
  });

  console.log(status);

  const handleRetry = () => {
    dispatch(resetStatus({ step: currentStep, flow_type: status?.flow_type }));
    //ispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    restart();
    navigate(status?.route, { replace: true });
  };

  return (
    <Div100vh>
      <Wrapper twStyles={tw`h-screen flex flex-col justify-center items-center -translate-y-20 pt-7 sm:pt-0`}>
        <div tw='flex flex-col justify-center items-center'>
          <div tw='w-[148px] h-[148px] flex flex-col items-center justify-center bg-white rounded-full border border-8 border-[#db3831] relative top-[1px]'>
            <BigTitle
              text={`${hours ? hours + ':' : ''}${minutes < 10 ? '0' + minutes : minutes}:${
                seconds < 10 ? '0' + seconds : seconds
              }`}
              variant='bold'
              twStyle={tw`text-black`}
            />
            <BodyText text={minutes === 0 ? 'секунд' : 'минут'} twStyle={tw`text-black`} />
          </div>
          <PillarIcon />
        </div>

        <div tw='pt-5 text-center'>
          <SubBody
            text={
              status?.status_reason
                ? status?.status_reason
                : 'Возникла ошибка, обратитесь в службу поддержки позвонив на 595.'
            }
            twStyle={tw`text-center text-secondary`}
          />
        </div>
        <div tw='pt-9'>
          <Button
            variant={isRunning ? 'shadow' : 'secondary'}
            twStyle={tw`w-[350px]`}
            disabled={isRunning}
            icon={<RetryIcon twStyle={tw`relative bottom-[2px]`} />}
            onClick={handleRetry}
          >
            Повторить
          </Button>
        </div>
      </Wrapper>
    </Div100vh>
  );
};
export default RetryErrorPage;
