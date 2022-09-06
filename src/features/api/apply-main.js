import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

export const applyMain = api.injectEndpoints({
  endpoints: build => ({
    applyMain: build.mutation({
      query: ({ body }) => ({ url: `${APIUrl}/apply-main/`, method: 'POST', body }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainMutation } = applyMain;

// RESPONSE
/*

  {
    "data": {
      "uuid": "bc60c42d-c0f2-4cd1-85c9-57e77086ac87"
    },
    "error": null
  }

*/

export const applyMainBiometry = api.injectEndpoints({
  endpoints: build => ({
    applyBiometry: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/biometry/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyBiometryMutation } = applyMainBiometry;

export const applyMainCalcInsurance = api.injectEndpoints({
  endpoints: build => ({
    applyCalcInsurance: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/calculate-insurance/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyCalcInsuranceMutation } = applyMainCalcInsurance;

export const applyMainConstructor = api.injectEndpoints({
  endpoints: build => ({
    applyMainConstructor: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/constructor/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainConstructorMutation } = applyMainConstructor;

export const applyMainFetchDocs = api.injectEndpoints({
  endpoints: build => ({
    applyFetchDocs: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/fetch-ddocs/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyFetchDocsMutation } = applyMainFetchDocs;

export const applyMainDdocsUpload = api.injectEndpoints({
  endpoints: build => ({
    applyMainDdocsUpload: build.mutation({
      query: ({ step_uuid, formData }) => ({
        url: `${APIUrl}/apply-main/${step_uuid}/ddocs-upload-document/`,
        body: formData,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainDdocsUploadMutation } = applyMainDdocsUpload;

export const applyMainBorrowerScore = api.injectEndpoints({
  endpoints: build => ({
    applyBorrowerScore: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/borrower-score/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyBorrowerScoreMutation } = applyMainBorrowerScore;

export const applySellerScore = api.injectEndpoints({
  endpoints: build => ({
    applySellerScore: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/seller-score/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerScoreMutation } = applySellerScore;

/* RESPONSE * FFIN SCORE

{
  "data": {
    "success": true
  },
  "error": null
}

*/

export const applyMainPrescore = api.injectEndpoints({
  endpoints: build => ({
    applyPrescore: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/pre-score/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyPrescoreMutation } = applyMainPrescore;

export const applyMainUnRegisterAgrLink = api.injectEndpoints({
  endpoints: build => ({
    applyMainUnRegisterAgrLink: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/send-seller-unregister-link/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainUnRegisterAgrLinkMutation } = applyMainUnRegisterAgrLink;

export const applyMainStatus = api.injectEndpoints({
  endpoints: build => ({
    applyStatus: build.query({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/status/`, method: 'GET' }),
      keepUnusedDataFor: 1,
      transformResponse: response => response.data
    })
  })
});

export const { useApplyStatusQuery } = applyMainStatus;

/* RESPONSE * STATUS

{
  "data": {
    "uuid": "e1e60ae6-275a-441e-a63f-56329a540782",
    "current_step": {
      "uuid": "7534a7b1-95ac-44f0-a032-d030bdf0452f",
      "step": "PRE_SCORE",
      "status": "DONE",
      "is_repeatable": false
    },
    "next_step": "BIOMETRY"
  },
  "error": null
}

*/

const applyMainResend = api.injectEndpoints({
  endpoints: build => ({
    applyResend: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/resend/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyResendMutation } = applyMainResend;

export const applyMainVerify = api.injectEndpoints({
  endpoints: build => ({
    applyVerify: build.mutation({
      query: ({ uuid, code, utm_params }) => ({
        url: `${APIUrl}/apply-main/${uuid}/verify/`,
        method: 'POST',
        body: { code, utm_params }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyVerifyMutation } = applyMainVerify;

/* RESPONSE * VERIFY

{
  "data": {
    "uuid": "e1e60ae6-275a-441e-a63f-56329a540782",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQxOTYyNDY5LCJpYXQiOjE2NDE4NzYwNjksImp0aSI6IjE0N2E1MjQ2ZDJlNzQxZjU4NTFmNjkwMWYxOTFmYjQ3IiwidXNlcl9pZCI6OCwidG9rZW4tc2VjcmV0IjoiY2ZmNWM2MzQtMThmOS00YjVmLWJjZmUtNDIxNTQxNmE4MTk1IiwibW9iaWxlX3Bob25lIjoiKzc3Nzc3NzMyMDU4IiwiZnVsbF9uYW1lIjoiIn0.cLcvB1BgkDlfCqtB71iTKMwqHE-RNt7kWaytHoYC_aQ",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY0MjQ4MDg2OSwiaWF0IjoxNjQxODc2MDY5LCJqdGkiOiIwYmE3NTJkYjFkNjI0ZTViOWI2NjA3ZmQ0NTdkNjkzOCIsInVzZXJfaWQiOjgsInRva2VuLXNlY3JldCI6ImNmZjVjNjM0LTE4ZjktNGI1Zi1iY2ZlLTQyMTU0MTZhODE5NSIsIm1vYmlsZV9waG9uZSI6Iis3Nzc3NzczMjA1OCIsImZ1bGxfbmFtZSI6IiJ9.d-j81MDC4hSGlYWUOEAyLn58NbPokuoDYghrb9-gm2c"
  },
  "error": null
}

*/

export const applyMainSellerLink = api.injectEndpoints({
  endpoints: build => ({
    applySellerLink: build.mutation({
      query: ({ uuid, iin, mobile_phone }) => ({
        url: `${APIUrl}/apply-main/${uuid}/seller-link/`,
        method: 'POST',
        body: { iin, mobile_phone }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySellerLinkMutation } = applyMainSellerLink;

export const applyMainSpouseLink = api.injectEndpoints({
  endpoints: build => ({
    applySpouseLink: build.mutation({
      query: ({ uuid, iin, mobile_phone }) => ({
        url: `${APIUrl}/apply-main/${uuid}/spouse-link/`,
        method: 'POST',
        body: { iin, mobile_phone }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySpouseLinkMutation } = applyMainSpouseLink;

export const applyMainFinalSign = api.injectEndpoints({
  endpoints: build => ({
    applyFinalSign: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/final-sign/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyFinalSignMutation } = applyMainFinalSign;

export const applyMainGenerateMainDocuments = api.injectEndpoints({
  endpoints: build => ({
    applyGenerateMainDocuments: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/generate-main-documents/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyGenerateMainDocumentsMutation } = applyMainGenerateMainDocuments;

export const applyMainValidateMainDocuments = api.injectEndpoints({
  endpoints: build => ({
    applyMainValidateMainDocuments: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/validate-main-documents/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainValidateMainDocumentsMutation } = applyMainValidateMainDocuments;

export const applyMainTerminateSpouseLink = api.injectEndpoints({
  endpoints: build => ({
    applyTerminateSpouseLink: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/terminate-spouse-link/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyTerminateSpouseLinkMutation } = applyMainTerminateSpouseLink;

export const applyMainGetGrnzList = api.injectEndpoints({
  endpoints: build => ({
    applyMainGetGrnzList: build.mutation({
      query: ({ uuid, reo, shape, rarity, is_own = false }) => {
        console.log(uuid);
        if (is_own) {
          return {
            url: `${APIUrl}/apply-main/${uuid}/get-grnz-list/`,
            method: 'POST',
            params: { is_own }
          };
        } else {
          return {
            url: `${APIUrl}/apply-main/${uuid}/get-grnz-list/`,
            method: 'POST',
            body: { auto_psc_id: reo, shape, rarity }
          };
        }
      },
      keepUnusedDataFor: 0.0001,
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainGetGrnzListMutation } = applyMainGetGrnzList;

export const applyMainSpouseExisting = api.injectEndpoints({
  endpoints: build => ({
    applySpouseExisting: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/spouse-existing/`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplySpouseExistingQuery } = applyMainSpouseExisting;

export const applyMainSetOptions = api.injectEndpoints({
  endpoints: build => ({
    applyMainSetOptions: build.mutation({
      query: ({ stepUuid, data: { ...body } }) => ({
        url: `${APIUrl}/apply-main/${stepUuid}/set-options/`,
        method: 'POST',
        body: body
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainSetOptionsMutation } = applyMainSetOptions;

export const applyMainOpenBorrowerAccount = api.injectEndpoints({
  endpoints: build => ({
    applyMainOpenBorrowerAccount: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/open-borrower-account/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainOpenBorrowerAccountMutation } = applyMainOpenBorrowerAccount;

export const applyMainConstructorAdditionalInfo = api.injectEndpoints({
  endpoints: build => ({
    constructorAdditionalInfo: build.mutation({
      query: ({ stepUuid }) => ({
        url: `${APIUrl}/apply-main/${stepUuid}/constructor-additional-info/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useConstructorAdditionalInfoMutation } = applyMainConstructorAdditionalInfo;

export const applyMainDownPayment = api.injectEndpoints({
  endpoints: build => ({
    applyMainDownPayment: build.mutation({
      query: ({ uuid, is_online }) => ({
        url: `${APIUrl}/apply-main/${uuid}/down-payment/`,
        method: 'POST',
        body: { is_online }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainDownPaymentMutation } = applyMainDownPayment;

export const applyMainSetFinalOptions = api.injectEndpoints({
  endpoints: build => ({
    applyMainSetFinalOptions: build.mutation({
      query: ({ stepUuid, delivery_info }) => ({
        url: `${APIUrl}/apply-main/${stepUuid}/set-final-options/`,
        method: 'POST',
        body: { delivery_info }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainSetFinalOptionsMutation } = applyMainSetFinalOptions;

export const applyMainRejectCredit = api.injectEndpoints({
  endpoints: build => ({
    applyMainRejectCredit: build.mutation({
      query: ({ flowUuid }) => ({
        url: `${APIUrl}/apply-main/${flowUuid}/cancel/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainRejectCreditMutation } = applyMainRejectCredit;

export const applyMainRegisterInColvir = api.injectEndpoints({
  endpoints: build => ({
    applyMainRegisterInColvir: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/register-in-colvir/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainRegisterInColvirMutation } = applyMainRegisterInColvir;

export const applyMainCoborrowerInfo = api.injectEndpoints({
  endpoints: build => ({
    applyMainCoborrowerInfo: build.query({
      query: ({ step_uuid }) => ({
        url: `${APIUrl}/apply-main/${step_uuid}/co-borrower-info/`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainCoborrowerInfoQuery } = applyMainCoborrowerInfo;

export const applyMainCoborrowerLink = api.injectEndpoints({
  endpoints: build => ({
    applyMainCoborrowerLink: build.mutation({
      query: ({ stepUuid, iin, mobile_phone }) => ({
        url: `${APIUrl}/apply-main/${stepUuid}/co-borrower-link/`,
        method: 'POST',
        body: { iin, mobile_phone }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainCoborrowerLinkMutation } = applyMainCoborrowerLink;

export const applyMainTerminateAdditionalScore = api.injectEndpoints({
  endpoints: build => ({
    applyMainTerminateAdditionalScore: build.mutation({
      query: ({ stepUuid }) => ({
        url: `${APIUrl}/apply-main/${stepUuid}/terminate-additional-score/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainTerminateAdditionalScoreMutation } = applyMainTerminateAdditionalScore;

export const applyMainDeleteCoBorrower = api.injectEndpoints({
  endpoints: build => ({
    applyMainDeleteCoBorrower: build.mutation({
      query: ({ stepUuid }) => ({
        url: `${APIUrl}/apply-main/${stepUuid}/delete-co-borrower/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainDeleteCoBorrowerMutation } = applyMainDeleteCoBorrower;

export const applyMainStartAdditionalScore = api.injectEndpoints({
  endpoints: build => ({
    applyMainStartAdditionalScore: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/start-additional-score/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainStartAdditionalScoreMutation } = applyMainStartAdditionalScore;

export const applyMainAdditionalScoreInfo = api.injectEndpoints({
  endpoints: build => ({
    applyMainAdditionalScoreInfo: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/additional-score-info/`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainAdditionalScoreInfoQuery } = applyMainAdditionalScoreInfo;

export const applyMainVerifyCar = api.injectEndpoints({
  endpoints: build => ({
    applyMainVerifyCar: build.mutation({
      query: ({ lead_uuid, master_model }) => ({
        url: `${APIUrl}/apply-main/${lead_uuid}/verify-car/`,
        body: { master_model },
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainVerifyCarMutation } = applyMainVerifyCar;

export const applyMainDocuments = api.injectEndpoints({
  endpoints: build => ({
    applyMainDocuments: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/documents/`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainDocumentsQuery } = applyMainDocuments;

export const applyMainAutoRegisterSign = api.injectEndpoints({
  endpoints: build => ({
    applyMainAutoRegisterSign: build.mutation({
      query: ({ flow_uuid }) => ({
        url: `${APIUrl}/apply-main/${flow_uuid}/auto-register-sign/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainAutoRegisterSignMutation } = applyMainAutoRegisterSign;

export const applyMainAutoRegisterSignXml = api.injectEndpoints({
  endpoints: build => ({
    applyMainAutoRegisterSignXml: build.mutation({
      query: ({ flow_uuid }) => ({
        url: `${APIUrl}/apply-main/${flow_uuid}/auto-register-sign-xml/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainAutoRegisterSignXmlMutation } = applyMainAutoRegisterSignXml;

export const applyMainAddAdditionalIncome = api.injectEndpoints({
  endpoints: build => ({
    applyMainAddAdditionalIncome: build.mutation({
      query: ({ step_uuid, formData }) => ({
        url: `${APIUrl}/apply-main/${step_uuid}/add-additional-income/`,
        body: formData,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainAddAdditionalIncomeMutation } = applyMainAddAdditionalIncome;

export const applyMainDeleteAdditionalIncome = api.injectEndpoints({
  endpoints: build => ({
    applyMainDeleteAdditionalIncome: build.mutation({
      query: ({ stepUuid }) => ({
        url: `${APIUrl}/apply-main/${stepUuid}/delete-additional-income/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainDeleteAdditionalIncomeMutation } = applyMainDeleteAdditionalIncome;

export const applyMainSrtsPayment = api.injectEndpoints({
  endpoints: build => ({
    applyMainSrtsPayment: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/srts-payment/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainSrtsPaymentMutation } = applyMainSrtsPayment;

export const applyMainDdocsVerify = api.injectEndpoints({
  endpoints: build => ({
    applyMainDdocsVerify: build.mutation({
      query: ({ stepUuid, code }) => ({
        url: `${APIUrl}/apply-main/${stepUuid}/ddocs-verify/`,
        body: { code },
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainDdocsVerifyMutation } = applyMainDdocsVerify;

export const applyMainSrtsRemove = api.injectEndpoints({
  endpoints: build => ({
    applyMainSrtsRemove: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/srts-remove/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainSrtsRemoveMutation } = applyMainSrtsRemove;

export const applyMainSrtsRemoveValidation = api.injectEndpoints({
  endpoints: build => ({
    applyMainSrtsRemoveValidation: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/srts-remove-validation/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainSrtsRemoveValidationMutation } = applyMainSrtsRemoveValidation;

export const applyMainSrtsRemoveStatus = api.injectEndpoints({
  endpoints: build => ({
    applyMainSrtsRemoveStatus: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/srts-remove-status/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainSrtsRemoveStatusMutation } = applyMainSrtsRemoveStatus;

export const applyMainSrtsAppend = api.injectEndpoints({
  endpoints: build => ({
    applyMainSrtsAppend: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/srts-append/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainSrtsAppendMutation } = applyMainSrtsAppend;

export const applyMainSrtsAppendValidation = api.injectEndpoints({
  endpoints: build => ({
    applyMainSrtsAppendValidation: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/srts-append-validation/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainSrtsAppendValidationMutation } = applyMainSrtsAppendValidation;

export const applyMainCheckDebt = api.injectEndpoints({
  endpoints: build => ({
    applyMainCheckDebt: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/check-debt/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainCheckDebtMutation } = applyMainCheckDebt;

export const rawRecognize = api.injectEndpoints({
  endpoints: build => ({
    rawRecognize: build.mutation({
      query: ({ body }) => ({ url: `${APIUrl}/apply-main/raw-recognize/`, method: 'POST', body }),
      transformResponse: response => response.data
    })
  })
});

export const { useRawRecognizeMutation } = rawRecognize;

export const plateRecognize = api.injectEndpoints({
  endpoints: build => ({
    plateRecognize: build.mutation({
      query: ({ formData }) => ({ url: `${APIUrl}/apply-main/plate-recognize/`, method: 'POST', body: formData }),
      transformResponse: response => response.data
    })
  })
});

export const { usePlateRecognizeMutation } = plateRecognize;

export const manualSellerScore = api.injectEndpoints({
  endpoints: build => ({
    manualSellerScore: build.mutation({
      query: ({ uuid }) => ({ url: `${APIUrl}/apply-main/${uuid}/manual-seller-score/`, method: 'POST' }),
      transformResponse: response => response.data
    })
  })
});

export const { useManualSellerScoreMutation } = manualSellerScore;

export const coBorrowerExisting = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerExisting: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/co-borrower-existing/`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useCoBorrowerExistingQuery } = coBorrowerExisting;

export const terminateCoBorrowerFinalSignLink = api.injectEndpoints({
  endpoints: build => ({
    terminateCoBorrowerFinalSignLink: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/terminate-co-borrower-final-sign-link/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useTerminateCoBorrowerFinalSignLinkMutation } = terminateCoBorrowerFinalSignLink;

export const coBorrowerFinalSignLink = api.injectEndpoints({
  endpoints: build => ({
    coBorrowerFinalSignLink: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/co-borrower-final-sign-link/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useCoBorrowerFinalSignLinkMutation } = coBorrowerFinalSignLink;

export const applyMainBiometryPhoto = api.injectEndpoints({
  endpoints: build => ({
    applyMainBiometryPhoto: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/biometry-photo/`
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainBiometryPhotoQuery } = applyMainBiometryPhoto;

export const applyMainAutoGrnzImage = api.injectEndpoints({
  endpoints: build => ({
    applyMainAutoGrnzImage: build.query({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/auto-grnz-image/`
      }),
      transformResponse(baseQueryReturnValue) {
        return baseQueryReturnValue;
      }
    })
  })
});

export const { useApplyMainAutoGrnzImageQuery } = applyMainAutoGrnzImage;

export const srtsUnrecordAndRecord = api.injectEndpoints({
  endpoints: build => ({
    srtsUnrecordAndRecord: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/srts-unrecord-and-record/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useSrtsUnrecordAndRecordMutation } = srtsUnrecordAndRecord;

export const bipBeeUnrecordAndRecord = api.injectEndpoints({
  endpoints: build => ({
    bipBeeUnrecordAndRecord: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/bip-bee-unrecord-and-record/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useBipBeeUnrecordAndRecordMutation } = bipBeeUnrecordAndRecord;

export const forensicsBiometry = api.injectEndpoints({
  endpoints: build => ({
    forensicsBiometry: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/start-forensics-biometry/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useForensicsBiometryMutation } = forensicsBiometry;

export const validateForensicsBiometry = api.injectEndpoints({
  endpoints: build => ({
    validateForensicsBiometry: build.mutation({
      query: ({ uuid }) => ({
        url: `${APIUrl}/apply-main/${uuid}/validate-forensics-liveness/`,
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useValidateForensicsBiometryMutation } = validateForensicsBiometry;

export const applyMainFormIncome = api.injectEndpoints({
  endpoints: build => ({
    applyMainFormIncome: build.mutation({
      query: ({ flow_uuid, form_income }) => ({
        url: `${APIUrl}/apply-main/${flow_uuid}/form-income`,
        body: { form_income },
        method: 'POST'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyMainFormIncomeMutation } = applyMainFormIncome;
