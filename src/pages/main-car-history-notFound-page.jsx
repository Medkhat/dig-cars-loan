import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import CarIcon from '@/assets/images/carIcon.svg';
import { Button, Caption, ContainerBlock, SubTitle } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { carNumbersSelector } from '@/features/carHistory/selectors';
import { clearFields } from '@/features/carHistory/slice';

function MainCarHistoryNotFoundPage() {
  const { isMobile } = useContext(DeviceInfoContext);
  const dispatch = useDispatch();
  const carData = useSelector(carNumbersSelector);
  const lead_uuid = useSelector(state => state.application.lead_uuid);
  const access = useSelector(state => state.auth.access);
  const navigate = useNavigate();

  const handleClick = () => {
    isMobile ? navigate(`/car-history?uuid=${lead_uuid}&token=${access}`) : window.location.reload();
    dispatch(clearFields());
  };
  return (
    <div>
      <div tw='flex flex-col items-center justify-center w-full pt-[8vh]'>
        <img src={CarIcon} alt='' />
        <SubTitle text='Авто не найдено' twStyle={tw`mt-3 text-s30 font-bold`} />
        <Caption
          text='Автомобиль по запросу не найден.   Проверьте данные'
          twStyle={tw`text-dark-grey text-s14 text-center w-[70%] leading-s22 mt-3`}
        />
        <ContainerBlock twStyle={tw`w-[90%] rounded-s20 mt-5`}>
          <div>
            <Caption text='Гос. номер' twStyle={tw`text-dark-grey`} />
            <SubTitle text={carData.grnz} twStyle={tw`leading-6`} />
          </div>
          <div>
            <Caption text='Номер тех. паспорта' twStyle={tw`text-dark-grey`} />
            <SubTitle text={carData.srts} twStyle={tw`leading-6`} />
          </div>
        </ContainerBlock>
        <Button variant='shadow' twStyle={tw`w-[90%] rounded-s20 mt-4 `} onClick={handleClick}>
          Попробовать снова
        </Button>
      </div>
    </div>
  );
}

export default MainCarHistoryNotFoundPage;
