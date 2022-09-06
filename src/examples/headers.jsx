import 'twin.macro';

import React from 'react';

import { Number } from '@/components';

const Headers = () => {
  return (
    <div>
      <div tw='flex flex-col space-y-3'>
        <Number value='1' status='active' />
        <Number value='2' status='completed' />
        <Number value='3' />
      </div>
    </div>
  );
};

export { Headers };
