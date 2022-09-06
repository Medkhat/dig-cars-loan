import React from 'react';
import tw from 'twin.macro';

import { BodyText } from '@/components/body-text';

import { Caption } from './caption';

const styles = {
  container: ({ twStyle, disabled }) => [
    tw`p-5 bg-secondary flex flex-col space-y-4 sm:rounded-2xl`,
    twStyle,
    disabled && tw`opacity-50 cursor-not-allowed`
  ]
};

const ContainerBlock = ({ children, twStyle, title, subtitle, titleStyle, disabled = false }) => {
  return (
    <div css={styles.container({ twStyle, disabled })}>
      {title && (
        <div tw='flex flex-col'>
          <BodyText text={title} variant='bold' twStyle={titleStyle} />
          {subtitle && <Caption text={subtitle} twStyle={tw`text-secondary`} />}
        </div>
      )}
      {children}
    </div>
  );
};

export { ContainerBlock };
