import 'twin.macro';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components';
import { useApplySellerCancelMutation } from '@/features/api/apply-seller';
import { logout } from '@/features/auth/tasks';
import ConfirmationModal from '@/views/confirmation-modal';

const SellerRejectCreditBlock = ({ flowUuid }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const [fetchRejectCredit] = useApplySellerCancelMutation();

  const rejectCredit = async () => {
    await fetchRejectCredit({ flowUuid });
    dispatch(logout());
    window.open(import.meta.env.DEV ? import.meta.env.AC_DEV_LANDING : import.meta.env.AC_PROD_LANDING, '_self');
  };

  return (
    <>
      <Button
        type='text'
        variant='text'
        onClick={e => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Отменить заявку
      </Button>
      <ConfirmationModal
        open={open}
        setOpen={setOpen}
        confirmHandler={rejectCredit}
        title='Вы уверены что хотите прервать процесс?'
        caption='Все несохраненные данные будут утеряны'
        successBtnText='Да, прервать'
        cancelBtnText='Нет, отмена'
      />
    </>
  );
};
export default SellerRejectCreditBlock;
