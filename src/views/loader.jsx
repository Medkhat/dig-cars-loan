import 'twin.macro';

import React from 'react';

import wheel from '@/assets/images/wheel-anim-cropped.gif';

const Loader = ({ variant = 'initial', twStyle }) => {
  return (
    <>
      {variant === 'initial' && (
        <div tw='flex justify-center items-center h-5/6'>
          <img src={wheel} alt='wheel' css={[twStyle && twStyle]} />
        </div>
      )}
      {variant === 'small' && (
        <i>
          <img src={wheel} width={40} alt='wheel' />
        </i>
      )}
      {variant === 'middle' && (
        <i>
          <img src={wheel} width={100} alt='wheel' />
        </i>
      )}
    </>
  );
};

export default Loader;
