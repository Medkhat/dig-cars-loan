import 'twin.macro';

import React from 'react';
import tw from 'twin.macro';

const styles = {
  text: ({ twStyle }) => [tw`text-s30 font-bold`, twStyle]
};

export const BigTitle = ({ text, twStyle }) => {
  return <h1 css={styles.text({ twStyle })}>{text}</h1>;
};
