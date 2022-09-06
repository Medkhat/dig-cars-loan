import { createSelector } from '@reduxjs/toolkit';
import { last, pathOr, propOr } from 'ramda';

const statusBaseSelectors = state => state.status;

export const getCurrentStep = createSelector([statusBaseSelectors], state => last(state.allSteps));

export const getStepByName = step => createSelector([statusBaseSelectors], state => propOr({}, step, state.steps));

export const getCommonStatus = createSelector([statusBaseSelectors], state => state.common_status);

//-------------------------------------------------------

export const getStepUuid = createSelector([statusBaseSelectors], state =>
  pathOr('NO_STEP_UUID', ['current_step', 'uuid'], state)
);
export const getStepStatus = createSelector([statusBaseSelectors], state =>
  pathOr('NO_STEP_STATUS', ['current_step', 'status'], state)
);

export const getStepRepeatable = createSelector([statusBaseSelectors], state =>
  pathOr(false, ['current_step', 'is_repeatable'], state)
);

export const getNextStep = createSelector([statusBaseSelectors], state => state.next_step);
//export const getCurrentStep = createSelector([statusBaseSelectors], state => state.current_step);

export const getStep = createSelector([getCurrentStep, getNextStep], (current_step, next_step) => ({
  current_step,
  next_step
}));

export const getStatusReason = createSelector([statusBaseSelectors], state => state?.current_step?.status_reason);
