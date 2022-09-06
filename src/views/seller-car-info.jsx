import React from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';

import carIcon from '@/assets/images/car.png';
import { SubBody, SubTitle } from '@/components';
import { getVehicleImageByType } from '@/features/application/selectors';
import { capitalizeFirstLetter } from '@/helper';
import { carImageTypes } from '@/helper/constants';

import CommonPlateNumber from './common-plate-number';

const SellerCarInfo = ({ carInfo }) => {
  const carLoader = useSelector(getVehicleImageByType(carImageTypes.SIDE_VIEW_LIGHTS));

  return (
    <div className='p-5 bg-secondary mt-3 sm:rounded-t-2xl'>
      <SubTitle text='Данные по авто' twStyle={tw`text-s16`} variant='bold' />
      <div className='w-full flex justify-center my-5'>
        <img src={carLoader ? carLoader : carIcon} alt='car icon' />
      </div>
      <div>
        <SubTitle text={carInfo?.vehicle_name} twStyle={tw`text-s18`} variant='bold' />
        <SubBody
          text={`${carInfo?.vehicle_engine_volume}л • ${capitalizeFirstLetter(carInfo?.vehicle_color)}`}
          twStyle={tw`text-secondary`}
        />
        <CommonPlateNumber body={carInfo?.vehicle_grnz} />
      </div>
    </div>
  );
};
export default SellerCarInfo;
