import 'twin.macro';

import React from 'react';
import { Link as RLink } from 'react-router-dom';

import { SubBody } from '@/components/sub-body';

const Link = ({ children, href }) => {
  return (
    <RLink to={href} tw='block text-link hover:text-link-hover underline leading-3'>
      <SubBody text={children} />
    </RLink>
  );
};

export { Link };
