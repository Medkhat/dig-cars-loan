import { createSelector } from '@reduxjs/toolkit';
const authBaseSelectors = state => state.auth;

export const isAuthSelector = createSelector([authBaseSelectors], state => state.isAuth);
export const getTokenSelector = createSelector([authBaseSelectors], state => state.access);
export const getAppLoading = createSelector([authBaseSelectors], state => state.appLoading);
export const getActiveApplication = createSelector([authBaseSelectors], state => state.hasActiveApplication);
