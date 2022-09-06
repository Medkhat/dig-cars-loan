import React from 'react';
import tw from 'twin.macro';

import WarningIcon from '@/assets/images/icons/WarningIcon';
import { BodyText, Button, Modal, SubBody } from '@/components';

const ChangeTarifModal = ({ open, setOpen }) => {
  return (
    <Modal open={open} setOpen={setOpen} headerStyle={tw`hidden`} twStyle={tw`!p-0 rounded-2xl`}>
      <div tw='w-[270px] rounded-2xl bg-secondary'>
        <div tw='flex flex-col space-y-2 bg-primary p-5 justify-center items-center pt-7 text-center rounded-t-2xl'>
          <WarningIcon />
          <BodyText text={'Информация'} variant='bold' twStyle={tw`text-center pt-5`} />
          <SubBody
            text={
              'Внимание, поменялись условия кредитования, изменились данные по сумме займа, ставке и ежемесячному платежу.'
            }
            twStyle={tw`text-secondary`}
          />
        </div>
        <div tw='bg-secondary  gap-[1px] mt-[1px] rounded-2xl text-center'>
          <div tw='bg-primary p-5 px-2 rounded-bl-2xl'>
            <Button variant='link' twStyle={tw`text-primary`} onClick={() => setOpen(false)}>
              {'ОК'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeTarifModal;
