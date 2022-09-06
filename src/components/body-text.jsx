import React from 'react';
import tw from 'twin.macro';

// TextVariant = 'regular' | 'bold';

const textVariants = {
  bold: tw`font-bold tracking-normal`,
  regular: tw`font-normal`
};

const styles = {
  text: ({ variant = 'regular', twStyle }) => [tw`text-s16 text-left`, textVariants[variant], twStyle]
};

export const BodyText = ({ text, variant, twStyle }) => {
  return <span css={styles.text({ variant, twStyle })}>{text}</span>;
};
