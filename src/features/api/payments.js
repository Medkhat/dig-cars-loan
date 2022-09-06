import { APIUrl } from '@/app/API-Url';
import { api } from '@/app/backAPI';

const paymentsCallback = api.injectEndpoints({
  endpoints: build => ({
    paymentsCallback: build.query({
      query: data => ({ url: `${APIUrl}payments/callback/`, method: 'GET', params: data }),
      transformResponse: response => response.data
    })
  })
});

export const { useLazyPaymentsCallbackQuery } = paymentsCallback;
