import { APIUrl } from '@/app/API-Url';
import { api } from '@/app/backAPI';

const printBorrowerAgrGeneral = api.injectEndpoints({
  endpoints: build => ({
    printBorrowerAgrGeneral: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/bank-loan-agreement/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintBorrowerAgrGeneralQuery } = printBorrowerAgrGeneral;

const printAccountOpening = api.injectEndpoints({
  endpoints: build => ({
    printAccountOpening: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/account-opening/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintAccountOpeningQuery } = printAccountOpening;

const printBankLoanAgr = api.injectEndpoints({
  endpoints: build => ({
    printBankLoanAgr: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/bank-loan-agreement/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintBankLoanAgrQuery } = printBankLoanAgr;

const printBorrowerAgr = api.injectEndpoints({
  endpoints: build => ({
    printBorrowerAgr: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/borrower-agreement/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintBorrowerAgrQuery } = printBorrowerAgr;

const printBorrowerBiometry = api.injectEndpoints({
  endpoints: build => ({
    printBorrowerBiometry: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/borrower-biometry/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintBorrowerBiometry } = printBorrowerBiometry;

const printBorrowerPaymentOrder = api.injectEndpoints({
  endpoints: build => ({
    printBorrowerPaymentOrder: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/borrower-payment-order/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintBorrowerPaymentOrderQuery } = printBorrowerPaymentOrder;

const printCancelOverdueDebts = api.injectEndpoints({
  endpoints: build => ({
    printCancelOverdueDebts: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/cancel-overdue-debts/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintCancelOverdueDebtsQuery } = printCancelOverdueDebts;

const printCertificationStateAuto = api.injectEndpoints({
  endpoints: build => ({
    printCertificationStateAuto: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/certification-state-auto/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintCertificationStateAuto } = printCertificationStateAuto;

const printConsentData = api.injectEndpoints({
  endpoints: build => ({
    printConsentData: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/consent-data/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintConsentData } = printConsentData;

const printDisposalForm = api.injectEndpoints({
  endpoints: build => ({
    printDisposalForm: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/disposal-form/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintDisposalForm } = printDisposalForm;

const printFreepayAgr = api.injectEndpoints({
  endpoints: build => ({
    printFreepayAgr: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/freepay-agreement/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintFreepayAgr } = printFreepayAgr;

const printFundingDecision = api.injectEndpoints({
  endpoints: build => ({
    printFundingDecision: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/funding-decision/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintFundingDecision } = printFundingDecision;

const printGkb = api.injectEndpoints({
  endpoints: build => ({
    printGkb: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/gkb/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintGkb } = printGkb;

const printPfcOffer = api.injectEndpoints({
  endpoints: build => ({
    printPfcOffer: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/pfc-offer/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintPfcOffer } = printPfcOffer;

const printPledgeAgr = api.injectEndpoints({
  endpoints: build => ({
    printPledgeAgr: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/pledge-agreement/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintPledgeAgrQuery } = printPledgeAgr;

const printRepaymentSchedule = api.injectEndpoints({
  endpoints: build => ({
    printRepaymentSchedule: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/repayment-schedule/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintRepaymentScheduleQuery } = printRepaymentSchedule;

const printSellerAgr = api.injectEndpoints({
  endpoints: build => ({
    printSellerAgr: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/seller-agreement/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintSellerAgrQuery } = printSellerAgr;

const printSenderMoney = api.injectEndpoints({
  endpoints: build => ({
    printSenderMoney: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/sender-money/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintSenderMoney } = printSenderMoney;

const printSpouseConsent = api.injectEndpoints({
  endpoints: build => ({
    printSpouseConsent: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/spouse-consent/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintSpouseConsent } = printSpouseConsent;

const printLoanTransfer = api.injectEndpoints({
  endpoints: build => ({
    printLoanTransfer: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/loan-transfer/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintLoanTransfer } = printLoanTransfer;

const printLetterGuarantee = api.injectEndpoints({
  endpoints: build => ({
    printLetterGuarantee: build.query({
      query: ({ uuid, limit, offset }) => ({
        url: `${APIUrl}/print-forms/${uuid}/letter-guarantee/`,
        method: 'GET',
        params: { limit, offset }
      }),
      transformResponse: response => response.data
    })
  })
});

export const { usePrintLetterGuarantee } = printLetterGuarantee;
