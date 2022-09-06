import { createSelector } from '@reduxjs/toolkit';
const carNumberBaseSelectors = state => state.carHistory;

export const carNumbersSelector = createSelector([carNumberBaseSelectors], state => state.numbers);
export const isSubmittedSelector = createSelector([carNumberBaseSelectors], state => state.isSubmitted);
