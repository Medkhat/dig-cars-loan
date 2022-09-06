import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

export const spouseAgreement = api.injectEndpoints({
  endpoints: build => ({
    spouseAgreement: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/spouse-agreement/${uuid}/spouse-sign/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useSpouseAgreementMutation } = spouseAgreement;

export const spouseDocuments = api.injectEndpoints({
  endpoints: build => ({
    spouseDocuments: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/spouse-agreement/${uuid}/documents/`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useSpouseDocumentsQuery } = spouseDocuments;

export const spouseCancel = api.injectEndpoints({
  endpoints: build => ({
    spouseCancel: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/spouse-agreement/${uuid}/cancel/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useSpouseCancelMutation } = spouseCancel;
