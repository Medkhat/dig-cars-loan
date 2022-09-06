import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

export const applySellerBiometry = api.injectEndpoints({
  endpoints: build => ({
    applySellerBiometry: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-seller-agreement/${uuid}/biometry/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerBiometryMutation } = applySellerBiometry;

export const applySellerSendOtp = api.injectEndpoints({
  endpoints: build => ({
    applySellerSendOtp: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-seller-agreement/${uuid}/send-otp`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerSendOtpMutation } = applySellerSendOtp;

export const applySellerVehicle = api.injectEndpoints({
  endpoints: build => ({
    applySellerVehicle: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-seller-agreement/${uuid}/vehicle-validation/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerVehicleMutation } = applySellerVehicle;

const applySellerResendOtp = api.injectEndpoints({
  endpoints: build => ({
    applySellerrResendOtp: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-seller-agreement/${uuid}/resend-otp`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerrResendOtpMutation } = applySellerResendOtp;

const applySellerVerify = api.injectEndpoints({
  endpoints: build => ({
    applySellerVerify: build.mutation({
      query: ({ uuid, otp }) => ({
        url: `${APIUrl}/apply-seller-agreement/${uuid}/verify/`,
        method: 'POST',
        body: { code: otp }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerVerifyMutation } = applySellerVerify;

export const applySellerOpenSellerAccount = api.injectEndpoints({
  endpoints: build => ({
    applySellerOpenSellerAccount: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-seller-agreement/${uuid}/open-seller-account/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerOpenSellerAccountMutation } = applySellerOpenSellerAccount;

export const applySellerCancel = api.injectEndpoints({
  endpoints: build => ({
    applySellerCancel: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-seller-agreement/${uuid}/cancel`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerCancelMutation } = applySellerCancel;

export const applySellerVehiclePhotoControl = api.injectEndpoints({
  endpoints: build => ({
    applySellerVehiclePhotoControl: build.mutation({
      query: ({ uuid, body }) => ({
        url: `${APIUrl}/apply-seller-agreement/${uuid}/vehicle-photo-control/`,
        body,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerVehiclePhotoControlMutation } = applySellerVehiclePhotoControl;

export const applySellerStartForensicsBiometry = api.injectEndpoints({
  endpoints: build => ({
    applySellerStartForensicsBiometry: build.mutation({
      query: ({ uuid, body }) => ({
        url: `${APIUrl}/apply-seller-agreement/${uuid}/start-forensics-biometry/`,
        body,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerStartForensicsBiometryMutation } = applySellerStartForensicsBiometry;

export const applySellerValidateForensics = api.injectEndpoints({
  endpoints: build => ({
    applySellerValidateForensics: build.mutation({
      query: ({ uuid, body }) => ({
        url: `${APIUrl}/apply-seller-agreement/${uuid}/validate-forensics-liveness/`,
        body,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerValidateForensicsMutation } = applySellerValidateForensics;
