import { createSlice } from '@reduxjs/toolkit';
import { pick } from 'ramda';
import { PURGE } from 'redux-persist';

import { applyMainVerify } from '@/features/api/apply-main';
import { verifyLoan } from '@/features/application/tasks';
import { authBorrower, authCoborrower, authSeller, authSpouse, fetchVerify } from '@/features/auth/tasks';

const initialState = {
  access: null,
  refresh: null,
  token_info: null,
  isAuth: false,
  appLoading: false,
  hasActiveApplication: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAppLoading: (state, { payload }) => {
      state.appLoading = payload;
    },
    setHasActiveApplication: (state, { payload }) => {
      state.hasActiveApplication = payload;
    },
    setDataFromCarHistory: (state, { payload }) => {
      state.access = payload;
      state.isAuth = true;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchVerify.fulfilled, (state, { payload }) => {
        state.access = payload.access;
        state.refresh = payload.refresh;
        state.token_info = pick(['exp', 'iat'], payload);
        state.isAuth = true;
      })
      .addCase(verifyLoan.fulfilled, (state, { payload }) => {
        state.refresh = payload.refresh;
        state.isAuth = true;
      })
      .addCase(authBorrower.fulfilled, (state, { payload }) => {
        state.access = payload?.token;
        state.isAuth = true;
      })
      .addCase(authSeller.fulfilled, (state, { payload }) => {
        state.access = payload?.token;
        state.isAuth = true;
      })
      .addCase(authCoborrower.fulfilled, (state, { payload }) => {
        state.access = payload?.token;
        state.isAuth = true;
      })
      .addCase(authSpouse.fulfilled, (state, { payload }) => {
        state.access = payload?.token;
        state.isAuth = true;
      })
      .addCase(PURGE, () => initialState)
      .addMatcher(applyMainVerify.endpoints.applyVerify.matchFulfilled, (state, { payload }) => {
        state.access = payload.access;
      });
  }
});

export const { setAppLoading, setHasActiveApplication, setDataFromCarHistory } = authSlice.actions;

export default authSlice.reducer;
