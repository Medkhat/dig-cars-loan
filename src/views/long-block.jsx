import React from 'react';
import tw from 'twin.macro';

import { Caption, SubTitle } from '@/components';

/*LongBlockProps {
  text: string;
  textSuffix?: string;
  above?: string;
  below?: string;
}*/

//  relative top-[8px]

const LongBlock = ({ text, textSuffix, above, below, icon, twStyle, iconStyle, belowStyle }) => {
  const styles = {
    container: ({ twStyle }) => [twStyle, tw`flex items-center space-x-2 flex-1 bg-secondary`]
  };

  return (
    <div css={styles.container({ twStyle })}>
      {icon && (
        <div tw='bg-primary p-1 rounded-full relative bottom-[4px]' css={[iconStyle, below && tw`bottom-0`]}>
          {icon}
        </div>
      )}
      <div tw='flex-col justify-between items-center'>
        {above && <Caption text={above || ''} twStyle={tw`text-secondary leading-[14px]`} />}
        <span tw='flex items-end space-x-2'>
          <SubTitle text={text} variant='bold' twStyle={tw`text-s16 relative top-[2px]`} />
          {textSuffix && <Caption text={textSuffix} />}
        </span>
        {below && <Caption text={below || ''} twStyle={tw`text-secondary leading-5`} />}
      </div>
    </div>
  );
};

export { LongBlock };
