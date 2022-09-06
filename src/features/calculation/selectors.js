import { createSelector } from '@reduxjs/toolkit';
const calculationBaseSelectors = state => state.calculation;

export const getCalculationData = createSelector([calculationBaseSelectors], state => state);
export const getClickCode = createSelector([calculationBaseSelectors], state => state.click_code);
