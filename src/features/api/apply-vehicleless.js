import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

export const applyVehicleless = api.injectEndpoints({
  endpoints: build => ({
    applyVehicleless: build.mutation({
      query: ({ body }) => ({
        url: `${APIUrl}/apply-vehicleless/`,
        body,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyVehiclelessMutation } = applyVehicleless;

export const applyVehiclelessAddIdentifier = api.injectEndpoints({
  endpoints: build => ({
    applyVehiclelessAddIdentifier: build.mutation({
      query: ({ uuid, body }) => ({
        url: `${APIUrl}/apply-vehicleless/${uuid}/add-identifier`,
        body,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyVehiclelessAddIdentifierMutation } = applyVehiclelessAddIdentifier;

export const applyVehiclelessBackToAddIdentifier = api.injectEndpoints({
  endpoints: build => ({
    applyVehiclelessBackToAddIdentifier: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-vehicleless/${uuid}/back-to-add-identifier`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyVehiclelessBackToAddIdentifierQuery } = applyVehiclelessBackToAddIdentifier;

export const applyVehiclelessBorrowerScore = api.injectEndpoints({
  endpoints: build => ({
    applyVehiclelessBorrowerScore: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-vehicleless/${uuid}/borrower-score`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyVehiclelessBorrowerScoreMutation } = applyVehiclelessBorrowerScore;

export const applyVehiclelessChangeParams = api.injectEndpoints({
  endpoints: build => ({
    applyVehiclelessChangeParams: build.mutation({
      query: ({ uuid, body }) => ({
        url: `${APIUrl}/apply-vehicleless/${uuid}/change-params`,
        method: 'POST',
        body
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyVehiclelessChangeParamsMutation } = applyVehiclelessChangeParams;

export const applyVehiclelessGetCurrentParams = api.injectEndpoints({
  endpoints: build => ({
    applyVehiclelessGetCurrentParams: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-vehicleless/${uuid}/get-current-params`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyVehiclelessGetCurrentParamsQuery } = applyVehiclelessGetCurrentParams;

export const applyVehiclelessGetDecision = api.injectEndpoints({
  endpoints: build => ({
    applyVehiclelessGetDecision: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-vehicleless/${uuid}/get-decision`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyVehiclelessGetDecisionQuery } = applyVehiclelessGetDecision;
