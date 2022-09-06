import React from 'react';
import tw from 'twin.macro';

// TextVariant = 'regular' | 'bold';

const textVariants = {
  bold: tw`font-bold`,
  regular: tw`font-normal`
};

const styles = {
  text: ({ variant = 'regular', twStyle }) => [tw`text-s18`, textVariants[variant], twStyle]
};

export const SubTitle = ({ text, variant, twStyle }) => {
  return <h4 css={styles.text({ variant, twStyle })}>{text}</h4>;
};
