import { propOr } from 'ramda';
import React from 'react';
import CurrencyFormat from 'react-currency-format';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import tw from 'twin.macro';

import car from '@/assets/images/car.png';
import CalcIcon from '@/assets/images/icons/CarIcon';
import CashIcon from '@/assets/images/icons/CashIcon';
import ClockIcon from '@/assets/images/icons/ClockIcon';
import PercentIcon from '@/assets/images/icons/PercentIcon';
import { Button, Caption, ContainerBlock, SubBody, SubTitle } from '@/components';
import { applyMainStatus } from '@/features/api/apply-main';
import { getFlowUuid, getVehicleImageByType } from '@/features/application/selectors';
import { getCalculationData } from '@/features/calculation/selectors';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetCommonStatus } from '@/features/status/slice';
import { carImageTypes, flowSteps } from '@/helper/constants';
import { LongBlock } from '@/views/long-block';
import AddSellerBlock from '@/views/main-add-seller-block';
import RejectCreditBlock from '@/views/reject-credit-block';

const CarInfoPage = () => {
  const {
    state: { data }
  } = useLocation();
  const dispatch = useDispatch();

  const flowUuid = useSelector(getFlowUuid);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));
  const carLoader = useSelector(getVehicleImageByType(carImageTypes.SIDE_VIEW_LIGHTS));

  const calculationData = useSelector(getCalculationData);

  const getStatus = async () => {
    dispatch(resetCommonStatus());
    dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
  };

  return (
    <>
      <div tw='relative py-2'>
        <div tw='flex flex-col space-y-3 mb-3'>
          <div tw='flex flex-col space-y-1 p-5 pb-0 md:pt-0'>
            <SubTitle text='Уважаемый Тимур Русланович!' variant='bold' />
            <SubBody text='Предварительная оценка авто составила:' twStyle={tw`text-secondary`} />
          </div>

          <div className='space-y-0.5'>
            <div className='grid grid-cols-2 gap-[1px] bg-primary'>
              <LongBlock
                above='Стоимость авто'
                text={
                  <CurrencyFormat
                    value={propOr(0, 'price_avg', data)}
                    displayType={'text'}
                    thousandSeparator=' '
                    suffix=' ₸'
                  />
                }
                icon={<CashIcon variant='secondary' />}
                twStyle={tw`p-5 sm:rounded-t-2xl col-span-2`}
              />
              <LongBlock
                above='VIN авто'
                text={propOr(0, 'vin', data)}
                icon={<CashIcon variant='main' />}
                twStyle={tw`p-5`}
              />
              <LongBlock
                above='Объем'
                text={`${data?.engine_volume} л.`}
                icon={<PercentIcon />}
                twStyle={tw`p-5 sm:rounded-none`}
              />
              <LongBlock
                above='Год выпуска'
                text={data?.year}
                icon={<CalcIcon />}
                twStyle={tw`p-5 sm:rounded-bl-2xl`}
              />
              <LongBlock
                above='Страна'
                text={data?.production_country}
                icon={<ClockIcon />}
                twStyle={tw`p-5 sm:rounded-br-2xl`}
              />
            </div>
          </div>
          <ContainerBlock title={`${data?.master_brand} ${data?.master_model}`}>
            <Caption
              text={`${data?.engine_volume} л. • ${data?.year} • ${data?.production_country}`}
              twStyle={tw`text-secondary`}
            />
            <img src={carLoader ? carLoader : car} alt='auto_blank' tw='self-center pb-4' />
          </ContainerBlock>
        </div>
        {currentStep !== flowSteps.ADDITIONAL_BORROWER_SCORE && <AddSellerBlock flowUuid={flowUuid} step={step} />}
        <div className='text-center space-y-3 px-5 mt-5 pt-5 sm:px-0 sm:flex sm:space-y-0 sm:flex-row-reverse md:items-center pb-10 md:pb-[230px]'>
          {currentStep !== flowSteps.ADDITIONAL_BORROWER_SCORE && (
            <div className='flex-1 md:ml-2 md:w-[337px]'>
              <Button
                type='submit'
                disabled={!(step.step === flowSteps.CONSTRUCTOR)}
                loading={step.step === flowSteps.SELLER_SCORE || step.step === flowSteps.OPEN_BORROWER_ACCOUNT}
                variant='primary'
                onClick={getStatus}
              >
                Продолжить
              </Button>
            </div>
          )}
          <div>
            <RejectCreditBlock flowUuid={flowUuid} />
          </div>
        </div>
      </div>
    </>
  );
};
export default CarInfoPage;
