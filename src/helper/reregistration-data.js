const bodyContents = {
  first: [
    {
      status: 'finished',
      text: 'Запрос отправлен продавцу авто'
    },
    {
      status: 'examination',
      text: 'Продавец снял авто с учета'
    }
  ],
  second: [
    {
      status: 'finished',
      text: 'Запрос отправлен в гос. орган'
    },
    {
      status: 'examination',
      text: 'Процесс постановки авто на учет завершен'
    }
  ],
  third: [
    {
      status: 'examination',
      text: 'Запрос отправлен продавцу авто'
    },
    {
      status: 'wait',
      text: 'Поставновка авто на обременение (завершится после подписания Договора залога)'
    }
  ]
};

export { bodyContents };
