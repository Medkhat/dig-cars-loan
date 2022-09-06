import React from 'react';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import { Button, SubBody, Title } from '@/components';
import SellerAmountInfo from '@/views/seller-amount-info';

const SellerAmountPage = () => {
  const navigate = useNavigate();

  const goToSuccessPage = () => {
    navigate('/seller/success');
  };

  return (
    <>
      <div className='mt-3 space-y-0.5'>
        <SellerAmountInfo title='Штраф' body='0 ₸' />
        <SellerAmountInfo title='Налог' body='0 ₸' />
        <SellerAmountInfo title='Гос.пошлина' body='4500 ₸' />
      </div>
      <div className='p-5'>
        <SubBody text='Итого к оплате' />
        <Title text='4 500 ₸' variant='bold' twStyle={tw`text-s30`} />
      </div>
      <div className='w-full fixed bottom-5 text-center sm:text-right sm:static'>
        <Button variant='primary' onClick={goToSuccessPage}>
          Оплатить 4 500 ₸
        </Button>
      </div>
    </>
  );
};
export default SellerAmountPage;
