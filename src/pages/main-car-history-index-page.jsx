import 'twin.macro';

import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Footer from '@/components/footer';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { fetchVehicleHistoryStatus, fetchVehicleInfo } from '@/features/api/car-history';
import * as slice from '@/features/application/slice';
import { setDataFromCarHistory } from '@/features/auth/slice';
import MainCarHistoryDetailPage from '@/pages/main-car-history-detail-page';
import CarHistorycheck from '@/views/carHistory-check';
import { MainHeader } from '@/views/main-header';

import MainCarHistoryFailedPage from './main-car-history-failed-page';
import MainCarHistoryLoadingPage from './main-car-history-loading-page';
import MainCarHistoryNotFoundPage from './main-car-history-notFound-page';

const MainCarHistoryPage = () => {
  const dispatch = useDispatch();
  const { isMobile } = useContext(DeviceInfoContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const lead_uuid = useSelector(state => state.application.lead_uuid);
  const grnz = useSelector(state => state.carHistory.grnz);
  const statusData = useSelector(state => state.carHistory.statusData);
  const vehicleInfo = useSelector(state => state.carHistory.vehicleInfo);
  const vehicleInfoError = useSelector(state => state.carHistory.vehicleInfoError);

  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params) {
      dispatch(setDataFromCarHistory(params.get('token')));
      dispatch(slice.setLeadUuid(params.get('uuid')));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval;
    if (isLoading) {
      const fetchStatus = () => {
        dispatch(fetchVehicleHistoryStatus(lead_uuid));
      };
      interval = setInterval(fetchStatus, 2000);
    }

    if (interval) setIntervalId(interval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isMobile]);

  useEffect(() => {
    if (statusData?.status_lead === 'True') {
      dispatch(fetchVehicleInfo({ lead_uuid, grnz }));
      clearInterval(intervalId);
    }
    if (statusData?.status_lead === 'False') {
      setNotFound(true);
      setIsLoading(false);
      clearInterval(intervalId);
      if (isMobile) navigate('/car-history/notFound');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusData]);

  useEffect(() => {
    if (vehicleInfo || vehicleInfoError) setIsLoading(false);
    if (isMobile && vehicleInfo) navigate('/car-history/detail');
    if (vehicleInfoError && vehicleInfoError.code === 'NOT-FOUND') {
      setNotFound(true);
      if (isMobile) navigate('/car-history/notFound');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleInfo, vehicleInfoError, isMobile]);

  return (
    <Fragment>
      {isMobile ? (
        <Fragment>
          <MainHeader isCarHistory={true} />
          {isLoading ? (
            <MainCarHistoryLoadingPage />
          ) : (
            <CarHistorycheck setIsLoading={setIsLoading} setNotFoun={setNotFound} setError={setError} />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <MainHeader isCarHistory={true} />
          <div tw='grid grid-cols-2 w-[60%] mx-auto gap-[5rem] mt-5 items-start'>
            <CarHistorycheck setIsLoading={setIsLoading} setNotFound={setNotFound} setError={setError} />
            {isLoading && <MainCarHistoryLoadingPage />}
            {Boolean(vehicleInfo) && <MainCarHistoryDetailPage />}
            {error && <MainCarHistoryFailedPage />}
            {notFound && <MainCarHistoryNotFoundPage />}
          </div>
          <Footer />
        </Fragment>
      )}
    </Fragment>
  );
};

export default MainCarHistoryPage;
