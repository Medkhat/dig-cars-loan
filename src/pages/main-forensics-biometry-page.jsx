import 'twin.macro';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';

import { Backdrop, Modal } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import {
  applyMainStatus,
  useForensicsBiometryMutation,
  useValidateForensicsBiometryMutation
} from '@/features/api/apply-main';
import { useGetDataStreamingQuery } from '@/features/api/ws-data';
import { getFlowUuid, getStepUuid } from '@/features/application/selectors';
import { getTokenSelector } from '@/features/auth/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { flowSteps } from '@/helper/constants';
import BiometryBackdropContent from '@/views/biometry-backdrop-content';
import CommonBiometry from '@/views/common-biometry';
import Loader from '@/views/loader';

const MainForencicsPage = () => {
  const dispatch = useDispatch();
  const { isMobile } = useContext(DeviceInfoContext);

  const [isOpenBackdrop, setIsOpenBackdrop] = useState(false);
  const [urlForRedirect, setUrlForRedirect] = useState('');
  const currentStep = useSelector(getCurrentStep);
  const flowUuid = useSelector(getFlowUuid);
  const step = useSelector(getStepByName(currentStep));
  const forensicsStep = useSelector(getStepByName(flowSteps.BIOMETRY_FORENSICS));
  const stepUuid = useSelector(getStepUuid);
  const token = useSelector(getTokenSelector);

  console.log(flowUuid);

  useGetDataStreamingQuery({ url: step.socket_url, step: step.step }, { skip: !step.socket_url });
  const [fetchBiometry, { isLoading, data }] = useForensicsBiometryMutation();
  const [fetchValidateBiometry, { isSuccess }] = useValidateForensicsBiometryMutation();

  useEffect(() => {
    if (step?.is_final) {
      dispatch(
        applyMainStatus.endpoints.applyStatus.initiate(
          { uuid: flowUuid },
          {
            forceRefetch: true
          }
        )
      );
    }
  }, [isSuccess, step, step?.is_final]);

  const openBackdrop = async () => {
    await fetchBiometry({ uuid: flowUuid, step: step?.step });
    setIsOpenBackdrop(true);
  };

  const fetchForensics = useCallback(() => {
    OzLiveness.open({
      token: data?.oz_liveness_access_token,
      meta: {
        ff_autocred: data?.step_uuid
      },
      lang: 'ru',
      action: ['video_selfie_scan'],
      params: {
        extract_best_shot: true
      },
      on_complete: async function (result) {
        await fetchValidateBiometry({ uuid: data?.step_uuid, step: step?.step });
        setIsOpenBackdrop(false);
        OzLiveness.close();
      }
    });
  }, [data, step, fetchValidateBiometry]);

  if (step?.is_loading) {
    return <Loader />;
  }

  return (
    <>
      <CommonBiometry
        title={
          <span>
            Видеоидентификация <br /> личности
          </span>
        }
        subtitle='Пройти видеоидентификацию'
        verifyBiometry={openBackdrop}
        biometryUrl={`${window.location.origin}/?user_type=BORROWER&token=${token}`}
        loading={false}
      />
      {isMobile ? (
        <Backdrop isOpen={isOpenBackdrop} setIsOpen={setIsOpenBackdrop}>
          <BiometryBackdropContent fetchBiometry={null} forensics={fetchForensics} disabled={false} />
        </Backdrop>
      ) : (
        <Modal
          open={isOpenBackdrop}
          setOpen={setIsOpenBackdrop}
          title='Видеоидентификация'
          twStyle={tw`rounded-2xl !p-0`}
          headerStyle={tw`p-5 pb-0`}
        >
          <BiometryBackdropContent fetchBiometry={null} forensics={fetchForensics} disabled={false} />
        </Modal>
      )}
    </>
  );
};
export default MainForencicsPage;
