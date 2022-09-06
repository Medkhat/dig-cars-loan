import React from 'react';
import tw from 'twin.macro';

// TextVariant = 'regular' | 'bold';

const textVariants = {
  bold: tw`font-bold`,
  regular: tw`font-normal`
};

const styles = {
  text: ({ variant = 'regular', twStyle }) => [tw`text-s12 text-left`, textVariants[variant], twStyle]
};

export const Caption = ({ text, variant, twStyle }) => {
  return <p css={styles.text({ variant, twStyle })}>{text}</p>;
};
