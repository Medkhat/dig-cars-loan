import 'twin.macro';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getVehicleImageByType } from '@/features/application/selectors';
import { carImageTypes } from '@/helper/constants';

const Camry = () => {
  const [on, setOn] = useState(false);

  const carLoader = useSelector(getVehicleImageByType(carImageTypes.SIDE_VIEW_LIGHTS));

  useEffect(() => {
    const interval = setInterval(() => {
      setOn(!on);
    }, 600);
    return () => clearInterval(interval);
  }, [on]);

  return (
    <img
      src={
        carLoader
          ? carLoader
          : 'https://dev-auto.trafficwave.kz/api/media/LandCruiserPrado_400x178_LightON_grey-%D0%B2%D0%B8%D0%B4_%D1%81_%D0%B1%D0%BE%D0%BA%D1%83.webp'
      }
      alt='Car'
      width={465}
      tw='relative md:absolute right-0 top-[30%] translate-x-[20px] sm:translate-x-0'
      style={{ zIndex: -4 }}
    />
  );
};

// relative sm:absolute top-0 translate-x-[60px] sm:top-[150px] right-[0] md:top-[230px] xl:top-[300px] 2xl:top-[350px] 3xl:top-[650px]
export default Camry;
