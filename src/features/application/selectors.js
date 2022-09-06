import { createSelector } from '@reduxjs/toolkit';
import { compose, concat, drop, find, pick, prop, propEq, propOr } from 'ramda';

import { getIin, getPhoneNumber } from '@/features/user/selectors';

const applicationBaseSelectors = state => state['application'];

export const newLoanData = createSelector(applicationBaseSelectors, state =>
  pick(
    [
      'seller_auto_identifier',
      'seller_auto_identifier_type',
      'flow',
      'program',
      'personal_data',
      'foreigner',
      'fatca',
      'robot'
    ],
    state
  )
);

export const getLeadUuid = createSelector(applicationBaseSelectors, state => state.lead_uuid);
export const getFlowUuid = createSelector([applicationBaseSelectors], state => state.flow_uuid);
export const getStepUuid = createSelector([applicationBaseSelectors], state => state.step_uuid);
export const getSellerGrnz = createSelector([applicationBaseSelectors], state => state.seller_auto_identifier);

export const getSellerMobilePhone = createSelector([applicationBaseSelectors], state => state.seller_mobile_phone);
export const getSellerIin = createSelector([applicationBaseSelectors], state => state.seller_iin);
export const getSellerData = createSelector([getSellerMobilePhone, getSellerIin], (mobile_phone, iin) => ({
  mobile_phone,
  iin
}));

export const getPersonalPageData = createSelector([newLoanData, getPhoneNumber, getIin], (newLoanData, phone, iin) => ({
  iin,
  mobile_phone: drop(1)(phone),
  auto_identifier: prop('seller_auto_identifier', newLoanData),
  auto_identifier_type: prop('seller_auto_identifier_type', newLoanData),
  flow: prop('flow', newLoanData),
  program: prop('program', newLoanData),
  personal_data: prop('personal_data', newLoanData),
  foreigner: prop('foreigner', newLoanData),
  fatca: prop('fatca', newLoanData),
  robot: prop('robot', newLoanData),
  ffb: true
}));

export const getVehicleParams = createSelector([applicationBaseSelectors], state => state.vehicleParams);
export const getVehicleImages = createSelector([applicationBaseSelectors], state => state.vehicleImages);
export const getVehicleImageByType = type =>
  createSelector([applicationBaseSelectors], state =>
    compose(
      concat(import.meta.env.DEV ? import.meta.env.AC_DEV_HOST : import.meta.env.AC_PROD_HOST),
      propOr('', 'image'),
      find(propEq('image_type', type))
    )(state.vehicleImages)
  );

export const getAvatar = createSelector([applicationBaseSelectors], state => state.avatar);
export const showAvatar = createSelector([applicationBaseSelectors], state => state.showAvatar);

export const getConditionBlockVisible = createSelector(
  [applicationBaseSelectors],
  state => state.isConditionBlockVisible
);

export const getPhotocontrolStep = createSelector([applicationBaseSelectors], state => state.photoControlStep);
