const grnzTypes = [
  { value: 'own', title: 'Использовать свой номер' },
  { value: 'new', title: 'Хочу новый номер' }
];

const flowTypes = [
  { value: 'without_auto', title: 'Указать гос номер авто позже' },
  { value: 'with_auto', title: 'Ввести гос номер авто' }
];

const options = [
  {
    label: 'СпецЦОН №1 Алатауского района',
    value: 'c1'
  },
  {
    label: 'СпецЦОН №2 Ауезовского района',
    value: 'c2'
  }
];

const numberPlates = [
  { value: 'A1', title: '1А: Прямоугольный', icon: 'test' },
  { value: 'A2', title: '2А: Квадратный', icon: 'test' }
];

const numberPlateChoise = [
  { value: '0', title: 'Стандартный номер', subItem: 'Входит в сумму займа' },
  { value: 'VIP', title: 'Престижный номер', subItem: 'до 800 000 ₸' }
];

const grnzPrestigeOptions = [
  {
    label: '111 MMM 02',
    value: '111MMM02'
  },
  {
    label: '222 WWW 02',
    value: '222WWW02'
  },
  {
    label: '333 AAA 02',
    value: '333AAA02'
  },
  {
    label: '444 TTT 02',
    value: '444TTT02'
  }
];

const grnzStandardOptions = [
  {
    label: '578 ACH 02',
    value: '578ACH02'
  },
  {
    label: '289 REJ 02',
    value: '289REJ02'
  },
  {
    label: '374 WIB 02',
    value: '374WIB02'
  },
  {
    label: '486 LHA 02',
    value: '486LHA02'
  }
];

const cities = [
  {
    label: 'Алматы',
    value: 'almaty'
  },
  {
    label: 'Астана',
    value: 'astana'
  }
];

const deliveryTypes = [
  { value: 'delivery', title: 'Адрес доставки' },
  { value: 'pickup', title: 'Самовывоз из СпецЦОН' }
];

export {
  cities,
  deliveryTypes,
  flowTypes,
  grnzPrestigeOptions,
  grnzStandardOptions,
  grnzTypes,
  numberPlateChoise,
  numberPlates,
  options
};
