import React, { useContext } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';

import Camry from '@/assets/images/icons/Camry';
import ShieldFF from '@/assets/images/icons/ShieldFF';
import logo from '@/assets/images/logo.svg';
import logoWhite from '@/assets/images/logo-white.svg';
import AppleIcon from '@/assets/images/social/AppleIcon';
import PlayMarketIcon from '@/assets/images/social/PlayMarketIcon';
import { BigTitle, BodyText, Button, Modal, SubBody, Title } from '@/components';
import ShowConfetti from '@/components/confetti';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { ThemeContext } from '@/contexts/theme-context';
import { useActualParamsQuery, useVehicleParamsQuery } from '@/features/api/credits';
import { getFlowUuid, getLeadUuid, getVehicleParams } from '@/features/application/selectors';
import { getCalculationData } from '@/features/calculation/selectors';
import ConditionModalContent from '@/views/condition-modal-content';

const MainSuccessPage = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { isMobile } = useContext(DeviceInfoContext);
  const vehicleParams = useSelector(getVehicleParams);
  const calculationData = useSelector(getCalculationData);

  const flowUuid = useSelector(getFlowUuid);
  const leadUuid = useSelector(getLeadUuid);

  useVehicleParamsQuery({ flow_uuid: flowUuid }, { skip: !flowUuid });
  useActualParamsQuery({ lead_uuid: leadUuid }, { skip: !leadUuid });

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div tw='relative overflow-hidden md:static min-h-[80vh] flex flex-col space-y-4 p-5 sm:pt-0  2xl:pl-[110px] lg:mt-[50px]'>
        <div>
          <div tw='overflow-hidden'>
            <div
              tw='absolute w-[500px] h-[500px] translate-x-[250px]  bg-green rounded-full right-0 sm:translate-x-[50px]'
              style={{ zIndex: -5 }}
            >
              {!isMobile && <Camry />}
            </div>
          </div>
          <div tw='flex flex-col space-y-4'>
            <img src={theme === 'dark' ? logo : logoWhite} alt='logo' tw='sm:hidden' width={188} height={34} />
            <BigTitle
              text={
                <span>
                  Поздравляем! <br /> Машина теперь <br /> Ваша!
                </span>
              }
            />
            {/* <BigTitle
              text={
                <span>
                  Поздравляем, <br /> кредит оформлен! <br /> Машина теперь Ваша!
                </span>
              }
            /> */}
            {/* <BodyText text={<span>Оплатите первоначальный взнос в продавцу</span>} /> */}
            {!isMobile && (
              <div onClick={handleClick} onKeyDown={handleClick} aria-hidden='true' tw='cursor-pointer pt-4'>
                <Button variant='link' twStyle={tw`underline`}>
                  Смотреть условия
                </Button>
              </div>
            )}
            <div tw='flex justify-end'>{isMobile && <Camry />}</div>
          </div>
        </div>
        <div className='flex flex-col space-y-6 sm:pt-[200px] md:pt-[150px]'>
          <div className='mt-5'>
            {isMobile && (
              <div onClick={handleClick} onKeyDown={handleClick} aria-hidden='true' tw='cursor-pointer mb-5'>
                <Button variant='link' twStyle={tw`underline`}>
                  Смотреть условия
                </Button>
              </div>
            )}
            <div className='flex items-center space-x-3'>
              <ShieldFF />
              <Title text='FFIN Bank App' variant='bold' />
            </div>
          </div>
          <div>
            <BodyText text='Будьте в курсе всех своих операций по Цифровому Автокредитованию в режиме реального времени!' />
          </div>

          <div className='flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-3 w-full'>
            <div className='flex items-center justify-center space-x-3 border border-green px-5 py-4 rounded-2xl w-full sm:w-[240px] '>
              <AppleIcon />
              <div className='flex flex-col'>
                <SubBody text='Доступно в' />
                <BodyText text='Apple Store' variant='bold' />
              </div>
            </div>
            <div className='flex items-center justify-center space-x-3 border border-green px-5 py-4 rounded-2xl w-full sm:w-[240px] cursor-pointer'>
              <PlayMarketIcon />
              <div className='flex flex-col'>
                <SubBody text='Доступно в' />
                <BodyText text='Google Play' variant='bold' />
              </div>
            </div>
          </div>
        </div>

        <Modal
          title='Условия займа'
          twStyle={tw`!p-0 sm:rounded-2xl`}
          setOpen={setOpen}
          open={open}
          headerStyle={tw`p-5 bg-secondary mb-[1px] sm:rounded-t-2xl`}
        >
          <ConditionModalContent vehicleParams={vehicleParams} calculationData={calculationData} />
        </Modal>
      </div>
      <ShowConfetti />
    </>
  );
};
export default MainSuccessPage;
