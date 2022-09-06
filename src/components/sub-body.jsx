import React from 'react';
import tw from 'twin.macro';

// TextVariant = 'regular' | 'bold';

const textVariants = {
  bold: tw`font-bold`,
  regular: tw`font-normal`
};

const styles = {
  text: ({ variant = 'regular', twStyle, color }) => [tw`text-s14`, textVariants[variant], twStyle, color]
};

export const SubBody = ({ text, variant, twStyle, color }) => {
  return <span css={styles.text({ variant, twStyle, color })}>{text}</span>;
};
