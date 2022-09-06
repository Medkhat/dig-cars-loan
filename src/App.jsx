import 'react-toastify/dist/ReactToastify.css';

import { tail } from 'ramda';
import React, { useContext, useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAsync } from 'react-use';
import tw from 'twin.macro';

import { MainFlowLayout } from '@/app/main-flow-layout';
import { SellerFlowLayout } from '@/app/seller-flow-layout';
import { ThemeContext } from '@/contexts/theme-context';
import { applyMainBiometryPhoto, applyMainStatus } from '@/features/api/apply-main';
import { creditsStatus, vehicleImages } from '@/features/api/credits';
import { getAvatar, getFlowUuid } from '@/features/application/selectors';
import { isAuthSelector } from '@/features/auth/selectors';
import { authBorrower } from '@/features/auth/tasks';
import { getErrors } from '@/features/error/slice';
import { getCommonStatus, getCurrentStep, getStepByName } from '@/features/status/selectors';
import { getUserType } from '@/features/user/selectors';
import { getCurrentStepData } from '@/helper';
import { userTypes } from '@/helper/constants';
import { RequireAuth } from '@/helper/require-auth';
import Page404 from '@/pages/404';
import AuthPage from '@/pages/auth-page';
import CarInfoPage from '@/pages/car-info-page';
import CoborrowerDigitalDocPage from '@/pages/coborrower-digital-doc-page';
import { FramePage } from '@/pages/frame-page';
import MainAutoRegisterPage from '@/pages/main-auto-register-page';
import MainAutoRegisterXmlPage from '@/pages/main-auto-register-xml-page';
import LoanVerifyPage from '@/pages/main-loan-verify-page';
import PersonalInfoPage from '@/pages/main-personal-info-page';
import { ProcessWsPage } from '@/pages/process-ws-page';
import RecognizerPage from '@/pages/recognizer-page';
// Страница продавца
import SellerConfirmationPage from '@/pages/seller-confirmation-page';
import SellerUnregisterFinalSignXmlPage from '@/pages/seller-unregister-final-sign-xml-page';
import SpousePage from '@/pages/spouse-page';
import Loader from '@/views/loader';

import { Backdrop, Modal } from './components';
import { DeviceInfoContext } from './contexts/device-info-context';
import CoborrowerBiometryPage from './pages/coborrower-biometry-page';
import CoborrowerMainPage from './pages/coborrower-main-page';
import CoborrowerOtpVerifyPage from './pages/coborrower-otp-verify-page';
import CoborrowerSignDocPage from './pages/coborrower-sign-doc-page';
import MainBiometryPage from './pages/main-biometry-page';
import MainCarHistoryDetailPage from './pages/main-car-history-detail-page';
import MainCarHistoryErrorPage from './pages/main-car-history-error-page';
import MainCarHistoryFailedPage from './pages/main-car-history-failed-page';
import MainCarHistoryIndexPage from './pages/main-car-history-index-page';
import MainCarHistoryLoadingPage from './pages/main-car-history-loading-page';
import MainCarHistoryNotFoundPage from './pages/main-car-history-notFound-page';
import MainDigitalDocPage from './pages/main-digital-doc-page';
import MainForencicsPage from './pages/main-forensics-biometry-page';
import MainLoanApprovePage from './pages/main-loan-approve-page';
import MainLoanPage from './pages/main-loan-page';
import MainLoanPaymentPage from './pages/main-loan-payment-page';
import MainLoanWithoutCarPage from './pages/main-loan-without-car-page';
import MainNoBmgPage from './pages/main-no-bmg-page';
import MainReRegistrationPage from './pages/main-reregistration-page';
import MainSignDocPage from './pages/main-sign-doc-page';
import MainSuccessPage from './pages/main-success-page';
import RejectedErrorPage from './pages/rejected-error-page';
import RetryErrorPage from './pages/retry-error-page';
import SellerForensicsBiometryPage from './pages/seller-biometry-forensics-page';
import SellerBiometryPage from './pages/seller-biometry-page';
import SellerBuyerInfoPage from './pages/seller-buyer-info-page';
import SellerConfirmationProcessPage from './pages/seller-confirmation-process-page';
import SellerDeRegisterPage from './pages/seller-de-register-page';
import SellerOtpVerifyPage from './pages/seller-otp-verify-page';
import SellerPhotocontrolPage from './pages/seller-photocontrol-page';
import SellerSuccessPage from './pages/seller-success-page';
import FormIncomeModalContent from './views/form-income-modal-content';

function App() {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isMobile } = useContext(DeviceInfoContext);

  const [isOpenFormIncome, setIsOpenFormIncome] = useState(false);

  const [flow, setFlow] = useState('');
  const [currentStep, setCurrentStep] = useState();
  const [appLoading, setAppLoading] = useState(false);

  const location = useLocation();
  const { pathname } = location;
  const [searchParams] = useSearchParams();

  const isAuth = useSelector(isAuthSelector);
  const flowUuid = useSelector(getFlowUuid);
  const userType = useSelector(getUserType);
  const avatar = useSelector(getAvatar);

  const step = useSelector(getCurrentStep);
  const commonStatus = useSelector(getCommonStatus);
  const stepInfo = useSelector(getStepByName(step));
  const error = useSelector(getErrors);
  useErrorHandler(error);

  useEffect(() => {
    const token = searchParams.get('token');
    const userType = searchParams.get('user_type');
    if (token && userType === userTypes.BORROWER) {
      setAppLoading(true);
      dispatch(authBorrower(token));
    }
  }, [searchParams, dispatch]);

  console.log('stepInfo: ', stepInfo);
  console.log('commonstat: ', commonStatus);

  useEffect(() => {
    if (stepInfo?.route && !commonStatus) {
      //dispatch(setAppLoading(false));
      navigate(stepInfo?.route, { replace: true });
    }
    if (stepInfo?.is_form_income) {
      setIsOpenFormIncome(true);
    }
  }, [stepInfo, commonStatus, navigate]);

  useAsync(async () => {
    isAuth &&
      userType === userTypes.BORROWER &&
      (await dispatch(creditsStatus.endpoints.creditsStatus.initiate(null, { forceRefetch: true })));
  }, [isAuth, userType]);

  useAsync(async () => {
    if (flowUuid && isAuth) {
      await dispatch(vehicleImages.endpoints.vehicleImages.initiate({ flow_uuid: flowUuid }));
      await dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
      !avatar &&
        (await dispatch(
          applyMainBiometryPhoto.endpoints.applyMainBiometryPhoto.initiate({ uuid: flowUuid }, { forceRefetch: true })
        ));
    }
  }, [flowUuid, isAuth]);

  useEffect(() => {
    setCurrentStep(getCurrentStepData(pathname));
  }, [pathname]);

  useEffect(() => {
    setFlow(tail(pathname));
  }, [pathname]);

  useEffect(() => {
    if (step) {
      setAppLoading(false);
    }
  }, [step]);

  if (appLoading) {
    return <Loader />;
  }

  return (
    <>
      <Routes>
        <Route path='/'>
          <Route index element={<Navigate replace to='main' />} />
          <Route path='main' element={<MainFlowLayout flow={flow} currentStep={currentStep} />}>
            <Route index element={<Navigate replace to='personal' />} />
            {/*<Route path='calculation' element={<CalculationPage />} />*/}
            <Route path='personal' element={<PersonalInfoPage />} />

            <Route path='verify' element={<LoanVerifyPage />} />
            <Route
              path='biometry'
              element={
                <RequireAuth>
                  <MainBiometryPage />
                </RequireAuth>
              }
            />
            <Route
              path='biometry-forensics'
              element={
                <RequireAuth>
                  <MainForencicsPage />
                </RequireAuth>
              }
            />
            <Route
              path='loan'
              element={
                <RequireAuth>
                  <MainLoanPage />
                </RequireAuth>
              }
            />
            <Route
              path='loan-without-car'
              element={
                <RequireAuth>
                  <MainLoanWithoutCarPage />
                </RequireAuth>
              }
            />
            <Route
              path='loan-approve'
              element={
                <RequireAuth>
                  <MainLoanApprovePage />
                </RequireAuth>
              }
            />
            <Route
              path='loan-payment'
              element={
                <RequireAuth>
                  <MainLoanPaymentPage />
                </RequireAuth>
              }
            />
            <Route
              path='re-registration'
              element={
                <RequireAuth>
                  <MainReRegistrationPage />
                </RequireAuth>
              }
            />
            <Route
              path='register-sign'
              element={
                <RequireAuth>
                  <MainAutoRegisterPage />
                </RequireAuth>
              }
            />
            <Route
              path='register-sign-xml'
              element={
                <RequireAuth>
                  <MainAutoRegisterXmlPage />
                </RequireAuth>
              }
            />
            <Route
              path='digital-doc'
              element={
                <RequireAuth>
                  <MainDigitalDocPage />
                </RequireAuth>
              }
            />
            <Route
              path='sign-doc'
              element={
                <RequireAuth>
                  <MainSignDocPage />
                </RequireAuth>
              }
            />
            <Route
              path='success'
              element={
                <RequireAuth>
                  <MainSuccessPage />
                </RequireAuth>
              }
            />
            <Route path='no-bmg' element={<MainNoBmgPage />} />
            <Route path='recognizer' element={<RecognizerPage />} />
            <Route path='car-info' element={<CarInfoPage />} />
          </Route>
          <Route path='seller' element={<SellerFlowLayout flow={flow} currentStep={currentStep} />}>
            <Route index element={<SellerConfirmationPage />} />
            <Route path='verify' element={<SellerOtpVerifyPage />} />
            <Route
              path='photocontrol'
              element={
                <RequireAuth>
                  <SellerPhotocontrolPage />
                </RequireAuth>
              }
            />
            <Route
              path='biometry'
              element={
                <RequireAuth>
                  <SellerBiometryPage />
                </RequireAuth>
              }
            />
            <Route
              path='biometry-forensics'
              element={
                <RequireAuth>
                  <SellerForensicsBiometryPage />
                </RequireAuth>
              }
            />
            <Route
              path='confirmation-process'
              element={
                <RequireAuth>
                  <SellerConfirmationProcessPage />
                </RequireAuth>
              }
            />
            <Route
              path='de-registration'
              element={
                <RequireAuth>
                  <SellerDeRegisterPage />
                </RequireAuth>
              }
            />
            <Route
              path='buyer-info'
              element={
                <RequireAuth>
                  <SellerBuyerInfoPage />
                </RequireAuth>
              }
            />
            <Route
              path='final-sign-xml'
              element={
                <RequireAuth>
                  <SellerUnregisterFinalSignXmlPage />
                </RequireAuth>
              }
            />
            {/*<Route path='amount-info' element={<SellerAmountPage />} />*/}
            <Route path='success' element={<SellerSuccessPage />} />
          </Route>
          <Route path='coborrower' element={<SellerFlowLayout flow={flow} currentStep={currentStep} />}>
            <Route index element={<CoborrowerMainPage />} />
            <Route path='verify' element={<CoborrowerOtpVerifyPage />} />
            <Route
              path='biometry'
              element={
                <RequireAuth>
                  <CoborrowerBiometryPage />
                </RequireAuth>
              }
            />
            <Route
              path='digital-doc'
              element={
                <RequireAuth>
                  <CoborrowerDigitalDocPage />
                </RequireAuth>
              }
            />
            <Route
              path='sign-doc'
              element={
                <RequireAuth>
                  <CoborrowerSignDocPage />
                </RequireAuth>
              }
            />
          </Route>
          <Route path='spouse' element={<SellerFlowLayout flow={flow} currentStep={currentStep} />}>
            <Route index element={<SpousePage />} />
          </Route>
          <Route path='/success' element={<SellerSuccessPage />} />
          <Route path='car-history'>
            <Route index element={<MainCarHistoryIndexPage />} />
            <Route path='detail' element={<MainCarHistoryDetailPage />} />
            <Route path='loading' element={<MainCarHistoryLoadingPage />} />
            <Route path='failed' element={<MainCarHistoryFailedPage />} />
            <Route path='error' element={<MainCarHistoryErrorPage />} />
            <Route path='notFound' element={<MainCarHistoryNotFoundPage />} />
          </Route>
          <Route path='/retry-error' element={<RetryErrorPage />} />
          <Route path='/rejected-error' element={<RejectedErrorPage />} />
          <Route path='/process' element={<ProcessWsPage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/external' element={<FramePage />} />
          <Route path='/404' element={<Page404 />} />
          <Route path='*' element={<Page404 />} />
        </Route>
      </Routes>
      <ToastContainer theme={theme} />
      {isMobile ? (
        <Backdrop isOpen={isOpenFormIncome} setIsOpen={setIsOpenFormIncome} title='Сведения о доходах' withBlur>
          <FormIncomeModalContent setIsOpenFormIncome={setIsOpenFormIncome} />
        </Backdrop>
      ) : (
        <Modal
          open={isOpenFormIncome}
          setOpen={setIsOpenFormIncome}
          title='Сведения о доходах'
          twStyle={tw`rounded-2xl !p-0`}
          headerStyle={tw`p-5 pb-0`}
          outsideClose={false}
          withBlur
        >
          <FormIncomeModalContent setIsOpenFormIncome={setIsOpenFormIncome} />
        </Modal>
      )}
    </>
  );
}

export default App;
