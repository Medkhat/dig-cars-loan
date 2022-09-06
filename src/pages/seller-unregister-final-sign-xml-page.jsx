import 'twin.macro';

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';

import { Backdrop, Modal } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { applyMainStatus } from '@/features/api/apply-main';
import { useSellerUnregisterFinalSignXmlMutation } from '@/features/api/seller-unregister';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid } from '@/features/application/selectors';
import { getTokenSelector } from '@/features/auth/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { flowStatuses, flowSteps } from '@/helper/constants';
import BiometryBackdropContent from '@/views/biometry-backdrop-content';
import CommonBiometry from '@/views/common-biometry';

const SellerUnregisterFinalSignXmlPage = () => {
  const dispatch = useDispatch();
  const { isMobile } = useContext(DeviceInfoContext);

  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);
  const [urlForRedirect, setUrlForRedirect] = useState('');

  const flowUuid = useSelector(getFlowUuid);
  const token = useSelector(getTokenSelector);

  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));
  const finalSign = useSelector(getStepByName(flowSteps.SELLER_UNREGISTER_FINAL_SIGN));

  const [fetchBiometry, { isLoading }] = useSellerUnregisterFinalSignXmlMutation();

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
    fetchBiometry({ uuid: flowUuid, step: step.step });
    setIsOpenBackdrop(true);
  };

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
          <BiometryBackdropContent fetchBiometry={step.redirect_url} disabled={!finalSign.redirect_url} />
        </Backdrop>
      ) : (
        <Modal
          open={isOpenBackdrop}
          setOpen={setIsOpenBackdrop}
          title='Видеоидентификация'
          twStyle={tw`rounded-2xl !p-0`}
          headerStyle={tw`p-5 pb-0`}
        >
          <BiometryBackdropContent fetchBiometry={step.redirect_url} disabled={!finalSign.redirect_url} />
        </Modal>
      )}
    </>
  );
};
export default SellerUnregisterFinalSignXmlPage;
