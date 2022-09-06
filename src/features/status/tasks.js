import { createAsyncThunk } from '@reduxjs/toolkit';
import { hasIn, prop } from 'ramda';

import {
  applyMainBorrowerScore,
  applyMainCalcInsurance,
  applyMainCheckDebt,
  applyMainGenerateMainDocuments,
  applyMainOpenBorrowerAccount,
  applyMainPrescore,
  applyMainRegisterInColvir,
  applyMainSrtsAppend,
  applyMainSrtsPayment,
  applyMainSrtsRemove,
  applyMainUnRegisterAgrLink,
  applyMainValidateMainDocuments,
  applySellerScore,
  manualSellerScore
} from '@/features/api/apply-main';
import { applySellerOpenSellerAccount, applySellerVehicle } from '@/features/api/apply-seller';
import { coBorrowerAgreementPreScore, coBorrowerAgrScore } from '@/features/api/co-borrower-';

// -------------------------------------------------//

const processPageMapStep = {
  PRE_SCORE: applyMainPrescore.endpoints.applyPrescore.initiate,
  BORROWER_SCORE: applyMainBorrowerScore.endpoints.applyBorrowerScore.initiate,
  CALCULATE_INSURANCE: applyMainCalcInsurance.endpoints.applyCalcInsurance.initiate,
  CO_BORROWER_PRE_SCORE: coBorrowerAgreementPreScore.endpoints.coBorrowerAgreementPreScore.initiate,
  CO_BORROWER_SCORE: coBorrowerAgrScore.endpoints.coBorrowerAgrScore.initiate
};

export const fetchProcessPageApi = createAsyncThunk(
  'status/fetchProcessPageApi',
  async ({ step, uuid }, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      if (hasIn(step, processPageMapStep)) {
        const { data } = await dispatch(prop(step, processPageMapStep)({ uuid }));
        return fulfillWithValue({ ...data, step });
      } else {
        return rejectWithValue();
      }
    } catch (e) {
      return rejectWithValue();
    }
  }
);

const signDocMapStep = {
  REGISTER_IN_COLVIR: applyMainRegisterInColvir.endpoints.applyMainRegisterInColvir.initiate,
  GENERATE_MAIN_DOCUMENTS: applyMainGenerateMainDocuments.endpoints.applyGenerateMainDocuments.initiate,
  DOCUMENTS_VALIDATION: applyMainValidateMainDocuments.endpoints.applyMainValidateMainDocuments.initiate
};

export const fetchSignDocApi = createAsyncThunk(
  'status/fetchSignDocApi',
  async ({ step, uuid }, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      if (hasIn(step, signDocMapStep)) {
        const { data } = await dispatch(prop(step, signDocMapStep)({ uuid }));

        return fulfillWithValue({ ...data, step });
      } else {
        return rejectWithValue({ step });
      }
    } catch (e) {
      return rejectWithValue({ message: e.message, step });
    }
  }
);

const reRegistartionMapStep = {
  SELLER_UNREGISTER_AUTO_AGREEMENT: applyMainUnRegisterAgrLink.endpoints.applyMainUnRegisterAgrLink.initiate,
  AUTO_SRTS_REMOVE: applyMainSrtsRemove.endpoints.applyMainSrtsRemove.initiate,
  SRTS_PAYMENT: applyMainSrtsPayment.endpoints.applyMainSrtsPayment.initiate,
  AUTO_SRTS_APPEND: applyMainSrtsAppend.endpoints.applyMainSrtsAppend.initiate,
  BORROWER_AUTO_REGISTER_CHECK_DEBT: applyMainCheckDebt.endpoints.applyMainCheckDebt.initiate
};

export const fetchReRegistrationApi = createAsyncThunk(
  'status/fetchReRegistrationApi',
  async ({ step, uuid }, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      if (hasIn(step, reRegistartionMapStep)) {
        const { data } = await dispatch(prop(step, reRegistartionMapStep)({ uuid }));

        return fulfillWithValue({ ...data, step });
      } else {
        return rejectWithValue({ step });
      }
    } catch (e) {
      return rejectWithValue({ message: e.message, step });
    }
  }
);

const reRegistartionFirstMapStep = {
  SELLER_UNREGISTER_AUTO_AGREEMENT: applyMainUnRegisterAgrLink.endpoints.applyMainUnRegisterAgrLink.initiate,
  AUTO_SRTS_REMOVE: applyMainSrtsRemove.endpoints.applyMainSrtsRemove.initiate
};

export const fetchReRegistrationFirstApi = createAsyncThunk(
  'status/fetchReRegistrationFirstApi',
  async ({ step, uuid }, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      if (hasIn(step, reRegistartionFirstMapStep)) {
        const { data } = await dispatch(prop(step, reRegistartionFirstMapStep)({ uuid }));

        return fulfillWithValue({ ...data, step });
      } else {
        return rejectWithValue({ step });
      }
    } catch (e) {
      return rejectWithValue({ message: e.message, step });
    }
  }
);

const reRegistartionSecondMapStep = {
  BORROWER_AUTO_REGISTER_CHECK_DEBT: applyMainCheckDebt.endpoints.applyMainCheckDebt.initiate,
  SRTS_PAYMENT: applyMainSrtsPayment.endpoints.applyMainSrtsPayment.initiate
};

export const fetchReRegistrationSecondApi = createAsyncThunk(
  'status/fetchReRegistrationSecondApi',
  async ({ step, uuid }, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      if (hasIn(step, reRegistartionSecondMapStep)) {
        const { data } = await dispatch(prop(step, reRegistartionSecondMapStep)({ uuid }));

        return fulfillWithValue({ ...data, step });
      } else {
        return rejectWithValue({ step });
      }
    } catch (e) {
      return rejectWithValue({ message: e.message, step });
    }
  }
);

const loanPageMapStep = {
  SELLER_SCORE: applySellerScore.endpoints.applySellerScore.initiate,
  MANUAL_SELLER_SCORE: manualSellerScore.endpoints.manualSellerScore.initiate,
  OPEN_BORROWER_ACCOUNT: applyMainOpenBorrowerAccount.endpoints.applyMainOpenBorrowerAccount.initiate
};

export const fetchLoanPageApi = createAsyncThunk(
  'status/fetchLoanPageApi',
  async ({ step, uuid }, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      console.log(step);
      if (hasIn(step, loanPageMapStep)) {
        const { data } = await dispatch(prop(step, loanPageMapStep)({ uuid }));

        return fulfillWithValue({ ...data, step });
      } else {
        return rejectWithValue({ step });
      }
    } catch (e) {
      return rejectWithValue({ message: e.message, step });
    }
  }
);

const sellerConfirmationProcessPageMapStep = {
  SELLER_AUTO_VALIDATION: applySellerVehicle.endpoints.applySellerVehicle.initiate,
  OPEN_SELLER_ACCOUNT: applySellerOpenSellerAccount.endpoints.applySellerOpenSellerAccount.initiate
};

export const fetchSellerConfirmationPageApi = createAsyncThunk(
  'status/fetchSellerConfirmationPageApi',
  async ({ step, uuid }, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      if (hasIn(step, sellerConfirmationProcessPageMapStep)) {
        const { data } = await dispatch(prop(step, sellerConfirmationProcessPageMapStep)({ uuid }));

        return fulfillWithValue({ ...data, step });
      } else {
        return rejectWithValue({ step });
      }
    } catch (e) {
      return rejectWithValue({ message: e.message, step });
    }
  }
);
