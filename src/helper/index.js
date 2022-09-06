import {
  and,
  compose,
  curry,
  equals,
  filter,
  find,
  findLast,
  join,
  lensIndex,
  map,
  mathMod,
  over,
  path,
  propEq,
  sort,
  split,
  toLower,
  toUpper,
  uniq
} from 'ramda';
import { IMask } from 'react-imask';

import { steps } from '@/helper/steps';

import { decisionTypes } from './constants';

export const toTitle = compose(join(''), over(lensIndex(0), toUpper));

export const capitalizeText = compose(join(' '), map(toTitle), map(toLower), split(' '));

export const calcFromPercent = curry((percent, value) => {
  return (value * percent) / 100;
});

export const calcPercentFromSum = (max, value) => {
  return max === 0 ? 0 : (value * 100) / max;
};

export const throughNByValue = curry((limit, value, n) => (n > limit ? false : [n, n + value]));

export const declOfNum = n => {
  n = mathMod(Math.abs(n), 100);
  const n1 = mathMod(n, 10);
  if (and(n > 10, n < 20)) return 'Лет';
  if (and(n1 > 1, n1 < 5)) return 'Года';
  if (equals(n1, 1)) return 'Год';
  return 'Лет';
};

export const isNumber = item => !!Number(item);

const parsePeriod = value => {
  if (Number(value)) {
    return value;
  }
  return compose(findLast(isNumber), split(' '))(value);
};

export const getPrice = value => {
  // parsePeriod(value)

  console.log(Number(parsePeriod(value)));

  // const price = Number(value?.replaceAll(' ', ''));
  return Number(parsePeriod(value));
};

export const getCurrentStepData = pathname => {
  return find(propEq('route', pathname))(steps);
};

const isSellerFlow = propEq('step', 'seller_flow');
const isSpouseFlow = propEq('step', 'spouse_flow');

export const defineSellerStep = pathname => {
  return compose(find(propEq('route', pathname)), filter(isSellerFlow))(steps);
};

export const defineSpouseStep = pathname => {
  return compose(find(propEq('route', pathname)), filter(isSpouseFlow()))(steps);
};

export const plateMask = v => {
  console.log(v);
  return /^[a-zA-Z]+$/.test(v)
    ? {
        mask: 'a 000 aaa',
        prepare: function (str) {
          return str.toUpperCase();
        }
      }
    : {
        mask: '000 aaa 00',
        prepare: function (str) {
          return str.toUpperCase();
        }
      };
};

export const getProfitableSolution = (solutions, status, calculationData) => {
  const REQUESTED = find(propEq('solution_type', decisionTypes.REQUESTED))(solutions);
  const MOST_EQUAL_REQUESTED = find(propEq('solution_type', decisionTypes.MOST_EQUAL_REQUESTED))(solutions);
  const MOST_PROFITABLE_SOLUTION = find(propEq('solution_type', decisionTypes.MOST_PROFITABLE_SOLUTION))(solutions);
  const ALTERNATIVE = find(propEq('solution_type', decisionTypes.ALTERNATIVE))(solutions);

  const scorringSolution = REQUESTED || MOST_EQUAL_REQUESTED || MOST_PROFITABLE_SOLUTION || ALTERNATIVE || solutions[0];

  const finalSolution = {
    ...calculationData,
    period: {
      value: Math.floor(scorringSolution?.period / 12),
      caption: declOfNum(scorringSolution?.period / 12).toLocaleLowerCase()
    },
    interest_rate: scorringSolution?.interest_rate,
    down_payment: scorringSolution?.down_payment,
    repayment_method: calculationData?.repayment_method,
    monthly_payment: scorringSolution?.monthly_payment,
    credit_amount: scorringSolution?.principal,
    solution_id: scorringSolution?.id
  };

  return finalSolution;
};

export const getTariffs = solutions => {
  const MIN_PMT_SOLUTION = find(propEq('solution_type', decisionTypes.MIN_PMT_SOLUTION))(solutions);
  const MOST_PROFITABLE = find(propEq('solution_type', decisionTypes.OPTIMAL))(solutions);
  const MIN_RATE_SOLUTION = find(propEq('solution_type', decisionTypes.MIN_RATE_SOLUTION))(solutions);

  const tariffs = [MIN_RATE_SOLUTION, MOST_PROFITABLE, MIN_PMT_SOLUTION].filter(el => el !== undefined);

  return tariffs;
};

export const capitalizeFirstLetter = string => {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1)?.toLowerCase();
};

export const getNumberPlates = (data, autoIdentifierType) => {
  let grnzResult = [];
  console.log('getNumberPlates: ', data);
  grnzResult = data?.grnz_list.map(item => ({
    value: item.grnz,
    label: item.grnz,
    needs_payment: item?.needs_payment || false
  }));

  return grnzResult;
};

export const findGrnz = (grnz, grnzList) => {
  return find(propEq('value', grnz))(grnzList);
};

export const getNumberLocale = value => {
  return Number(value).toLocaleString();
};

export const collectConstructor = (data, calculationData) => {
  console.log('collectConstructor: ', data);
  return {
    solution_id: calculationData?.solution_id,
    grnz_info: {
      auto_psc_id: data.tcon,
      shape: data.grnz_type,
      rarity: data.auto_identifier_type ? data.auto_identifier_type : '0',
      grnz: data?.grnz === 'new' ? data.auto_identifier_new : data.auto_identifier,
      is_own: data?.grnz === 'own'
    }
  };
};

export const selectMap = (data, value) => {
  let items = [];

  if (data && data?.length > 0) {
    items = data?.map(item => ({
      value: item[value],
      label: item.name
    }));
  }

  return items;
};

const diff = function (a, b) {
  return a - b;
};

export const getDownPaymentRates = data => {
  const solution = data.map(item => item.down_payment_rate);
  return sort(diff, uniq(solution))?.map(item => ({ value: item, title: `${item * 100}%` }));
};

export const getYears = data => {
  const solution = data.map(item => item.period);
  return sort(diff, uniq(solution))?.map(item => ({
    value: item,
    title: `${Number(item / 12).toFixed()}`,
    subItem: declOfNum(item / 12)
  }));
};

export const getAccessYears = (data, paymentRate) => {
  return data?.filter(item => {
    if (item.down_payment_rate === paymentRate) {
      return item.period;
    }
  });
};

export const phoneMask = IMask.createMask({
  mask: [{ mask: '+{0} (000) 000 00 00' }, { mask: '+{7} (000) 000 00 00' }]
});

export const formatter = new Intl.NumberFormat('ru');

export const takeFailMessage = messages => {
  return compose(path(['data', 'message']), find(and(propEq('is_final', true), propEq('is_success', false))))(messages);
};

export const getLoanAmount = finalSolution => {
  if (!finalSolution?.included_in_credit) {
    return Number(finalSolution?.down_payment + finalSolution?.additional_principal).toFixed();
  }

  return Number(finalSolution?.principal + finalSolution?.additional_principal).toFixed();
};

export const getCalcPrincipal = finalSolution => {
  //console.log('finalSolution', finalSolution);

  if (finalSolution?.included_in_credit) {
    return Number(finalSolution?.principal).toFixed();
  }

  return Number(finalSolution?.principal).toFixed();
};

export const getCalcDownPayment = finalSolution => {
  if (!finalSolution?.included_in_credit) {
    return Number(finalSolution?.down_payment + finalSolution?.additional_principal).toFixed();
  }

  return Number(finalSolution?.down_payment).toFixed();
};

export const parseNumeric = (value, type = '') => {
  if (type === 'interest_rate') {
    return value;
  }
  return String(value)?.replace(/[^0-9]/g, '');
};

export const identifySuffix = (suffix, value) => {
  if (suffix === 'year') {
    return declOfNum(Number(parseNumeric(value))).toLocaleLowerCase();
  }

  return suffix;
};

export function parseLocaleNumber(stringNumber, locale) {
  var thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, '');
  var decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, '');

  return parseFloat(
    stringNumber
      .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
      .replace(new RegExp('\\' + decimalSeparator), '.')
  );
}

export function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = 1024;

  const parts = base64Data.split(';base64,');

  var byteCharacters = window.atob(parts[1]);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

export function validateIIN(iin) {
  let new_iin = iin?.replace(/[^+\d]/g, '') || null,
    res = true,
    month = '',
    day = '',
    gender = '',
    sum = 0,
    j = 1;

  if (new_iin?.length == 12) {
    month = new_iin.substr(2, 2);
    day = new_iin.substr(4, 2);
    gender = new_iin.substr(6, 1);

    if (gender < 0 || gender > 9) {
      res = false;
    }

    if (month < 1 || month > 12) {
      res = false;
    }

    if (month == 4 || month == 6 || month == 9 || month == 11) {
      if (day < 1 || day > 30) {
        res = false;
      }
    } else if (month == 2) {
      if (day < 1 || day > 29) {
        res = false;
      }
    } else {
      if (day < 1 || day > 31) {
        res = false;
      }
    }

    for (let i = 0; i < new_iin.length - 1; i++) {
      sum += new_iin[i] * j;
      j += 1;
    }

    if (sum % 11 == 10) {
      sum = 0;
      j = 3;
      for (let i = 0; i < new_iin.length - 1; i++) {
        sum += new_iin[i] * j;
        j += 1;
        if (j == 12) {
          j = 1;
        }
      }
    }

    if (sum % 11 != new_iin[11]) {
      res = false;
    }
  }

  return res;
}
export const normalizeDate = date => {
  if (!date) return '';
  const dateArr = date.split('-');
  return `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`;
};
