import React, { useState } from 'react';
import tw from 'twin.macro';

import DropDownIcon from '@/assets/images/dropdownBlockIcon.svg';
import { Caption } from '@/components/caption';
import { ContainerBlock } from '@/components/container-block';
import { SubTitle } from '@/components/sub-title';
import { normalizeDate } from '@/helper';

function DropdownBlock({ number, date_register, owner_type, register_address, status }) {
  const [active, setActive] = useState(number === 1 ? true : false);
  return (
    <div>
      <ContainerBlock>
        <button type='button' tw='flex items-center justify-between' onClick={() => setActive(!active)}>
          <span tw=' text-[1rem] font-bold mb-0'>Владелец №{number}</span>
          <img
            src={DropDownIcon}
            alt=''
            style={{
              transform: active ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>
      </ContainerBlock>
      <div
        style={{
          display: active ? 'block' : 'none'
        }}
      >
        <div tw='border-solid border-b-[1px] border-grey pl-5 py-3 w-full'>
          <Caption text='Дата регистрации' twStyle={tw`text-dark-grey `} />
          <SubTitle text={normalizeDate(date_register)} twStyle={tw`leading-3 font-bold text-s14`} />
        </div>
        <div tw='border-solid border-b-[1px] border-grey pl-5 py-3 w-full'>
          <Caption text='Тип владельца' twStyle={tw`text-dark-grey `} />
          <SubTitle
            text={owner_type === 'PHYSICAL' ? 'Физ. лицо' : 'Юр. лицо'}
            twStyle={tw`leading-3 font-bold text-s14`}
          />
        </div>
        <div tw='border-solid border-b-[1px] border-grey pl-5 py-4 w-full'>
          <Caption text='Регистрация' twStyle={tw`text-dark-grey `} />
          <SubTitle text={status === 'S' ? 'Снят с учета' : 'На учете'} twStyle={tw`leading-3 font-bold text-s14`} />
        </div>
        <div tw='border-solid border-b-[1px] border-grey pl-5 py-4 w-full'>
          <Caption text='Место регистрации' twStyle={tw`text-dark-grey `} />
          <SubTitle text={register_address} twStyle={tw`leading-3 font-bold text-s14`} />
        </div>
      </div>
    </div>
  );
}

export default DropdownBlock;
