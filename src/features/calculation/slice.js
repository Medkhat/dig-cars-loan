import { createSlice } from '@reduxjs/toolkit';
import { path, pathOr, propOr } from 'ramda';
import { PURGE } from 'redux-persist';

import { actualParams, requestedParams } from '@/features/api/credits';
import { calculationLoan } from '@/features/calculation/calculation-loan-new';
import { declOfNum } from '@/helper';

const initialState = {
  period: {
    value: null,
    caption: null
  },
  repayment_method: 'ANNUITY',
  down_payment: null,
  car_principal: null,
  monthly_payment: null,
  gesv: null,
  credit_amount: null,
  interest_rate: null,
  reward: null,
  effective_rate: null,
  params_type: null,
  click_code: null
};

export const calculationSlice = createSlice({
  name: 'calculation',
  initialState,
  reducers: {
    setData: (state, action) => action.payload,
    setConstructorSolution: (state, { payload }) => {
      let gesv = 0;
      const setGesv = a => {
        gesv = a;
      };
      calculationLoan({
        amount: payload?.car_principal - payload?.down_payment,
        setGesv: setGesv,
        insurance: [],
        percentage: payload?.interest_rate,
        paymentType: propOr('ANNUITY', 'repayment_method', payload),
        period: pathOr(0, ['period', 'value'], payload) * 12
      });
      return { ...payload, gesv: gesv };
    }
  },
  extraReducers: builder =>
    builder
      .addCase(PURGE, () => initialState)
      .addMatcher(actualParams.endpoints.actualParams.matchFulfilled, (state, { payload }) => {
        let gesv = 0;
        const setGesv = a => {
          gesv = a;
        };
        state.repayment_method = path(['actual_params', 'repayment_method'])(payload);

        const period = path(['actual_params', 'period'])(payload) / 12;

        console.log(period);
        state.period = {
          value: period,
          caption: declOfNum(period)
        };
        state.down_payment = path(['actual_params', 'down_payment'])(payload);
        state.car_principal = path(['actual_params', 'car_principal'])(payload);
        state.credit_amount = path(['actual_params', 'principal'])(payload);
        state.interest_rate = path(['actual_params', 'interest_rate'])(payload);
        state.reward = path(['actual_params', 'reward'])(payload);
        state.effective_rate = path(['actual_params', 'effective_rate'])(payload);
        state.params_type = path(['actual_params', 'params_type'])(payload);
        state.monthly_payment = calculationLoan({
          amount: path(['actual_params', 'principal'])(payload),
          setGesv: setGesv,
          insurance: [],
          percentage: path(['actual_params', 'interest_rate'])(payload),
          paymentType: path(['actual_params', 'repayment_method'])(payload),
          period: path(['actual_params', 'period'])(payload)
        });
        state.gesv =
          gesv < path(['actual_params', 'interest_rate'])(payload)
            ? path(['actual_params', 'interest_rate'])(payload)
            : gesv;
      })
      .addMatcher(requestedParams.endpoints.requestedParams.matchFulfilled, (state, { payload }) => {
        state.repayment_method = path(['requested_params', 'repayment_method'])(payload);

        const period = path(['requested_params', 'period'])(payload) / 12;

        console.log(period);
        state.period = {
          value: period,
          caption: declOfNum(period)
        };
        state.down_payment = path(['requested_params', 'down_payment'])(payload);
        state.car_principal = path(['requested_params', 'car_principal'])(payload);
        state.credit_amount = path(['requested_params', 'principal'])(payload);
        state.interest_rate = path(['requested_params', 'interest_rate'])(payload);
        state.reward = path(['requested_params', 'reward'])(payload);
        state.effective_rate = path(['requested_params', 'effective_rate'])(payload);
        state.params_type = path(['requested_params', 'params_type'])(payload);
      })
});

export const { setData, setConstructorSolution } = calculationSlice.actions;

export default calculationSlice.reducer;
