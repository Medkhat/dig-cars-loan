import { combineReducers, configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { assoc, path } from 'ramda';
import { toast } from 'react-toastify';
import { PERSIST, persistReducer, persistStore, PURGE, REGISTER } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

import { api } from '@/app/api';
import { applyMainStatus } from '@/features/api/apply-main';
import applicationReducer from '@/features/application/slice';
import authReducer from '@/features/auth/slice';
import calculationReducer from '@/features/calculation/slice';
import carHistorySlice from '@/features/carHistory/slice';
import errorReducer from '@/features/error/slice';
import statusReducer from '@/features/status/slice';
import userReducer from '@/features/user/slice';
import { DISABLED_PAGE_NOTIFY } from '@/helper/constants';

const notificationMiddleware = api => next => action => {
  if (!isRejectedWithValue(action)) return next(action);
  // const path = useLocation();

  // console.log(path)
  const { code } = action.payload?.data?.error;

  if (
    DISABLED_PAGE_NOTIFY.indexOf(window.location.pathname) !== 0 &&
    code !== 'ERROR_TO_FORM' &&
    code !== 'NON_SPOUSE' &&
    code !== 'ACTIVE_CREDIT_EXISTS' &&
    code !== 'ERROR_TO_FORM' &&
    code !== 'NOT-FOUND'
  ) {
    toast.error(action.payload?.data?.error?.description, {
      position: toast.POSITION.TOP_CENTER,
      hideProgressBar: true
    });
  }

  if (code === 'FORBIDDEN_FOR_CURRENT_STATE') {
    const flowUuid = api.getState().application.flow_uuid;
    api.dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
  }

  return next(assoc('payload', path(['payload', 'data', 'error'], action), action));
};

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  version: 1,
  whitelist: ['calculation', 'user']
};

const authPersistConfig = {
  key: 'auth',
  storage: sessionStorage,
  version: 1,
  whitelist: ['access', 'isAuth']
};

const statusPersistConfig = {
  key: 'status',
  storage: sessionStorage,
  version: 1,
  blacklist: ['common_status']
};

const applicationPersistConfig = {
  key: 'application',
  storage: sessionStorage,
  version: 1,
  whitelist: ['lead_uuid', 'flow_uuid', 'seller_mobile_phone', 'seller_iin', 'vehicleImages', 'avatar', 'showAvatar']
};

export const rootReducer = () => {
  return combineReducers({
    calculation: calculationReducer,
    application: persistReducer(applicationPersistConfig, applicationReducer),
    status: persistReducer(statusPersistConfig, statusReducer),
    user: userReducer,
    auth: persistReducer(authPersistConfig, authReducer),
    errors: errorReducer,
    carHistory: carHistorySlice,
    [api.reducerPath]: api.reducer
  });
};

const persistedReducer = persistReducer(persistConfig, rootReducer());

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REGISTER, PERSIST, PURGE]
      }
    }).concat(api.middleware, notificationMiddleware),
  devTools: import.meta.env.DEV
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
