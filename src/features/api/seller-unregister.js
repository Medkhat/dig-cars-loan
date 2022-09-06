import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

export const sellerUnregisterAutoValidation = api.injectEndpoints({
  endpoints: build => ({
    sellerUnregisterAutoValidation: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/seller-unregister-agreement/${uuid}/auto-validation/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useSellerUnregisterAutoValidationMutation } = sellerUnregisterAutoValidation;

export const sellerUnregisterCheckDebt = api.injectEndpoints({
  endpoints: build => ({
    sellerUnregisterCheckDebt: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/seller-unregister-agreement/${uuid}/check-debt/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useSellerUnregisterCheckDebtMutation } = sellerUnregisterCheckDebt;

export const sellerUnregisterFinalSign = api.injectEndpoints({
  endpoints: build => ({
    sellerUnregisterFinalSign: build.mutation({
      query: ({ uuid, save_grnz }) => ({
        url: `${APIUrl}/seller-unregister-agreement/${uuid}/final-sign/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useSellerUnregisterFinalSignMutation } = sellerUnregisterFinalSign;

export const sellerUnregisterFinalSignXml = api.injectEndpoints({
  endpoints: build => ({
    sellerUnregisterFinalSignXml: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/seller-unregister-agreement/${uuid}/final-sign-xml/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useSellerUnregisterFinalSignXmlMutation } = sellerUnregisterFinalSignXml;

export const sellerUnregisterCreditInfo = api.injectEndpoints({
  endpoints: build => ({
    sellerUnregisterCreditInfo: build.query({
      query: ({ uuid }) => ({ url: `${APIUrl}/seller-unregister-agreement/${uuid}/credit-info/` }),
      transformResponse: response => response.data
    })
  })
});

export const { useSellerUnregisterCreditInfoQuery } = sellerUnregisterCreditInfo;

export const sellerUnregisterDocuments = api.injectEndpoints({
  endpoints: build => ({
    sellerUnregisterDocuments: build.query({
      query: ({ uuid }) => ({ url: `${APIUrl}/seller-unregister-agreement/${uuid}/documents/` }),
      transformResponse: response => response.data
    })
  })
});

export const { useSellerUnregisterDocumentsQuery } = sellerUnregisterDocuments;

export const sellerUnregisterCancel = api.injectEndpoints({
  endpoints: build => ({
    sellerUnregisterCancel: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/seller-unregister-agreement/${uuid}/cancel/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useSellerUnregisterCancelMutation } = sellerUnregisterCancel;

export const getBorrowerDeliveryInfo = api.injectEndpoints({
  endpoints: build => ({
    getBorrowerDeliveryInfo: build.query({
      query: ({ uuid }) => ({ url: `${APIUrl}/seller-unregister-agreement/${uuid}/get-borrower-delivery-info` }),
      transformResponse: response => response.data
    })
  })
});

export const { useGetBorrowerDeliveryInfoQuery } = getBorrowerDeliveryInfo;

export const setSellerDeliveryInfo = api.injectEndpoints({
  endpoints: build => ({
    setSellerDeliveryInfo: build.mutation({
      query: ({ uuid, delivery }) => ({
        url: `${APIUrl}/seller-unregister-agreement/${uuid}/set-seller-delivery-info`,
        body: delivery,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useSetSellerDeliveryInfoMutation } = setSellerDeliveryInfo;
