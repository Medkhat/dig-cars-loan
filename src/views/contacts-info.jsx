import React, { useContext } from 'react';
import tw from 'twin.macro';

import PhoneIcon from '@/assets/images/icons/PhoneIcon';
import FacebookIcon from '@/assets/images/social/FacebookIcon';
import InstagramIcon from '@/assets/images/social/InstagramIcon';
import WhatsappIcon from '@/assets/images/social/WhatsappIcon';
import { BigTitle, SubBody } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';

const styles = {
  container: ({ isMobile }) => [
    isMobile
      ? tw`sm:py-0 sm:flex-row flex-col divide-y sm:space-x-6 md:space-x-0 sm:divide-y-0 md:divide-y divide-white-alpha`
      : tw`flex justify-between items-center`
  ],
  item: ({ isMobile }) => [
    tw`py-6`,
    isMobile ? tw`sm:hidden md:flex flex space-x-[32px]` : tw`space-x-[8px] flex sm:hidden md:flex`
  ],
  phone: tw`py-6`
};

const ContactsInfo = () => {
  const { isMobile } = useContext(DeviceInfoContext);

  return (
    <div css={styles.container({ isMobile })} tw='sm:pl-2 md:pl-0'>
      <div css={styles.phone}>
        <div className='flex flex-col'>
          <a href='tel:595'>
            <div className='flex space-x-2'>
              <i tw='mt-1'>
                <PhoneIcon />
              </i>
              <BigTitle text='595' variant='bold' />
            </div>
            <div>
              <SubBody text='Звонок бесплатный' twStyle={tw`text-secondary`} />
            </div>
          </a>
        </div>
      </div>
      <div css={styles.item({ isMobile })}>
        <a href='https://www.instagram.com/bankffin.kz/' target='_blank'>
          <InstagramIcon isMobile={isMobile} />
        </a>
        <a href='https://wa.me/77761595595' target='_blank'>
          <WhatsappIcon isMobile={isMobile} />
        </a>
        <a href='https://www.facebook.com/bankffin.kz/' target='_blank'>
          <FacebookIcon isMobile={isMobile} />
        </a>
      </div>
    </div>
  );
};

export { ContactsInfo };
