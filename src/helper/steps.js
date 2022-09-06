export const steps = [
  {
    step: null,
    title: 'Финансовый калькулятор',
    description: 'Рассчитайте автокредит на кредитном калькуляторе',
    flowType: [],
    apiStep: ['HOME'],
    route: '/main/calculation',
    showCar: false,
    showLoanInfo: false
  },
  {
    step: 1,
    title: 'Личные данные',
    flowType: [],
    apiStep: [],
    route: '/main/personal',
    progress: 20,
    showCar: false,
    showLoanInfo: false
  },
  {
    step: 1,
    title: 'Личные данные',
    flowType: [],
    apiStep: [],
    route: '/main/verify',
    progress: 20,
    showCar: false,
    showLoanInfo: false
  },
  {
    step: 1,
    title: 'Личные данные',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: ['BIOMETRY'],
    route: '/main/biometry',
    progress: 20,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 1,
    title: 'Личные данные',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: ['BIOMETRY_FORENSICS'],
    route: '/main/biometry-forensics',
    progress: 20,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: null,
    title: 'Процессинг',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: ['PRE_SCORE', 'BORROWER_SCORE', 'CALCULATE_INSURANCE', 'CO_BORROWER_PRE_SCORE', 'CO_BORROWER_SCORE'],
    route: '/process',
    progress: 20,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 2,
    title: 'Заявка',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: [
      'SELLER_SCORE_AGREEMENT',
      'SELLER_SCORE',
      'MANUAL_SELLER_SCORE',
      'OPEN_BORROWER_ACCOUNT',
      'ADDITIONAL_BORROWER_SCORE'
    ],
    route: '/main/loan',
    progress: 40,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 2,
    title: 'Заявка',
    flowType: ['CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: [
      'BORROWER_SCORE_WITHOUT_AUTO',
      'BORROWER_GET_DECISION',
      'ADD_AUTO',
      'SELLER_SCORE_AGREEMENT',
      'SELLER_SCORE',
      'MANUAL_SELLER_SCORE',
      'OPEN_BORROWER_ACCOUNT',
      'ADDITIONAL_BORROWER_SCORE'
    ],
    route: '/main/loan-without-car',
    progress: 40,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 2,
    title: 'Заявка',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: ['CONSTRUCTOR'],
    route: '/main/loan-approve',
    progress: 40,
    showCar: true,
    showLoanInfo: true
  },
  {
    step: 1,
    title: 'Личные данные',
    apiStep: [],
    route: '/main/recognizer',
    progress: 2,
    showCar: false,
    showLoanInfo: false
  },
  {
    step: 2,
    title: 'Заявка',
    apiStep: [],
    route: '/main/car-info',
    progress: 30,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 3,
    title: 'Оплата',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: ['RBS_PAYMENT'],
    route: '/main/loan-payment',
    progress: 60,
    showCar: true,
    showLoanInfo: true
  },
  {
    step: 4,
    title: 'Перерегистрация',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: [
      'SELLER_UNREGISTER_AUTO_AGREEMENT',
      'SRTS_PAYMENT',
      'BORROWER_AUTO_REGISTER_CHECK_DEBT',
      'AUTO_REGISTER_SIGN',
      'SRTS_UNRECORD_AND_RECORD',
      'AUTO_SRTS_APPEND_VALIDATION',
      'BIP_BEE_UNRECORD_AND_RECORD'
    ],
    route: '/main/re-registration',
    progress: 80,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 4,
    title: 'Перерегистрация',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: ['AUTO_REGISTER_SIGN_XML'],
    route: '/main/register-sign-xml',
    progress: 80,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 5,
    title: 'Подписание документов',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: [
      'FETCH_DDOCS',
      'SPOUSE_AGREEMENT',
      'REGISTER_IN_COLVIR',
      'GENERATE_MAIN_DOCUMENTS',
      'DOCUMENTS_VALIDATION',
      'CO_BORROWER_FINAL_SIGN_AGREEMENT'
    ],
    route: '/main/digital-doc',
    progress: 80,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 5,
    title: 'Подписание документов',
    flowType: ['CLIENT_TO_CLIENT', 'CLIENT_TO_CLIENT_WITHOUT_CAR'],
    apiStep: ['FINAL_SIGN'],
    route: '/main/sign-doc',
    progress: 80,
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 'seller_flow',
    title: 'Подтверждение личности',
    apiStep: [],
    route: '/seller/',
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 'seller_flow',
    title: 'Подтверждение личности',
    apiStep: [],
    route: '/seller/verify',
    showLoanInfo: false
  },
  {
    step: 'seller_flow',
    title: 'Прохождение фотоконтроля',
    apiStep: ['SELLER_VEHICLE_PHOTO_CONTROL'],
    route: '/seller/photocontrol',
    showLoanInfo: false
  },
  {
    step: 'seller_flow',
    title: 'Подтверждение личности',
    apiStep: ['SELLER_BIOMETRY'],
    route: '/seller/biometry',
    showLoanInfo: false
  },
  {
    step: 'seller_flow',
    title: 'Подтверждение личности',
    apiStep: ['SELLER_BIOMETRY_FORENSICS'],
    route: '/seller/biometry-forensics',
    showLoanInfo: false
  },
  {
    step: 'seller_flow',
    title: 'Подтверждение личности',
    apiStep: ['SELLER_AUTO_VALIDATION', 'OPEN_SELLER_ACCOUNT'],
    route: '/seller/confirmation-process',
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 'seller_flow',
    title: 'Снятие с учета',
    apiStep: ['SELLER_UNREGISTER_AUTO_VALIDATION'],
    route: '/seller/de-registration',
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 'seller_flow',
    title: 'Снятие с учета',
    apiStep: ['SELLER_UNREGISTER_CHECK_DEBT', 'SELLER_UNREGISTER_FINAL_SIGN', 'SELLER_UNREGISTER_SET_DELIVERY_INFO'],
    route: '/seller/buyer-info',
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 'seller_flow',
    title: 'Снятие с учета',
    apiStep: ['SELLER_UNREGISTER_SIGN_XML'],
    route: '/seller/final-sign-xml',
    showCar: true,
    showLoanInfo: false
  },
  {
    step: 'spouse_flow',
    title: 'Согласие супруги(а)',
    apiStep: [],
    route: '/spouse',
    showLoanInfo: false
  },
  {
    step: 'coborrower_flow',
    title: 'Подтверждение личности',
    apiStep: [],
    route: '/coborrower',
    showLoanInfo: false
  },
  {
    step: 'coborrower_flow',
    title: 'Подтверждение личности',
    apiStep: [],
    route: '/coborrower/verify',
    showLoanInfo: false
  },
  {
    step: 'coborrower_flow',
    title: 'Подтверждение личности',
    apiStep: ['CO_BORROWER_BIOMETRY'],
    route: '/coborrower/biometry',
    showLoanInfo: false
  },
  {
    step: 'coborrower_flow',
    title: 'Подтверждение личности',
    apiStep: ['CO_BORROWER_FETCH_DDOCS', 'OPEN_CO_BORROWER_ACCOUNT'],
    route: '/coborrower/digital-doc',
    showLoanInfo: false
  },
  {
    step: 'coborrower_flow',
    title: 'Подтверждение личности',
    apiStep: ['CO_BORROWER_FINAL_SIGN'],
    route: '/coborrower/sign-doc',
    showLoanInfo: false
  }
];
