import { createSlice } from '@reduxjs/toolkit';
import { compose, mergeDeepRight, path, pick } from 'ramda';
import { PURGE } from 'redux-persist';

import { applyMain } from '@/features/api/apply-main';
import { verifyLoan } from '@/features/application/tasks';
import { authBorrower, authCoborrower, authSeller, authSpouse, fetchVerify } from '@/features/auth/tasks';
import { userTypes } from '@/helper/constants';

const initialState = {
  type: null,
  full_name: '',
  iin: '',
  mobile_phone: '',
  gender: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(verifyLoan.fulfilled, (state, { payload }) => {
        state.full_name = payload?.full_name;
        state.iin = payload?.iin;
        state.mobile_phone = payload?.mobile_phone;
        state.gender = payload?.gender;
        state.type = userTypes.BORROWER;
      })
      .addCase(fetchVerify.fulfilled, (state, { payload }) => {
        state.full_name = payload?.full_name;
        state.iin = payload?.iin;
        state.mobile_phone = payload?.mobile_phone;
        state.gender = payload?.gender;
        state.type = userTypes.BORROWER;
      })
      .addCase(authBorrower.fulfilled, (state, { payload }) => {
        state.full_name = payload?.full_name;
        state.mobile_phone = payload?.mobile_phone;
        state.gender = payload?.gender;
        state.type = userTypes.BORROWER;
      })
      .addCase(authSeller.fulfilled, (state, { payload }) => {
        state.full_name = payload?.full_name;
        state.mobile_phone = payload?.mobile_phone;
        state.gender = payload?.gender;
        state.type = userTypes.SELLER;
      })
      .addCase(authCoborrower.fulfilled, (state, { payload }) => {
        state.full_name = payload?.full_name;
        state.mobile_phone = payload?.mobile_phone;
        state.gender = payload?.gender;
        state.type = userTypes.COBORROWER;
      })
      .addCase(authSpouse.fulfilled, (state, { payload }) => {
        state.full_name = payload?.full_name;
        state.mobile_phone = payload?.mobile_phone;
        state.gender = payload?.gender;
        state.type = userTypes.SPOUSE;
      })
      .addCase(PURGE, () => initialState)
      .addMatcher(applyMain.endpoints.applyMain.matchPending, (state, action) => {
        const newData = compose(pick(['iin', 'mobile_phone']), path(['meta', 'arg', 'originalArgs', 'body']))(action);
        return mergeDeepRight(state, newData);
      });
  }
});

export const {} = userSlice.actions;

export default userSlice.reducer;
