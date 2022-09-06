import { createSelector } from '@reduxjs/toolkit';
import { compose, join, map, propOr, split, take, toLower } from 'ramda';

import { toTitle } from '@/helper';
const userBaseSelectors = state => state.user;

export const getUserType = createSelector([userBaseSelectors], state => state.type);
export const getPhoneNumber = createSelector([userBaseSelectors], state => state.mobile_phone);
export const getUserGender = createSelector([userBaseSelectors], state => state.gender);
export const getIin = createSelector([userBaseSelectors], state => state.iin);
export const getFullName = createSelector(
  [userBaseSelectors],
  state =>
    state?.full_name && compose(join(' '), map(toTitle), map(toLower), split(' '), propOr(' ', 'full_name'))(state)
);
export const getShortName = createSelector(
  [userBaseSelectors],
  state =>
    state?.full_name &&
    compose(join(' '), map(toTitle), map(toLower), take(2), split(' '), propOr('', 'full_name'))(state)
);
