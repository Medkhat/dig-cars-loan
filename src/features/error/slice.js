import { createSelector, createSlice } from '@reduxjs/toolkit';

const name = 'errors';

const initialState = {
  errors: []
};

const baseSelector = state => state.errors;
export const getErrors = createSelector([baseSelector], state =>
  state.errors.length > 0
    ? {
        message: state.errors.join(' ')
      }
    : null
);

export const errorSlice = createSlice({
  name,
  initialState,
  reducers: {
    setError(state, { payload }) {
      state.errors.push(payload);
    },
    clearError(state) {
      state.errors = [];
    }
  }
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
