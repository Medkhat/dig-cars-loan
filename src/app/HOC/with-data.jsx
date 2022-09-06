import React from 'react';

import Loader from '@/views/loader';

export const withData = (Component, fn, argsForFn = '') => {
  return function HOCWithData(props) {
    const { data, isLoading } = fn(argsForFn);

    if (isLoading) {
      return <Loader />;
    }

    return <Component data={data} {...props} />;
  };
};
