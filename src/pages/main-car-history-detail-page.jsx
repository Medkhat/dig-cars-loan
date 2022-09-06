import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import Freedom from '@/assets/images/FreedomIcon.svg';
import { BiArrowRightShort } from '@/assets/images/icons/BiArrowRightShort';
import DownloadIcon from '@/assets/images/icons/DownloadIcon';
import ShareIcon from '@/assets/images/icons/ShareIcon';
import Logo from '@/assets/images/Logo';
import { Backdrop, BigTitle, Button, Caption, ContainerBlock, SubTitle } from '@/components';
import Share from '@/components/share';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { clearFields } from '@/features/carHistory/slice';
import { normalizeDate } from '@/helper';
import DropdownBlock from '@/views/dropdown-block';
import { landingURL } from '@/app/API-Url';

const noInfo = '-';

function MainCarHistoryDetailPage() {
  const dispatch = useDispatch();
  const { isMobile, isTablet } = useContext(DeviceInfoContext);
  const navigate = useNavigate();
  const vehicleInfo = useSelector(state => state.carHistory.vehicleInfo);
  const [open, setOpen] = useState(false);

  const handleClickBack = () => {
    navigate(-1);
    dispatch(clearFields());
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(vehicleInfo?.pdf_file);
    !isMobile &&
      toast.success('Скопировано!', {
        hideProgressBar: true
      });
    setOpen(true);
  };

  return (
    <div>
      {isMobile || isTablet ? (
        <Backdrop
          title='Поделиться через...'
          isOpen={open}
          setIsOpen={setOpen}
          twStyle={tw`p-0 bg-primary`}
          headerStyle={tw`bg-secondary p-5 mb-3 flex items-center justify-between`}
        >
          <Share link={vehicleInfo?.pdf_file} />
        </Backdrop>
      ) : (
        <></>
      )}
      <div
        tw='flex items-center gap-2 p-3'
        style={{
          display: isMobile ? 'flex' : 'none'
        }}
      >
        <BiArrowRightShort tw='rotate-[180deg] text-s30' onClick={handleClickBack} />
        <span tw='text-s14'>История владения авто</span>
        <div tw='ml-6'>
          <Logo tw='flex-1' onClick={() => window.open(landingURL)} />
        </div>
      </div>
      <div>
        {vehicleInfo?.image && (
          <div tw='flex flex-col justify-center items-center mt-7 mb-5'>
            <img src={vehicleInfo?.image} alt='CarImage' />
          </div>
        )}
        <div tw='p-5'>
          <Caption text={vehicleInfo?.vehicle.mark} twStyle={tw`text-dark-grey`} />
          <BigTitle text={vehicleInfo?.vehicle.model} />
        </div>
        <div tw='flex justify-between gap-1 '>
          <ContainerBlock twStyle={tw`w-[33%] justify-center px-[1rem] py-[1rem] rounded-[0]`}>
            <Caption text='Год выпуска' twStyle={tw`text-dark-grey`} />
            <SubTitle text={vehicleInfo?.vehicle.year} twStyle={tw`leading-3 font-bold`} />
          </ContainerBlock>
          <ContainerBlock twStyle={tw`w-[33%] justify-center px-[1rem] py-[1rem]`}>
            <Caption text='Цвет кузова' twStyle={tw`text-dark-grey `} />
            <SubTitle text={vehicleInfo?.vehicle.color} twStyle={tw`leading-3 font-bold`} />
          </ContainerBlock>
          <ContainerBlock twStyle={tw`w-[33%] justify-center px-[1rem] py-[1rem]`}>
            <Caption text='Страна' twStyle={tw`text-dark-grey`} />
            <SubTitle text={vehicleInfo?.vehicle.production_country || noInfo} twStyle={tw`leading-3 font-bold`} />
          </ContainerBlock>
        </div>
        <div tw='block my-3 px-3'>
          <a href={vehicleInfo?.pdf_file} tw='flex-1' target='_blank' rel='noreferrer'>
            <Button variant='shadow' twStyle={tw`rounded-[0.7rem] mb-2`}>
              <div tw='w-full flex items-center justify-between gap-2'>
                <DownloadIcon />
                <span>Скачать отчет</span>
              </div>
            </Button>
          </a>
          <Button variant='shadow' twStyle={tw`rounded-[0.7rem] flex-1`} onClick={handleCopyToClipboard}>
            <div tw='w-full flex items-center justify-between gap-2'>
              <ShareIcon />
              <span>Поделиться</span>
            </div>
          </Button>
        </div>
        <div>
          <SubTitle text='Общая информация' twStyle={tw` p-5 font-bold`} />
          <div tw='flex flex-col gap-1'>
            <ContainerBlock twStyle={tw`py-[0.8rem]`}>
              <Caption text='Дата первичной постановки на учет РК' twStyle={tw`text-dark-grey `} />
              <SubTitle
                text={normalizeDate(vehicleInfo?.first_registration)}
                twStyle={tw`leading-3 font-bold text-s14`}
              />
            </ContainerBlock>
            <ContainerBlock twStyle={tw`py-[0.8rem]`}>
              <Caption text='Тип топлива' twStyle={tw`text-dark-grey `} />
              <SubTitle text={vehicleInfo?.vehicle.fuel_type || noInfo} twStyle={tw`leading-3 font-bold text-s14`} />
            </ContainerBlock>
            <ContainerBlock twStyle={tw`py-[0.8rem]`}>
              <Caption text='Газовое оборудование' twStyle={tw`text-dark-grey `} />
              <SubTitle
                text={vehicleInfo?.is_gas ? 'Имеется' : 'Не имеется'}
                twStyle={tw`leading-3 font-bold text-s14`}
              />
            </ContainerBlock>
            <ContainerBlock twStyle={tw`py-[0.8rem]`}>
              <Caption text='Наличие совладельцов' twStyle={tw`text-dark-grey `} />
              <SubTitle
                text={vehicleInfo?.co_owners ? 'Имеется' : 'Не имеется'}
                twStyle={tw`leading-3 font-bold text-s14`}
              />
            </ContainerBlock>
            <ContainerBlock twStyle={tw`py-[0.8rem]`}>
              <Caption text='Наличие обременения' twStyle={tw`text-dark-grey `} />
              <SubTitle
                text={
                  vehicleInfo?.encumbrance_type && vehicleInfo?.has_limit ? 'Состоит в залоге' : 'В залоге не состоит'
                }
                twStyle={tw`leading-3 font-bold text-s14`}
              />
            </ContainerBlock>
            <ContainerBlock twStyle={tw`py-[0.8rem]`}>
              <Caption text='Мощность двигателя' twStyle={tw`text-dark-grey `} />
              <SubTitle text={`${vehicleInfo?.motor_power} KW`} twStyle={tw`leading-3 font-bold text-s14`} />
            </ContainerBlock>
            <ContainerBlock twStyle={tw`py-[0.8rem]`}>
              <Caption text='Особые отметки' twStyle={tw`text-dark-grey `} />
              <SubTitle text={vehicleInfo?.special_marks} twStyle={tw`leading-3 font-bold text-s14`} />
            </ContainerBlock>
          </div>
        </div>
        <div>
          <SubTitle text={`Количество регистрации: ${vehicleInfo?.register_count}`} twStyle={tw`p-5 font-bold`} />
          <div tw='flex flex-col gap-1'>
            {vehicleInfo?.additional_info.map((item, index) => (
              <DropdownBlock key={item.id} number={index + 1} {...item} />
            ))}
          </div>

          {/* parseInt(vehicleInfo?.vehicle.price_median) > 0 && (
            <div tw='mt-5'>
              <SubTitle text='Онлайн оценка' twStyle={tw`p-5 font-bold`} />
              <ContainerBlock>
                <BigTitle text={`${new Intl.NumberFormat('ru-KZ').format(vehicleInfo?.vehicle.price_median)} тг`} />
                <Caption
                  text='Онлайн оценка была проведена с учетом данных авто из гос. органа. Она может измениться после проверки продавца'
                  twStyle={tw`text-dark-grey text-s14 leading-5`}
                />
                <a href='https://auto.bankffin.kz/'>
                  <Button variant='secondary'>Подать заявку</Button>
                </a>
                <div tw='flex items-start gap-1'>
                  <img src={Freedom} alt='' tw='' />
                  <Caption
                    text='Данное авто может быть профинансировано Freedom Bank'
                    twStyle={tw`text-s14 text-dark-grey`}
                  />
                </div>
              </ContainerBlock>
            </div>
          )*/}
        </div>
      </div>
    </div>
  );
}

export default MainCarHistoryDetailPage;
