import React, { createContext, useEffect, useState } from 'react';

import { calculateDeviceInfo } from '@/helper/calculate-device-info';

export const DeviceInfoContext = createContext(calculateDeviceInfo(window.innerWidth, window.innerHeight));

export const DeviceInfoProvider = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState(calculateDeviceInfo(window.innerWidth, window.innerHeight));

  //console.log({ deviceInfo });

  useEffect(() => {
    const onResize = () => {
      const newDeviceInfo = calculateDeviceInfo(window.innerWidth, window.innerHeight);

      setDeviceInfo(newDeviceInfo);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [deviceInfo]);

  return <DeviceInfoContext.Provider value={deviceInfo}>{children}</DeviceInfoContext.Provider>;
};
