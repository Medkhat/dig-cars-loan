import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

export const creditsStatus = api.injectEndpoints({
  endpoints: build => ({
    creditsStatus: build.query({
      query: () => ({ url: `${APIUrl}/credits/status/`, method: 'GET' }),
      transformResponse: response => response.data
    })
  })
});

export const { useCreditsStatusQuery } = creditsStatus;

export const actualParams = api.injectEndpoints({
  endpoints: build => ({
    actualParams: build.query({
      query: ({ lead_uuid }) => ({ url: `${APIUrl}/credits/${lead_uuid}/actual-params/`, method: 'GET' }),
      transformResponse: response => response.data
    })
  })
});

export const { useActualParamsQuery } = actualParams;

export const vehicleParams = api.injectEndpoints({
  endpoints: build => ({
    vehicleParams: build.query({
      query: ({ flow_uuid }) => ({ url: `${APIUrl}/credits/${flow_uuid}/vehicle-params/`, method: 'GET' }),
      transformResponse: response => response.data
    })
  })
});

export const { useVehicleParamsQuery } = vehicleParams;

export const requestedParams = api.injectEndpoints({
  endpoints: build => ({
    requestedParams: build.query({
      query: ({ lead_uuid }) => ({ url: `${APIUrl}/credits/${lead_uuid}/requested-params/`, method: 'GET' }),
      transformResponse: response => response.data
    })
  })
});

export const { useRequestedParamsQuery } = requestedParams;

export const vehicleImages = api.injectEndpoints({
  endpoints: build => ({
    vehicleImages: build.query({
      query: ({ flow_uuid }) => ({ url: `${APIUrl}/credits/${flow_uuid}/vehicle-images/`, method: 'GET' }),
      transformResponse: response => response.data.results
    })
  })
});

export const { useVehicleImagesQuery } = vehicleImages;
