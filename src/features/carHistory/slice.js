import { createSlice } from '@reduxjs/toolkit';

import { fetchVehicleHistoryStatus, fetchVehicleInfo } from '@/features/api/car-history';

const initialState = {
  numbers: {},
  grnz: '',
  statusData: null,
  statusError: null,
  vehicleInfo: null,
  vehicleInfoError: null
};

export const carHistorySlice = createSlice({
  name: 'carHistorySlice',
  initialState,
  reducers: {
    addNumbers(state, action) {
      state.numbers = action.payload;
    },
    isSubmitted(state, action) {
      state.isSubmitted = action.payload;
    },
    setGrnz: (state, action) => {
      state.grnz = action.payload;
    },
    clearFields: (state, { payload }) => {
      if (payload) {
        state[payload] = null;
      } else {
        state.numbers = {};
        state.grnz = '';
        state.statusData = null;
        state.statusError = null;
        state.vehicleInfo = null;
        state.vehicleInfoError = null;
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchVehicleHistoryStatus.fulfilled, (state, action) => {
      state.statusData = action.payload;
    });
    builder.addCase(fetchVehicleHistoryStatus.rejected, (state, action) => {
      state.statusError = action.payload;
    });
    builder.addCase(fetchVehicleInfo.fulfilled, (state, action) => {
      state.vehicleInfo = action.payload;
    });
    builder.addCase(fetchVehicleInfo.rejected, (state, action) => {
      state.vehicleInfoError = action.payload;
    });
  }
});

export const { addNumbers, isSubmitted, setGrnz, clearFields } = carHistorySlice.actions;

export default carHistorySlice.reducer;
