import React from 'react';
import tw from 'twin.macro';

import WarningIcon from '@/assets/images/icons/WarningIcon';
import { BodyText, Button, Modal, SubBody } from '@/components';

const DeliveryModal = ({
  open,
  setOpen,
  confirmHandler,
  cancelHandler,
  title,
  caption,
  successBtnText,
  cancelBtnText
}) => {
  return (
    <Modal open={open} setOpen={setOpen} headerStyle={tw`hidden`} twStyle={tw`!p-0 rounded-2xl`}>
      <div tw='w-[365px] rounded-2xl bg-secondary'>
        <div tw='flex flex-col space-y-2 bg-primary p-5 justify-center items-center pt-7 text-center rounded-t-2xl'>
          <WarningIcon />
          <BodyText
            text={title || 'Доставка осуществляется в городах: Нур-Султан, Алматы, Павлодар.'}
            variant='bold'
            twStyle={tw`text-center pt-5`}
          />
          <SubBody
            text={
              caption ||
              'Подтверждая, Вы даете согласие на то, что курьер заберет гос. номер и тех.паспорт с СЦОН и выполнит передачу лично в руки владельцу.'
            }
            twStyle={tw`text-secondary`}
          />
        </div>
        <div tw='bg-secondary grid grid-cols-2 gap-[1px] mt-[1px] rounded-2xl text-center'>
          <div tw='bg-primary p-5 px-2 rounded-bl-2xl'>
            <Button variant='link' twStyle={tw`text-primary`} onClick={confirmHandler}>
              {successBtnText || 'Подтверждаю'}
            </Button>
          </div>
          <div tw='bg-primary p-5 rounded-br-2xl'>
            <Button variant='link' onClick={cancelHandler}>
              {cancelBtnText || 'Нет, отмена'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryModal;
