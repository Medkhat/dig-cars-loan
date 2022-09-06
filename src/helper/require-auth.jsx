import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { isAuthSelector } from '@/features/auth/selectors';

export const RequireAuth = ({ children }) => {
  const isAuth = useSelector(isAuthSelector);
  const location = useLocation();

  if (!isAuth) {
    window.open(import.meta.env.DEV ? import.meta.env.AC_DEV_LANDING : import.meta.env.AC_PROD_LANDING, '_self');
    return <></>;
  }

  return children;
};
