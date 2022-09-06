import 'twin.macro';

import React from 'react';
import Iframe from 'react-iframe';

const UdvModalContent = ({ url = '' }) => {
  return (
    <div tw='w-full pb-5 sm:rounded-b-2xl'>
      <Iframe width='100%' tw='min-h-[80vh]' url={url} />
    </div>
  );
};
export default UdvModalContent;
