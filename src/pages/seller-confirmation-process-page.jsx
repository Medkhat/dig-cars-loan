import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import { PURGE } from 'redux-persist';
import tw from 'twin.macro';

import { Title } from '@/components';
import { applyMainStatus } from '@/features/api/apply-main';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getCommonStatus, getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetCommonStatus } from '@/features/status/slice';
import { fetchSellerConfirmationPageApi } from '@/features/status/tasks';
import { commonStatuses, flowStatuses, flowSteps } from '@/helper/constants';
import SellerConfirmationBlock from '@/views/seller-confirmation-block';

const getUIStatus = step => {
  if (step?.is_loading) {
    return 'Осуществляется проверка на стороне гос. органа...';
  }
  if (step?.is_success) {
    return 'Проверка на стороне гос. органа завершена, штрафов или налогов не найдено.';
  }

  return step?.status_reason;
};

const SellerConfirmationProcessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const flowUuid = useSelector(getFlowUuid);

  const commonStatus = useSelector(getCommonStatus);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));
  const vehicleValidationInfo = useSelector(getStepByName(flowSteps.SELLER_AUTO_VALIDATION));
  const openSellerAccountInfo = useSelector(getStepByName(flowSteps.OPEN_SELLER_ACCOUNT));

  useAsync(async () => {
    await dispatch(fetchSellerConfirmationPageApi({ step: currentStep, uuid: flowUuid }));
  }, [currentStep, flowUuid]);

  useEffect(() => {
    if (step.is_final && step?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [step]);

  useEffect(() => {
    if (commonStatus === commonStatuses.DONE) {
      dispatch(resetCommonStatus());
    }
  }, [commonStatus]);

  useGetDataStreamingQuery({ url: step.socket_url, step: currentStep }, { skip: !step.socket_url });

  const completeSellerFlow = () => {
    dispatch({ type: PURGE, result: () => null });
    window.open('https://bankffin.kz', '_self');
    // navigate('/seller/confirmation-success');
  };

  return (
    <div className='seller-confirmation-process-page'>
      <div className='p-5'>
        <Title text='Идет процесс подтверждения ...' twStyle={tw`text-secondary text-s14`} />
      </div>
      <SellerConfirmationBlock
        className='sm:rounded-t-2xl'
        title='Видеоидентификация успешно пройдена!'
        complete={true}
      />
      <SellerConfirmationBlock
        title='Право собственности подтверждено!'
        body={getUIStatus(vehicleValidationInfo)}
        loading={vehicleValidationInfo.is_loading}
        complete={vehicleValidationInfo.is_final}
        error={vehicleValidationInfo.status_reason}
      />
      <SellerConfirmationBlock
        title='Текущий счет успешно открыт!'
        body={openSellerAccountInfo.status_reason}
        loading={openSellerAccountInfo.is_loading}
        complete={openSellerAccountInfo.is_final}
        error={openSellerAccountInfo.status_reason}
      />
      {/*<div className='w-full my-5 sm:p-0 fixed sm:static bottom-5 text-center sm:text-right'>
        <Button
          variant='primary'
          caption='Будет выполнен переход на сайт Банка'
          onClick={completeSellerFlow}
          disabled={!isFinalResult}
        >
          Завершить
        </Button>
      </div>*/}
    </div>
  );
};
export default SellerConfirmationProcessPage;
