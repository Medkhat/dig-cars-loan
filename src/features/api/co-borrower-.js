import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

export const coBorrowerAgrBiometry = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerAgrBiometry: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/co-borrower-agreement/${uuid}/biometry/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerAgrBiometryMutation } = coBorrowerAgrBiometry;

export const coBorrowerAgrScore = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerAgrScore: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/co-borrower-agreement/${uuid}/co-borrower-score/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerAgrScoreMutation } = coBorrowerAgrScore;

const coBorrowerAgrSendOtp = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerAgrSendOtp: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/co-borrower-agreement/${uuid}/send-otp`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerAgrSendOtpMutation } = coBorrowerAgrSendOtp;

export const coBorrowerOpenAccount = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerOpenAccount: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/co-borrower-final-sign/${uuid}/open-co-borrower-account/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerOpenAccountMutation } = coBorrowerOpenAccount;

export const coBorrowerAgreementPreScore = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerAgreementPreScore: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/co-borrower-agreement/${uuid}/pre-score/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerAgreementPreScoreMutation } = coBorrowerAgreementPreScore;

const coBorrowerAgreementResendOtp = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerAgreementResendOtp: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/co-borrower-agreement/${uuid}/resend-otp/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerAgreementResendOtpMutation } = coBorrowerAgreementResendOtp;

const coBorrowerAgreementVerify = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerAgreementVerify: build.mutation({
      query: ({ uuid, otp }) => ({
        url: `${APIUrl}/co-borrower-agreement/${uuid}/verify/`,
        method: 'POST',
        body: { code: otp }
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerAgreementVerifyMutation } = coBorrowerAgreementVerify;

export const coBorrowerCancel = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerCancel: build.mutation({
      query: ({ stepUuid }) => ({
        url: `${APIUrl}/co-borrower-agreement/${stepUuid}/cancel`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerCancelMutation } = coBorrowerCancel;

export const coBorrowerFetchDdocs = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerFetchDdocs: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/co-borrower-final-sign/${uuid}/fetch-ddocs/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerFetchDdocsMutation } = coBorrowerFetchDdocs;

export const coBorrowerFinalSign = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerFinalSign: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/co-borrower-final-sign/${uuid}/final-sign/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerFinalSignMutation } = coBorrowerFinalSign;

export const coBorrowerDocuments = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerDocuments: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/co-borrower-final-sign/${uuid}/documents/`
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerDocumentsQuery } = coBorrowerDocuments;

export const coBorrowerDdocsVerify = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerDdocsVerify: build.mutation({
      query: ({ stepUuid, code }) => ({
        url: `${APIUrl}/co-borrower-final-sign/${stepUuid}/ddocs-verify/`,
        body: { code },
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  }),
  overrideExisting: true
});

export const { useCoBorrowerDdocsVerifyMutation } = coBorrowerDdocsVerify;

export const coBorrowerDdocsUpload = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerDdocsUpload: build.mutation({
      query: ({ step_uuid, formData }) => ({
        url: `${APIUrl}/co-borrower-final-sign/${step_uuid}/ddocs-upload-document/`,
        body: formData,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useCoBorrowerDdocsUploadMutation } = coBorrowerDdocsUpload;
