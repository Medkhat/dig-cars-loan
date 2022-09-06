const userTypes = {
  BORROWER: 'BORROWER',
  SELLER: 'SELLER',
  SPOUSE: 'SPOUSE',
  COBORROWER: 'COBORROWER'
};

const applicationStatus = {
  NEW: 'NEW',
  VERIFIED: 'VERIFIED'
};

const sellerAutoIdentifierType = {
  GRNZ: 'GRNZ',
  VIN: 'VIN'
};

const newAutoIdentifierType = {
  A1: '1A',
  A2: '2A'
};

export const DISABLED_PAGE_NOTIFY = ['/main/personal'];

export const DISABLED_ERROR_CODE_NOTIFY = ['ERROR_TO_FORM'];

const flows = {
  CLIENT_TO_CLIENT: 'CLIENT_TO_CLIENT',
  CLIENT_TO_CLIENT_WITHOUT_CAR: 'CLIENT_TO_CLIENT_WITHOUT_CAR',
  BUSINESS_TO_CLIENT: 'BUSINESS_TO_CLIENT',
  DEMO: 'DEMO',
  TEST: 'TEST'
};

const programs = {
  AUTO_STANDARD: 'AUTO_STANDARD'
};

const selectorItems = [
  { value: 'EQUAL_INSTALMENTS', title: 'Равными долями' },
  { value: 'ANNUITY', title: 'Аннуитет' }
];

const selectorTypes = {
  EQUAL_INSTALMENTS: 'Равными долями',
  ANNUITY: 'Аннуитет'
};

const stepStatuses = {
  INITIAL: 'INITIAL',
  DONE: 'DONE',
  IN_PROGRESS: 'IN_PROGRESS',
  FAILED: 'FAILED'
};

const flowStatuses = {
  REJECTED: 'REJECTED',
  RETRY: 'RETRY',
  HOLD: 'HOLD',
  RETRY_WITHOUT_REDIRECT: 'RETRY_WITHOUT_REDIRECT',
  ISSUED: 'ISSUED',
  DONE: 'DONE'
};

const commonStatuses = {
  PROGRESS: 'PROGRESS',
  DONE: 'DONE'
};

const decisionTypes = {
  MOST_PROFITABLE_SOLUTION: 'MOST_PROFITABLE_SOLUTION',
  ALTERNATIVE: 'ALTERNATIVE',
  OPTIMAL: 'OPTIMAL',
  MIN_RATE_SOLUTION: 'MIN_RATE_SOLUTION',
  MIN_PMT_SOLUTION: 'MIN_PMT_SOLUTION',
  MOST_EQUAL_REQUESTED: 'MOST_EQUAL_REQUESTED',
  REQUESTED: 'REQUESTED'
};

const grnzTypeNumber = {
  DEFAULT: '0',
  VIP: 'VIP'
};

const tariffContent = {
  MIN_PMT_SOLUTION: {
    title: 'Минимальный',
    body: 'Мин. ежемесячный платеж'
  },
  MOST_PROFITABLE_SOLUTION: {
    title: 'Популярный',
    body: 'Оптимальный по сроку'
  },
  MIN_RATE_SOLUTION: {
    title: 'Выгодный',
    body: 'Оптимальный по %'
  }
};

const coborrowerStatuses = {
  DONE: 'DONE',
  DECLINED: 'DECLINED',
  IN_PROGRESS: 'IN_PROGRESS',
  DELETING: 'DELETING'
};

const scoreStatuses = {
  APPROVED: 'APPROVED',
  PARTIAL_APPROVE: 'PARTIAL_APPROVE',
  CONTINUE: 'CONTINUE'
};

const docTypes = {
  BORROWER_ID: 'BORROWER_ID',
  BORROWER_AGREEMENT: 'BORROWER_AGREEMENT',
  BORROWER_BIOMETRY: 'BORROWER_BIOMETRY',
  BORROWER_ACCOUNT_OPENING: 'BORROWER_ACCOUNT_OPENING',
  CO_BORROWER_ID: 'CO_BORROWER_ID',
  CO_BORROWER_AGREEMENT: 'CO_BORROWER_AGREEMENT',
  CO_BORROWER_BIOMETRY: 'CO_BORROWER_BIOMETRY',
  CO_BORROWER_ACCOUNT_OPENING: 'CO_BORROWER_ACCOUNT_OPENING',
  SELLER_AGREEMENT: 'SELLER_AGREEMENT',
  SELLER_GUARANTEE: 'SELLER_GUARANTEE',
  SELLER_BIOMETRY: 'SELLER_BIOMETRY',
  SPOUSE_CONSENT: 'SPOUSE_CONSENT',
  BANK_LOAN_AGREEMENT: 'BANK_LOAN_AGREEMENT',
  BORROWER_PAYMENT_ORDER: 'BORROWER_PAYMENT_ORDER',
  CANCEL_OVERDUE_DEBTS: 'CANCEL_OVERDUE_DEBTS',
  PLEDGE_AGREEMENT: 'PLEDGE_AGREEMENT',
  REPAYMENT_SCHEDULE: 'REPAYMENT_SCHEDULE',
  FUNDING_DECISION: 'FUNDING_DECISION',
  CERTIFICATION_STATE_AUTO: 'CERTIFICATION_STATE_AUTO',
  PFC_OFFER: 'PFC_OFFER '
};

const carImageTypes = {
  SIDE_VIEW_SMALL: 'SIDE_VIEW_SMALL',
  SIDE_VIEW_BIG: 'SIDE_VIEW_BIG',
  SIDE_VIEW_LIGHTS: 'SIDE_VIEW_LIGHTS',
  SIDE_VIEW_LOGO: 'SIDE_VIEW_LOGO',
  FRONT_VIEW: 'FRONT_VIEW'
};

const flowSteps = {
  //MAIN FLOW
  PRE_SCORE: 'PRE_SCORE', //'Процесс предварительного скоринга'
  BIOMETRY: 'BIOMETRY', //'Процесс биометрии'
  BIOMETRY_FORENSICS: 'BIOMETRY_FORENSICS',
  CALCULATE_INSURANCE: 'CALCULATE_INSURANCE', //'Расчет доп. расходов (Страховка и т.д.)'
  BORROWER_SCORE: 'BORROWER_SCORE', //'Скоринг заемщика (score 1.2)'
  BORROWER_SCORE_WITHOUT_AUTO: 'BORROWER_SCORE_WITHOUT_AUTO', // 'Скоринг заемщика без авто'
  BORROWER_GET_DECISION: 'BORROWER_GET_DECISION', // Получение решения без авто
  ADD_AUTO: 'ADD_AUTO', // Добавление авто
  ADDITIONAL_BORROWER_SCORE: 'ADDITIONAL_BORROWER_SCORE',
  SELLER_SCORE_AGREEMENT: 'SELLER_SCORE_AGREEMENT', //'Получение согласия продавца'
  SELLER_SCORE: 'SELLER_SCORE', //'Скоринг продавца (score 2.2)',
  MANUAL_SELLER_SCORE: 'MANUAL_SELLER_SCORE', // Ручной скоринг продавца
  OPEN_BORROWER_ACCOUNT: 'OPEN_BORROWER_ACCOUNT', //'Открытие счета заемщика'
  CONSTRUCTOR: 'CONSTRUCTOR', //'Конструктор опции кредита'
  RBS_PAYMENT: 'RBS_PAYMENT', //'Оплата первоначального взноса онлайн'
  SELLER_UNREGISTER_AUTO_AGREEMENT: 'SELLER_UNREGISTER_AUTO_AGREEMENT', //'Получeние согласия продавца на снятие ТС с учета'
  BORROWER_AUTO_REGISTER_CHECK_DEBT: 'BORROWER_AUTO_REGISTER_CHECK_DEBT', //  Проверка штрафа заемщика
  SRTS_PAYMENT: 'SRTS_PAYMENT', //'Оплата СРТС (снятие, постановка), ГРНЗ, '
  AUTO_REGISTER_SIGN: 'AUTO_REGISTER_SIGN', //'Подписание заемщика на постановку авто'
  SRTS_UNRECORD_AND_RECORD: 'SRTS_UNRECORD_AND_RECORD', // Снятие и постановка ТС
  AUTO_SRTS_APPEND_VALIDATION: 'AUTO_SRTS_APPEND_VALIDATION', // 'Валидация постановки на учет заемщику'
  BIP_BEE_UNRECORD_AND_RECORD: 'BIP_BEE_UNRECORD_AND_RECORD', // 'Снятие и постановка ТС (ЦОН)',
  FETCH_DDOCS: 'FETCH_DDOCS', //'Получение УДЛ из сервиса DigitalDocuments'
  SPOUSE_AGREEMENT: 'SPOUSE_AGREEMENT', //'Получение согласия супруги (При наличии)'
  REGISTER_IN_COLVIR: 'REGISTER_IN_COLVIR', //'Регистрация кредита в системе Colvir'
  GENERATE_MAIN_DOCUMENTS: 'GENERATE_MAIN_DOCUMENTS', //'Генерация основных документов'
  DOCUMENTS_VALIDATION: 'DOCUMENTS_VALIDATION', //'Валидация документов через NovaFront'
  CO_BORROWER_FINAL_SIGN_AGREEMENT: 'CO_BORROWER_FINAL_SIGN_AGREEMENT', // Финальное подписание созаемщика
  FINAL_SIGN: 'FINAL_SIGN',

  //SELLER FLOW
  SELLER_OTP_VERIFY: 'SELLER_OTP_VERIFY', //'(Seller) Подтверждение OTP'
  SELLER_BIOMETRY: 'SELLER_BIOMETRY', //'(Seller) Биометрия'
  SELLER_BIOMETRY_FORENSICS: 'SELLER_BIOMETRY_FORENSICS',
  SELLER_AUTO_VALIDATION: 'SELLER_AUTO_VALIDATION', //'(Seller) Проверка авто'
  OPEN_SELLER_ACCOUNT: 'OPEN_SELLER_ACCOUNT', //'Открытие счета продавца'

  //SELLER ПЕРЕРЕГИСТРАЦИЯ
  SELLER_UNREGISTER_AUTO_VALIDATION: 'SELLER_UNREGISTER_AUTO_VALIDATION', //'(SellerUnregister) Проверка авто'
  SELLER_UNREGISTER_CHECK_DEBT: 'SELLER_UNREGISTER_CHECK_DEBT', // ПРОВЕРКА ШТРАФА
  SELLER_UNREGISTER_FINAL_SIGN: 'SELLER_UNREGISTER_FINAL_SIGN', //'Финальное подписание'
  SELLER_UNREGISTER_FINAL_SIGN_XML: 'SELLER_UNREGISTER_SIGN_XML', //'(SellerUnregister) Финальное подписание(xml)'
  SELLER_UNREGISTER_SET_DELIVERY_INFO: 'SELLER_UNREGISTER_SET_DELIVERY_INFO', // Доставка на стороне продавца во время перерегистрации

  //SPOUSE FLOW
  SPOUSE_SIGN: 'SPOUSE_SIGN', //'(Spouse) Биометрия'

  //COBORROWER FLOW
  CO_BORROWER_OTP_VERIFY: 'CO_BORROWER_OTP_VERIFY', //'(СoBorrower) Подтверждение OTP'
  CO_BORROWER_BIOMETRY: 'CO_BORROWER_BIOMETRY', //'(CoBorrower) Биометрия'
  CO_BORROWER_PRE_SCORE: 'CO_BORROWER_PRE_SCORE', //'(CoBorrower) Процесс предварительного скоринга'
  CO_BORROWER_SCORE: 'CO_BORROWER_SCORE', //'(CoBorrower) Скоринг созаемщика (score 1.2)'

  //COBORROWER SIGN FLOW
  CO_BORROWER_FETCH_DDOCS: 'CO_BORROWER_FETCH_DDOCS', //'(CoBorrower) Получение УДЛ из сервиса DigitalDocuments'
  OPEN_CO_BORROWER_ACCOUNT: 'OPEN_CO_BORROWER_ACCOUNT', //'(CoBorrower) Открытие счета'
  CO_BORROWER_FINAL_SIGN: 'CO_BORROWER_FINAL_SIGN' //'(CoBorrower) FinalSign'
};

// ПРОВЕРКА ПЕРВОГО БЛОКА В ПЕРЕРЕГИСТРАЦИИ НА УСПЕШНЫЙ КЕЙС
const reregistrationFirstStepDone = [
  flowSteps.BORROWER_AUTO_REGISTER_CHECK_DEBT,
  flowSteps.SRTS_PAYMENT,
  flowSteps.AUTO_REGISTER_SIGN,
  flowSteps.AUTO_SRTS_APPEND_VALIDATION
];

// ПРОВЕРКА ВТОРОГО БЛОКА В ПЕРЕРЕГИСТРАЦИИ НА УСПЕШНЫЙ КЕЙС
const reregistrationSecondtStepDone = [flowSteps.AUTO_SRTS_APPEND_VALIDATION];

const reregistrationLoadingStep = [
  flowSteps.BORROWER_AUTO_REGISTER_CHECK_DEBT,
  flowSteps.AUTO_REGISTER_SIGN,
  flowSteps.AUTO_SRTS_APPEND_VALIDATION
];

export {
  applicationStatus,
  carImageTypes,
  coborrowerStatuses,
  commonStatuses,
  decisionTypes,
  docTypes,
  flows,
  flowStatuses,
  flowSteps,
  grnzTypeNumber,
  newAutoIdentifierType,
  programs,
  reregistrationFirstStepDone,
  reregistrationLoadingStep,
  reregistrationSecondtStepDone,
  scoreStatuses,
  selectorItems,
  selectorTypes,
  sellerAutoIdentifierType,
  stepStatuses,
  tariffContent,
  userTypes
};
