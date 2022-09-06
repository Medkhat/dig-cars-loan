import 'twin.macro';

import React from 'react';
import tw from 'twin.macro';

const styles = {
  text: ({ twStyle }) => [tw`text-[30px] md:text-[50px] leading-[35px] font-bold md:leading-[60px]`, twStyle]
};

export const HugeTitle = ({ text, twStyle }) => {
  return <h1 css={styles.text({ twStyle })}>{text}</h1>;
};
