import React from 'react';
import tw from 'twin.macro';

const styles = {
  container: ({ twStyles }) => [tw`max-w-layout w-full mx-auto px-5`, twStyles]
};

const Wrapper = ({ children, twStyles }) => {
  return <div css={styles.container({ twStyles })}>{children}</div>;
};

export default Wrapper;
