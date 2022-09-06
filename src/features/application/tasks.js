import { createAsyncThunk } from '@reduxjs/toolkit';

import { applyMainStatus, applyMainVerify } from '@/features/api/apply-main';
import { decodeToken } from '@/features/auth/tasks';

export const createApplication = createAsyncThunk(
  'application/createApplication',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      console.log(data);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const verifyLoan = createAsyncThunk(
  'application/verifyLoan',
  async ({ uuid, code, utm_params }, { dispatch, rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await dispatch(applyMainVerify.endpoints.applyVerify.initiate({ uuid, code, utm_params }));

      if (data) {
        const tokenInfo = await dispatch(decodeToken(data.access));
        await dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: data.uuid }));
        return fulfillWithValue({ ...data, ...tokenInfo.payload });
      }
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);
