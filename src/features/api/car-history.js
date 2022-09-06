import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

const runVehicle = api.injectEndpoints({
  endpoints: build => ({
    runVehicle: build.mutation({
      query: body => {
        const { lead_uuid, ...payload } = body;
        return {
          url: `${APIUrl}/history/${lead_uuid}/run-vehicle/`,
          method: 'POST',
          body: payload
        };
      },
      transformResponse: response => response.data
    })
  })
});
export const { useRunVehicleMutation } = runVehicle;

const vehicleHistoryStatus = api.injectEndpoints({
  endpoints: build => ({
    vehicleHistoryStatus: build.mutation({
      query: lead_uuid => {
        return {
          url: `${APIUrl}/history/${lead_uuid}/vehicle-history-status/`,
          method: 'GET'
        };
      },
      transformResponse: response => response.data
    })
  })
});

export const fetchVehicleHistoryStatus = createAsyncThunk(
  'car-history/status',
  async (lead_uuid, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await dispatch(vehicleHistoryStatus.endpoints.vehicleHistoryStatus.initiate(lead_uuid));
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const vehicleInfo = api.injectEndpoints({
  endpoints: build => ({
    vehicleInfo: build.mutation({
      query: body => {
        const { lead_uuid, ...payload } = body;
        return {
          url: `${APIUrl}/history/${lead_uuid}/vehicle-info/`,
          method: 'POST',
          body: payload
        };
      },
      transformResponse: response => response.data
    })
  })
});

export const fetchVehicleInfo = createAsyncThunk('car-history/info', async (payload, { rejectWithValue, dispatch }) => {
  try {
    const response = await dispatch(vehicleInfo.endpoints.vehicleInfo.initiate(payload));
    if (response.error) throw response.error;
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
