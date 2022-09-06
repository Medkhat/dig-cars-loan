import 'twin.macro';

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'react-use';
import tw from 'twin.macro';

import { Backdrop, Modal } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { ThemeContext } from '@/contexts/theme-context';
import { applyMainStatus } from '@/features/api/apply-main';
import { useCoBorrowerAgrBiometryMutation } from '@/features/api/co-borrower-';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getTokenSelector } from '@/features/auth/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { flowStatuses, flowSteps } from '@/helper/constants';
import BiometryBackdropContent from '@/views/biometry-backdrop-content';
import CommonBiometry from '@/views/common-biometry';

const CoborrowerBiometryPAge = () => {
  const dispatch = useDispatch();
  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);
  const [urlForRedirect, setUrlForRedirect] = useState('');

  const { isMobile } = useContext(DeviceInfoContext);
  const { theme } = useContext(ThemeContext);

  const flowUuid = useSelector(getFlowUuid);
  const token = useSelector(getTokenSelector);

  const currentStep = useSelector(getCurrentStep);
  const coBorrowerBiometry = useSelector(getStepByName(flowSteps.CO_BORROWER_BIOMETRY));
  const step = useSelector(getStepByName(currentStep));

  const [fetchBiometry, { isLoading }] = useCoBorrowerAgrBiometryMutation();
  console.log(step);
  useGetDataStreamingQuery({ url: step.socket_url, step: step.step }, { skip: !step.socket_url });

  useEffect(() => {
    if (step.is_final && step?.flow_status !== flowStatuses.RETRY_WITHOUT_REDIRECT) {
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [step]);

  useEffect(() => {
    const url = `${window.location.origin}/?user_type=BORROWER&token=${token}`;
    setUrlForRedirect(url);
  }, [token]);

  const openBackdrop = () => {
    setIsOpenBackdrop(true);
  };

  useEffectOnce(() => {
    fetchBiometry({ uuid: flowUuid, step: step.step });
  });

  return (
    <>
      <CommonBiometry
        title={
          <span>
            Видеоидентификация <br /> личности
          </span>
        }
        verifyBiometry={openBackdrop}
        biometryUrl={urlForRedirect}
        loading={isLoading}
      />
      {isMobile ? (
        <Backdrop isOpen={isOpenBackdrop} setIsOpen={setIsOpenBackdrop}>
          <BiometryBackdropContent fetchBiometry={step.redirect_url} disabled={!coBorrowerBiometry.redirect_url} />
        </Backdrop>
      ) : (
        <Modal
          open={isOpenBackdrop}
          setOpen={setIsOpenBackdrop}
          title='Видеоидентификация'
          twStyle={tw`rounded-2xl !p-0`}
          headerStyle={tw`p-5 pb-0`}
        >
          <BiometryBackdropContent fetchBiometry={step.redirect_url} disabled={!coBorrowerBiometry.redirect_url} />
        </Modal>
      )}
    </>
  );
};
export default CoborrowerBiometryPAge;
