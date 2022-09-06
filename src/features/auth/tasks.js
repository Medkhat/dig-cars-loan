import { createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import { PURGE } from 'redux-persist';

import { applyAuthVerify } from '@/features/api/apply-auth';

export const decodeToken = createAsyncThunk('auth/decodeToken', async (token, { rejectWithValue }) => {
  try {
    return await jwt_decode(token);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchVerify = createAsyncThunk('auth/fetchVerify', async (verifyData, { dispatch, rejectWithValue }) => {
  const { data, error } = await dispatch(applyAuthVerify.endpoints.verifyAuth.initiate(verifyData));
  //TODO: Протестировать неуспешный ответ!!!
  if (error) {
    toast.error('Неверный код', {
      hideProgressBar: true
    });
    throw rejectWithValue(error);
  }
  const tokenInfo = await dispatch(decodeToken(data.access));
  return { ...data, ...tokenInfo.payload };
});

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  dispatch({ type: PURGE, key: 'persist:auth', result: () => null });
});

export const authBorrower = createAsyncThunk('auth/authBorrower', async (token, { dispatch, rejectWithValue }) => {
  try {
    const tokenInfo = await dispatch(decodeToken(token));

    return { ...tokenInfo.payload, token };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const authSeller = createAsyncThunk('auth/authSeller', async (token, { dispatch, rejectWithValue }) => {
  try {
    const tokenInfo = await dispatch(decodeToken(token));

    return { ...tokenInfo.payload, token };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const authCoborrower = createAsyncThunk('auth/authCoborrower', async (token, { dispatch, rejectWithValue }) => {
  try {
    const tokenInfo = await dispatch(decodeToken(token));

    return { ...tokenInfo.payload, token };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const authSpouse = createAsyncThunk('auth/authSpouse', async (token, { dispatch, rejectWithValue }) => {
  try {
    const tokenInfo = await dispatch(decodeToken(token));

    return { ...tokenInfo.payload, token };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});
