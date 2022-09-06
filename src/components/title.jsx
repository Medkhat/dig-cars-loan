import React from 'react';
import tw from 'twin.macro';

// TextVariant = 'regular' | 'bold';

const textVariants = {
  bold: tw`font-bold`,
  regular: tw`font-normal`
};

const styles = {
  text: ({ variant = 'regular', twStyle }) => [tw`text-s24`, textVariants[variant], twStyle]
};

export const Title = ({ text, variant, twStyle }) => {
  return <h2 css={styles.text({ variant, twStyle })}>{text}</h2>;
};
