import React from 'react';
import tw from 'twin.macro';

import CheckIcon from '@/assets/images/icons/CheckIcon';
import HeroiconsOutlineExclamation from '@/assets/images/icons/HeroiconsOutlineExclamation';
import { BodyText, SubTitle } from '@/components';

import Loader from './loader';

const styles = {
  wrapper: 'flex items-center justify-between p-5 bg-secondary mb-[2px]'
};

const SellerConfirmationBlock = ({ title, body, loading = false, className, complete = false, error = false }) => {
  return (
    <div className={`${className} ${styles.wrapper}`}>
      <div className='confirmation-info'>
        <div className='flex items-center'>
          {loading && <Loader variant='small' />}
          <div css={!complete && !loading && tw`opacity-50`}>
            <SubTitle text={title} twStyle={tw`text-s16`} variant='bold' />
          </div>
        </div>
        <BodyText text={body} twStyle={tw`text-secondary text-s12`} />
      </div>
      {complete && (
        <div>
          <CheckIcon />
        </div>
      )}
      {error && (
        <div tw='p-3'>
          <HeroiconsOutlineExclamation tw='text-red-500' />
        </div>
      )}
    </div>
  );
};
export default SellerConfirmationBlock;
