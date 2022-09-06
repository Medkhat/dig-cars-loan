import { createSlice } from '@reduxjs/toolkit';
import { any, append, curry, dissoc, find, includes, path, without } from 'ramda';
import { PURGE } from 'redux-persist';

import {
  applyMainAdditionalScoreInfo,
  applyMainAutoRegisterSign,
  applyMainAutoRegisterSignXml,
  applyMainBiometry,
  applyMainCheckDebt,
  applyMainCoborrowerLink,
  applyMainDdocsVerify,
  applyMainDownPayment,
  applyMainFetchDocs,
  applyMainFinalSign,
  applyMainSellerLink,
  applyMainSpouseLink,
  applyMainSrtsAppend,
  applyMainSrtsAppendValidation,
  applyMainSrtsPayment,
  applyMainSrtsRemove,
  applyMainSrtsRemoveValidation,
  applyMainStatus,
  applyMainUnRegisterAgrLink,
  bipBeeUnrecordAndRecord,
  coBorrowerFinalSignLink,
  srtsUnrecordAndRecord,
  validateForensicsBiometry
} from '@/features/api/apply-main';
import { applySellerBiometry, applySellerValidateForensics } from '@/features/api/apply-seller';
import {
  coBorrowerAgrBiometry,
  coBorrowerDdocsVerify,
  coBorrowerFetchDdocs,
  coBorrowerFinalSign,
  coBorrowerOpenAccount
} from '@/features/api/co-borrower-';
import { spouseAgreement } from '@/features/api/spouse-agrement';
import {
  fetchLoanPageApi,
  fetchProcessPageApi,
  fetchReRegistrationApi,
  fetchReRegistrationFirstApi,
  fetchReRegistrationSecondApi,
  fetchSellerConfirmationPageApi,
  fetchSignDocApi
} from '@/features/status/tasks';
import { commonStatuses, flowStatuses, stepStatuses } from '@/helper/constants';
import { steps } from '@/helper/steps';

import { applyVehiclelessBorrowerScore } from '../api/apply-vehicleless';
import {
  sellerUnregisterAutoValidation,
  sellerUnregisterCheckDebt,
  sellerUnregisterFinalSign,
  sellerUnregisterFinalSignXml
} from '../api/seller-unregister';

const state_example = {
  // Общий флаг для страниц где отрабатывает несколько степов. Например страница /process (progress bar)
  common_status: 'PROGRESS', // PROGRESS | DONE
  PRE_SCORE: {
    step: 'PRE_SCORE',
    status: 'INITIAL', // INITIAL | IN_PROGRESS | DONE | FAILED
    flow_status: 'RETRY', // REJECTED | RETRY | HOLD | RETRY_WITHOUT_REDIRECT
    flow_type: '', // CLIENT_TO_CLIENT_WITHOUT_CA, CLIENT_TO_CLIENT, BUSINESS_TO_CLIENT
    retry_at: 1644852295.531663,
    status_reason: 'Описание ошибки',
    socket_url: '',
    socket_messages: [],
    score_status: '',
    redirect_url: '',
    document_url: '',
    step_uuid: '8ec514bb-d4d6-45c7-bd46-3803692cbd4b',
    route: '',
    is_loading: false,
    is_final: false,
    is_form_income: false,
    is_success: false
  }
};

const removeStatusReducer = (state, { payload }) => {
  state.allSteps = without(payload, state.allSteps);
  state.steps = dissoc(payload, state.steps);
};

const resetStatusReducer = (state, { payload }) => {
  state.steps = {
    ...state.steps,
    [payload.step]: {
      step: payload.step,
      status: stepStatuses.INITIAL,
      flow_status: '',
      flow_type: payload.flow_type,
      retry_at: 0,
      status_reason: '',
      socket_url: '',
      socket_messages: [],
      score_status: '',
      redirect_url: '',
      document_url: '',
      step_uuid: '',
      route: getCurrentStepNew(payload.step).route,
      is_loading: false,
      is_final: false,
      is_success: false
    }
  };
};

const resetRedirectUrlReducer = (state, { payload }) => {
  const { [payload]: value } = state.steps;

  state.steps = {
    ...state.steps,
    [payload]: {
      ...value,
      redirect_url: ''
    }
  };
};

const setSocketDataReducer = (state, { payload }) => {
  const { [payload?.step]: value } = state.steps;
  state.common_status = payload.is_final && !payload.is_success ? null : state.common_status;

  state.steps = {
    ...state.steps,
    [payload?.step]: {
      ...value,
      step: payload?.step,
      is_loading: !payload?.is_final,
      is_final: payload?.is_final,
      is_form_income: payload?.is_form_income,
      is_success: payload?.is_success,
      redirect_url: payload?.data?.redirect_url ? payload?.data?.redirect_url : value?.redirect_url,
      document_url: payload?.data?.document_url ? payload?.data?.document_url : value?.document_url,
      socket_messages: append(payload?.data?.message, value),
      score_status: payload?.data?.score_status
    }
  };
};

const setConstructorFinalSolutionReducer = (state, { payload }) => {
  const { [payload?.step]: value } = state.steps;

  console.log(payload);

  state.steps = {
    ...state.steps,
    [payload?.step]: {
      ...value,
      finalSolution: payload?.finalSolution
    }
  };
};

const setDecisionWithoutAutoReducer = (state, { payload }) => {
  const { [payload?.step]: value } = state.steps;

  console.log(payload);

  state.steps = {
    ...state.steps,
    [payload?.step]: {
      ...value,
      finalSolution: payload?.finalSolution
    }
  };
};

/*const setConstructorDataFulfilledReducer = (state, action) => {
  const step = path(['meta', 'arg', 'originalArgs', 'step'], action);
  const { [step]: value } = state.steps;

  state.steps = {
    ...state.steps,
    [step]: {
      ...value,
      solutions: action.payload?.solutions
    }
  };
};*/

const additionalScoreInfoFulfilledReducer = (state, action) => {
  const step = path(['meta', 'arg', 'originalArgs', 'step'], action);
  const { [step]: value } = state.steps;

  state.steps = {
    ...state.steps,
    [step]: {
      ...value,
      additionalScoreInfo: action.payload
    }
  };
};

const resetCommonStatusReducer = state => {
  state.common_status = null;
};

const resetStepsReducer = state => {
  state.steps = {};
  state.allSteps = [];
};

const resetForAdditionalStepReducer = (state, { payload }) => {
  state.common_status = null;

  const { [payload?.step]: value } = state.steps;

  state.steps = {
    ...state.steps,
    [payload?.step]: {
      ...value,
      is_loading: false,
      is_final: false,
      is_success: false,
      socket_url: '',
      route: ''
    }
  };
};

const initialState = {
  common_status: null,
  steps: {},
  allSteps: []
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setSocketData: setSocketDataReducer,
    resetStatus: resetStatusReducer,
    removeStatus: removeStatusReducer,
    resetSteps: resetStepsReducer,
    resetRedirectUrl: resetRedirectUrlReducer,
    resetCommonStatus: resetCommonStatusReducer,
    resetForAdditionalStep: resetForAdditionalStepReducer,
    setConstructorFinalSolution: setConstructorFinalSolutionReducer,
    setDecisionWithoutAuto: setDecisionWithoutAutoReducer
  },
  extraReducers: builder => {
    builder
      .addCase(PURGE, () => initialState)
      .addCase(fetchProcessPageApi.fulfilled, fetchPageProcessFulfilled)
      .addCase(fetchProcessPageApi.rejected, fetchPageProcessRejected)
      .addCase(fetchReRegistrationApi.fulfilled, fetchPageProcessFulfilled)
      .addCase(fetchReRegistrationApi.rejected, fetchPageProcessRejected)
      .addCase(fetchReRegistrationFirstApi.fulfilled, fetchPageProcessFulfilled)
      .addCase(fetchReRegistrationFirstApi.rejected, fetchPageProcessRejected)
      .addCase(fetchReRegistrationSecondApi.fulfilled, fetchPageProcessFulfilled)
      .addCase(fetchReRegistrationSecondApi.rejected, fetchPageProcessRejected)
      .addCase(fetchLoanPageApi.fulfilled, fetchPageProcessFulfilled)
      .addCase(fetchLoanPageApi.rejected, fetchPageProcessRejected)
      .addCase(fetchSignDocApi.fulfilled, fetchPageProcessFulfilled)
      .addCase(fetchSignDocApi.rejected, fetchPageProcessRejected)
      .addCase(fetchSellerConfirmationPageApi.fulfilled, fetchPageProcessFulfilled)
      .addCase(fetchSellerConfirmationPageApi.rejected, fetchPageProcessRejected)
      .addMatcher(applyMainStatus.endpoints.applyStatus.matchFulfilled, applyMainStatusFulfilled)
      .addMatcher(applyMainFetchDocs.endpoints.applyFetchDocs.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(
        applyVehiclelessBorrowerScore.endpoints.applyVehiclelessBorrowerScore.matchFulfilled,
        singleEndpointFulfilled
      )
      .addMatcher(
        applyMainUnRegisterAgrLink.endpoints.applyMainUnRegisterAgrLink.matchFulfilled,
        singleEndpointFulfilled
      )
      .addMatcher(applyMainSrtsRemove.endpoints.applyMainSrtsRemove.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(applyMainCheckDebt.endpoints.applyMainCheckDebt.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(validateForensicsBiometry.endpoints.validateForensicsBiometry.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(applyMainSrtsAppend.endpoints.applyMainSrtsAppend.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(applyMainSrtsPayment.endpoints.applyMainSrtsPayment.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(
        applySellerValidateForensics.endpoints.applySellerValidateForensics.matchFulfilled,
        singleEndpointFulfilled
      )
      .addMatcher(srtsUnrecordAndRecord.endpoints.srtsUnrecordAndRecord.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(bipBeeUnrecordAndRecord.endpoints.bipBeeUnrecordAndRecord.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(sellerUnregisterCheckDebt.endpoints.sellerUnregisterCheckDebt.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(sellerUnregisterFinalSign.endpoints.sellerUnregisterFinalSign.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(
        applyMainSrtsAppendValidation.endpoints.applyMainSrtsAppendValidation.matchFulfilled,
        singleEndpointFulfilled
      )
      .addMatcher(
        sellerUnregisterFinalSignXml.endpoints.sellerUnregisterFinalSignXml.matchFulfilled,
        singleEndpointFulfilled
      )
      .addMatcher(applyMainFinalSign.endpoints.applyFinalSign.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(coBorrowerFinalSign.endpoints.coBorrowerFinalSign.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(spouseAgreement.endpoints.spouseAgreement.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(applyMainCoborrowerLink.endpoints.applyMainCoborrowerLink.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(
        sellerUnregisterAutoValidation.endpoints.sellerUnregisterAutoValidation.matchFulfilled,
        singleEndpointFulfilled
      )
      .addMatcher(applyMainSellerLink.endpoints.applySellerLink.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(applyMainSpouseLink.endpoints.applySpouseLink.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(coBorrowerFinalSignLink.endpoints.coBorrowerFinalSignLink.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(coBorrowerFetchDdocs.endpoints.coBorrowerFetchDdocs.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(coBorrowerOpenAccount.endpoints.coBorrowerOpenAccount.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(applyMainBiometry.endpoints.applyBiometry.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(
        applyMainSrtsRemoveValidation.endpoints.applyMainSrtsRemoveValidation.matchFulfilled,
        singleEndpointFulfilled
      )
      .addMatcher(applyMainAutoRegisterSign.endpoints.applyMainAutoRegisterSign.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(
        applyMainAutoRegisterSignXml.endpoints.applyMainAutoRegisterSignXml.matchFulfilled,
        singleEndpointFulfilled
      )
      .addMatcher(coBorrowerAgrBiometry.endpoints.coBorrowerAgrBiometry.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(
        applyMainUnRegisterAgrLink.endpoints.applyMainUnRegisterAgrLink.matchFulfilled,
        singleEndpointFulfilled
      )
      .addMatcher(applySellerBiometry.endpoints.applySellerBiometry.matchFulfilled, singleEndpointFulfilled)
      // .addMatcher(
      //   applyMainConstructor.endpoints.applyMainConstructor.matchFulfilled,
      //   setConstructorDataFulfilledReducer
      // )
      .addMatcher(
        applyMainAdditionalScoreInfo.endpoints.applyMainAdditionalScoreInfo.matchFulfilled,
        additionalScoreInfoFulfilledReducer
      )
      .addMatcher(applyMainDownPayment.endpoints.applyMainDownPayment.matchFulfilled, singleEndpointFulfilled)
      .addMatcher(applyMainDdocsVerify.endpoints.applyMainDdocsVerify.matchFulfilled, fetchDdocsVerifyFulfilled)
      .addMatcher(coBorrowerDdocsVerify.endpoints.coBorrowerDdocsVerify.matchFulfilled, fetchDdocsVerifyFulfilled);
  }
});

export const {
  setSocketData,
  resetStatus,
  removeStatus,
  resetCommonStatus,
  resetSteps,
  resetRedirectUrl,
  resetForAdditionalStep,
  setConstructorFinalSolution,
  setDecisionWithoutAuto
} = statusSlice.actions;

export default statusSlice.reducer;

// --------------------------------------------------------------

const singleEndpointFulfilled = (state, action) => {
  const step = path(['meta', 'arg', 'originalArgs', 'step'], action);
  state.allSteps = includes(step, state.allSteps) ? state.allSteps : append(step, state.allSteps);

  const { [step]: value } = state.steps;

  state.steps = {
    ...state.steps,
    [step]: {
      ...value,
      socket_url: action.payload?.nchan_sub_url,
      redirect_url: action?.payload?.redirect_url,
      status: stepStatuses.IN_PROGRESS,
      is_loading: true,
      is_final: false,
      is_success: false,
      route: getCurrentStepNew(step)?.route
    }
  };
};

const isCurrentStep = curry((step, item) => {
  return any(apiStep => apiStep === step, item.apiStep);
});

export const getCurrentStepNew = step => {
  return find(isCurrentStep(step))(steps);
};

const applyMainStatusFulfilled = (state, { payload }) => {
  if (!payload?.current_step || payload?.current_step?.status === stepStatuses.DONE) {
    if (payload?.current_step?.step) {
      const { [payload?.current_step?.step]: value } = state.steps;
      state.steps = {
        ...state.steps,
        [payload?.current_step?.step]: {
          ...value,
          status: payload?.current_step?.status,
          is_loading: false,
          is_final: true,
          is_success: true
        }
      };
    }
    if (payload?.next_step) {
      state.allSteps = append(payload?.next_step, state.allSteps);

      state.steps = {
        ...state.steps,
        [payload?.next_step]: {
          step: payload?.next_step,
          status: stepStatuses.INITIAL,
          flow_status: '',
          flow_type: payload?.current_step?.flow_type,
          retry_at: 0,
          status_reason: '',
          socket_url: '',
          socket_messages: [],
          redirect_url: '',
          document_url: '',
          step_uuid: '',
          route: getCurrentStepNew(payload?.next_step)?.route,
          is_loading: false,
          is_final: false,
          is_success: false
        }
      };
    }

    if (payload?.current_step?.flow_status === flowStatuses.ISSUED) {
      const { [payload?.current_step?.step]: value } = state.steps;

      state.allSteps = includes(payload?.current_step?.step, state.allSteps)
        ? state.allSteps
        : append(payload?.current_step?.step, state.allSteps);

      state.steps = {
        ...state.steps,
        [payload?.current_step?.step]: {
          ...value,
          status: payload?.current_step?.status,
          step: payload?.current_step?.step,
          flow_status: payload?.current_step?.flow_status,
          flow_type: payload?.current_step?.flow_type,
          retry_at: payload?.current_step?.retry_at,
          status_reason: payload?.current_step?.status_reason,
          step_uuid: payload?.current_step?.uuid,
          route: '/main/success'
        }
      };
    }

    if (payload?.current_step?.flow_status === flowStatuses.DONE) {
      const { [payload?.current_step?.step]: value } = state.steps;

      state.common_status = null;

      state.allSteps = includes(payload?.current_step?.step, state.allSteps)
        ? state.allSteps
        : append(payload?.current_step?.step, state.allSteps);

      state.steps = {
        ...state.steps,
        [payload?.current_step?.step]: {
          ...value,
          status: payload?.current_step?.status,
          step: payload?.current_step?.step,
          flow_status: payload?.current_step?.flow_status,
          flow_type: payload?.current_step?.flow_type,
          retry_at: payload?.current_step?.retry_at,
          status_reason: payload?.current_step?.status_reason,
          step_uuid: payload?.current_step?.uuid,
          route: '/success'
        }
      };
    }
  } else if (payload?.current_step.status === stepStatuses.IN_PROGRESS) {
    const { [payload?.current_step?.step]: value } = state.steps;

    state.allSteps = includes(payload?.current_step?.step, state.allSteps)
      ? state.allSteps
      : append(payload?.current_step?.step, state.allSteps);

    state.steps = {
      ...state.steps,
      [payload?.current_step?.step]: {
        ...value,
        step: payload?.current_step?.step,
        status: payload?.current_step?.status,
        flow_status: payload?.current_step?.flow_status,
        flow_type: payload?.current_step?.flow_type,
        retry_at: payload?.current_step?.retry_at,
        status_reason: payload?.current_step?.status_reason,
        step_uuid: payload?.current_step?.uuid,
        route: getCurrentStepNew(payload?.current_step?.step)?.route,
        is_form_income: payload?.is_form_income
      }
    };
  } else if (payload?.current_step?.status === stepStatuses.FAILED) {
    if (payload?.current_step?.flow_status === flowStatuses.REJECTED) {
      const { [payload?.current_step?.step]: value } = state.steps;

      state.common_status = null;

      state.allSteps = includes(payload?.current_step?.step, state.allSteps)
        ? state.allSteps
        : append(payload?.current_step?.step, state.allSteps);

      state.steps = {
        ...state.steps,
        [payload?.current_step?.step]: {
          ...value,
          step: payload?.current_step?.step,
          status: payload?.current_step?.status,
          flow_status: payload?.current_step?.flow_status,
          flow_type: payload?.current_step?.flow_type,
          retry_at: payload?.current_step?.retry_at,
          status_reason: payload?.current_step?.status_reason,
          step_uuid: payload?.current_step?.uuid,
          route: '/rejected-error'
        }
      };
    }
    if (payload?.current_step?.flow_status === flowStatuses.RETRY) {
      const { [payload?.current_step?.step]: value } = state.steps;

      state.common_status = null;

      state.allSteps = includes(payload?.current_step?.step, state.allSteps)
        ? state.allSteps
        : append(payload?.current_step?.step, state.allSteps);

      state.steps = {
        ...state.steps,
        [payload?.current_step?.step]: {
          ...value,
          status: payload?.current_step?.status,
          step: payload?.current_step?.step,
          flow_status: payload?.current_step?.flow_status,
          flow_type: payload?.current_step?.flow_type,
          retry_at: payload?.current_step?.retry_at,
          status_reason: payload?.current_step?.status_reason,
          step_uuid: payload?.current_step?.uuid,
          route: '/retry-error',
          is_form_income: payload?.is_form_income
        }
      };
    }
    if (payload?.current_step?.flow_status === flowStatuses.RETRY_WITHOUT_REDIRECT) {
      const { [payload?.current_step?.step]: value } = state.steps;

      state.allSteps = includes(payload?.current_step?.step, state.allSteps)
        ? state.allSteps
        : append(payload?.current_step?.step, state.allSteps);

      state.steps = {
        ...state.steps,
        [payload?.current_step?.step]: {
          ...value,
          status: payload?.current_step?.status,
          step: payload?.current_step?.step,
          flow_status: payload?.current_step?.flow_status,
          flow_type: payload?.current_step?.flow_type,
          retry_at: payload?.current_step?.retry_at,
          status_reason: payload?.current_step?.status_reason,
          step_uuid: payload?.current_step?.uuid,
          route: getCurrentStepNew(payload?.current_step?.step).route
        }
      };
    }
    if (payload?.current_step?.flow_status === flowStatuses.HOLD) {
      const { [payload?.current_step?.step]: value } = state.steps;

      state.common_status = null;

      state.allSteps = includes(payload?.current_step?.step, state.allSteps)
        ? state.allSteps
        : append(payload?.current_step?.step, state.allSteps);

      state.steps = {
        ...state.steps,
        [payload?.current_step?.step]: {
          ...value,
          status: payload?.current_step?.status,
          step: payload?.current_step?.step,
          flow_status: payload?.current_step?.flow_status,
          flow_type: payload?.current_step?.flow_type,
          retry_at: payload?.current_step?.retry_at,
          status_reason: payload?.current_step?.status_reason,
          step_uuid: payload?.current_step?.uuid,
          route: '/retry-error'
        }
      };
    }
  }
};

const fetchPageProcessFulfilled = (state, { payload }) => {
  state.common_status = commonStatuses.PROGRESS;
  const { [payload?.step]: value } = state.steps;
  state.steps = {
    ...state.steps,
    [payload?.step]: {
      ...value,
      socket_url: payload.nchan_sub_url,
      is_loading: true,
      status: stepStatuses.IN_PROGRESS,
      route: getCurrentStepNew(payload?.step).route
    }
  };
};

const fetchPageProcessRejected = (state, { payload }) => {
  state.common_status = commonStatuses.DONE;
};

const fetchDdocsVerifyFulfilled = (state, action) => {
  const step = path(['meta', 'arg', 'originalArgs', 'step'], action);
  const { [step]: value } = state.steps;
  state.steps = {
    ...state.steps,
    [step]: {
      ...value,
      document_url: action.payload?.document_url
    }
  };
};
