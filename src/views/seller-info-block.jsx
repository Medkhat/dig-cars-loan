import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import tw from 'twin.macro';

import { BodyText, SubBody } from '@/components';
import { getUserGender } from '@/features/user/selectors';
import { capitalizeText } from '@/helper';

const SellerInfoBlock = ({ fullName = 'test', borrower, vehicle }) => {
  const userGender = useSelector(getUserGender);
  const { pathname } = useLocation();

  console.log(pathname);
  return (
    <>
      <div>
        <BodyText text={`Уважаем${userGender === 'MALE' ? 'ый' : 'ая'}, ${fullName}!`} variant='bold' />
      </div>
      <div className='mt-2'>
        {/*<SubBody
          text={`Ваш контакт указан в качестве ${
            String(pathname).startsWith('/seller/') ? 'продавца' : 'созаемщика'
          }, `}
          twStyle={tw`text-secondary`}
        />*/}
        <SubBody
          text={
            String(pathname).startsWith('/seller/') ? (
              <span>
                В Freedom Finance Bank поступил запрос на автокредитование от{' '}
                <span tw='text-secondary'>
                  {capitalizeText(borrower?.full_name ? borrower?.full_name : 'test test')}
                </span>{' '}
                для покупки вашего авто
                <span tw='font-bold text-primary'>
                  <br />
                  {` ${vehicle?.brand} ${vehicle?.model} ${vehicle?.year}, ${vehicle?.color}. `}
                  <br />
                </span>
                Если все верно, пожалуйста, пройдите видеоидентификацию для подтверждения личности и права собственности
                на указанное авто.
              </span>
            ) : (
              <span>
                <span tw='text-secondary'>
                  {capitalizeText(borrower?.full_name ? borrower?.full_name : 'test test')}
                </span>{' '}
                указал ваш контакт в качестве созаемщика для получения автокредитования.
                <br />
                <br />
                Если вы согласны, пожалуйста, пройдите видеоидентификацию для подтверждения личности.
              </span>
            )
          }
          twStyle={tw`text-secondary`}
        />
      </div>
    </>
  );
};
export default SellerInfoBlock;
