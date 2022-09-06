import { createSlice } from '@reduxjs/toolkit';
import { compose, path, pick, prop } from 'ramda';
import { PURGE } from 'redux-persist';

import {
  applyMain,
  applyMainBiometryPhoto,
  applyMainConstructor,
  applyMainSellerLink,
  applyMainStatus
} from '@/features/api/apply-main';
import { applySellerSendOtp } from '@/features/api/apply-seller';
import { creditsStatus, vehicleImages, vehicleParams } from '@/features/api/credits';
import { verifyLoan } from '@/features/application/tasks';
import { fetchVerify } from '@/features/auth/tasks';
import { flows, newAutoIdentifierType, programs, sellerAutoIdentifierType } from '@/helper/constants';

import { applyVehicleless } from '../api/apply-vehicleless';

const initialState = {
  seller_auto_identifier: '',
  seller_auto_identifier_type: sellerAutoIdentifierType.GRNZ,
  seller_mobile_phone: '',
  seller_iin: '',
  new_auto_identifier: null,
  new_auto_identifier_type: newAutoIdentifierType.A1,
  flow: flows.CLIENT_TO_CLIENT,
  program: programs.AUTO_STANDARD,
  personal_data: true,
  foreigner: true,
  fatca: true,
  robot: false,
  lead_uuid: null,
  flow_uuid: null,
  step_uuid: null,
  vehicleParams: null,
  vehicleImages: [],
  avatar: null,
  showAvatar: true,
  isConditionBlockVisible: false,
  photoControlStep: 0
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setSellerUuid: (state, { payload }) => {
      state.flow_uuid = payload;
    },
    setSposeUuid: (state, { payload }) => {
      state.flow_uuid = payload;
    },
    setCoborrowerUuid: (state, { payload }) => {
      state.flow_uuid = payload;
    },
    setLeadUuid: (state, { payload }) => {
      state.lead_uuid = payload;
    },
    setConditionBlockVisible: (state, { payload }) => {
      state.isConditionBlockVisible = payload;
    },
    setCurrentRoute: (state, { payload }) => {
      state.current_route = payload;
    },
    resetSellerData: state => {
      state.seller_mobile_phone = '';
      state.seller_iin = '';
    },
    toggleShowAvatar: (state, { payload }) => {
      state.showAvatar = payload;
    },
    setPhotocontrolStep: (state, { payload }) => {
      state.photoControlStep = payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(verifyLoan.fulfilled, (state, { payload }) => {
        state.flow_uuid = prop('uuid', payload);
      })
      .addCase(fetchVerify.fulfilled, (state, { payload }) => {
        state.lead_uuid = prop('uuid', payload);
      })
      .addCase(PURGE, () => initialState)
      .addMatcher(applyMainStatus.endpoints.applyStatus.matchFulfilled, (state, { payload }) => {
        state.step_uuid = payload?.current_step?.uuid;
      })
      .addMatcher(applySellerSendOtp.endpoints.applySellerSendOtp.matchFulfilled, (state, { payload }) => {
        state.step_uuid = payload?.step_uuid;
      })
      .addMatcher(applyMainConstructor.endpoints.applyMainConstructor.matchFulfilled, (state, { payload }) => {
        state.step_uuid = payload?.step_uuid;
      })
      .addMatcher(applyMain.endpoints.applyMain.matchPending, (state, action) => {
        const newData = compose(
          pick(['auto_identifier_type', 'auto_identifier', 'flow', 'program']),
          path(['meta', 'arg', 'originalArgs', 'body'])
        )(action);
        state.seller_auto_identifier = prop('auto_identifier', newData);
        state.seller_auto_identifier_type = prop('auto_identifier_type', newData);
        state.flow = prop('flow', newData);
        state.program = prop('program', newData);
      })
      .addMatcher(applyMain.endpoints.applyMain.matchFulfilled, (state, { payload }) => {
        state.lead_uuid = prop('uuid', payload);
      })
      .addMatcher(applyVehicleless.endpoints.applyVehicleless.matchFulfilled, (state, { payload }) => {
        state.lead_uuid = prop('uuid', payload);
      })
      .addMatcher(creditsStatus.endpoints.creditsStatus.matchFulfilled, (state, { payload }) => {
        state.flow_uuid = payload?.main_flow_uuid ? payload.main_flow_uuid : state.flow_uuid;
        state.lead_uuid = payload?.lead_uuid ? payload.lead_uuid : state.lead_uuid;
      })
      .addMatcher(applyMainSellerLink.endpoints.applySellerLink.matchFulfilled, (state, action) => {
        const newData = compose(pick(['mobile_phone', 'iin']), path(['meta', 'arg', 'originalArgs']))(action);

        state.seller_mobile_phone = newData?.mobile_phone;
        state.seller_iin = newData?.iin;
      })
      .addMatcher(vehicleParams.endpoints.vehicleParams.matchFulfilled, (state, { payload }) => {
        state.vehicleParams = payload;
      })
      .addMatcher(vehicleImages.endpoints.vehicleImages.matchFulfilled, (state, { payload }) => {
        state.vehicleImages = payload;
      })
      .addMatcher(applyMainBiometryPhoto.endpoints.applyMainBiometryPhoto.matchFulfilled, (state, { payload }) => {
        state.avatar = payload?.image;
      });
  }
});

export const {
  setSellerUuid,
  setConditionBlockVisible,
  setSposeUuid,
  setCurrentRoute,
  setCoborrowerUuid,
  resetSellerData,
  toggleShowAvatar,
  setLeadUuid,
  setPhotocontrolStep
} = applicationSlice.actions;

export default applicationSlice.reducer;
