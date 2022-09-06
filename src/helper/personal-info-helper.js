import { IMask } from 'react-imask';

const regex = /[^A-Za-z0-9]+/;

const grnzMask = IMask.createMask({
  mask: [
    {
      mask: '000 aaa 00',
      prepare: function (str) {
        return str.toUpperCase();
      },
      definitions: {
        a: /^[a-zA-Z]+$/
      }
    },
    {
      mask: 'a 000 aaa',
      prepare: function (str) {
        return str.toUpperCase();
      },
      definitions: {
        a: /^[a-zA-Z]+$/
      }
    }
  ]
});
const techPassport = IMask.createMask({
  mask: [
    {
      mask: 'aa 00000000',
      prepare: function (str) {
        return str.toUpperCase();
      },
      definitions: {
        a: /^[a-zA-Z]+$/
      }
    }
  ]
});

const identifierType = [
  { value: 'GRNZ', title: 'Указать гос. номер' },
  { value: 'VIN', title: 'Указать VIN код' }
];

const letterRegex = /^[a-zA-Z]+$/;

const checkVinCode = str => {
  if (/^([a-zA-Z0-9]+)$/.test(str) && str.indexOf(' ') === -1) {
    return true;
  }

  return false;
};

export { checkVinCode, grnzMask, identifierType, letterRegex, techPassport };
