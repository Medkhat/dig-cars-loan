import 'twin.macro';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';

import { ContainerBlock } from '@/components';
import { useApplyMainAutoGrnzImageQuery } from '@/features/api/apply-main';
import { getFlowUuid, getVehicleImageByType } from '@/features/application/selectors';
import { carImageTypes } from '@/helper/constants';

const CommonCarFront = ({ carFrontUrl }) => {
  const carLoader = useSelector(getVehicleImageByType(carImageTypes.FRONT_VIEW));
  const flow_uuid = useSelector(getFlowUuid);

  const { refetch } = useApplyMainAutoGrnzImageQuery({ uuid: flow_uuid });

  useEffect(() => {
    if (carFrontUrl) {
      refetch();
    }
  }, [carFrontUrl]);

  return (
    <ContainerBlock twStyle={tw`px-5 sm:rounded-2xl`}>
      <img
        src={carFrontUrl ? carFrontUrl : carLoader}
        alt='car front'
        tw='mx-auto self-center sm:rounded-2xl'
        className='gradient-auto-front'
      />
    </ContainerBlock>
  );
};
export default CommonCarFront;
