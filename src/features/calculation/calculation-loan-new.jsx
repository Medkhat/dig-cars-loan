export const calculationLoan = ({ amount, period, percentage, paymentType, setGesv, insurance }) => {
  let data = { amount, period, percentage, isAnnuity: paymentType === 'ANNUITY' ? true : false, insurance };
  let result = parseInt(calculate(data)[0]) || 0;
  setGesv(calculate(data)[1]);
  const formatter = new Intl.NumberFormat('ru-RU');
  return formatter.format(result.toFixed(0)) || 1;
};

let commision = 11500; // Статично
let kvbs = 0; // Статично
//var gesv = 0;

function calculate(data) {
  return data.isAnnuity
    ? calculate_annuity(data.amount, data.period, data.percentage, commision, data.insurance)
    : calculate_equal(data.amount, data.period, data.percentage, kvbs, commision, data.insurance);
}

// Аннуитет
function calculate_annuity(amount, period, interest, commision, insurance = []) {
  let coeff_result = get_coeff_total(period, interest);
  let coeff_total = coeff_result[0];
  let day_counter = coeff_result[1];

  let total_insurance = 0;
  insurance.filter(item => item > 0).map(item => (total_insurance = total_insurance + amount * (item / 100)));
  let new_amount = amount + total_insurance;

  let result = (amount * (interest / 100)) / 12;
  let multi = 1 - 1 / Math.pow(1 + interest / 100 / 12, period);

  //let monthly_payment = Math.round((new_amount / coeff_total))
  let monthly_payment = Math.round(result / multi);

  let monthly_payment_dynamic = monthly_payment;
  let outstanding = new_amount;

  for (let i = 0; i < period; i++) {
    let com = ((outstanding * (interest / 100)) / 360) * day_counter[i][0];
    com = Math.round(com * 100) / 100;

    if (i == period - 1) {
      monthly_payment_dynamic = Math.round((outstanding + com) * 100) / 100;
    }

    let real = Math.round((monthly_payment_dynamic - com) * 100) / 100;
    outstanding = Math.round((outstanding - real) * 100) / 100;
    day_counter[i].push(monthly_payment_dynamic);
  }

  day_counter.splice(0, 0, [0, 0, commision - new_amount]);

  let gesv = calculate_gesv(day_counter);
  return [monthly_payment, gesv];
}

// # Равными долями
function calculate_equal(amount, period, interest, kvbs, commision, insurance = []) {
  let total_insurance = 0;
  insurance.filter(item => item > 0).map(item => (total_insurance = total_insurance + amount * (item / 100)));
  let new_amount = amount + total_insurance;

  let main = (new_amount + total_insurance) / period;
  let com = (new_amount * interest) / 100 / 12;

  let monthly_payment = Math.round(main + com + kvbs);

  let coeff_result = get_coeff_total(period, interest);
  let day_counter = coeff_result[1];
  let outstanding = new_amount;

  for (let i = 0; i < period; i++) {
    com = (outstanding * interest) / 100 / 12;
    outstanding = outstanding - main;
    day_counter[i].push(main + com + kvbs);
  }

  day_counter.splice(0, 0, [0, 0, commision - new_amount]);

  let gesv = calculate_gesv(day_counter);
  return [monthly_payment, gesv];
}

// Вспомогательные методы
function get_coeff_total(period, interest) {
  let current_date = new Date();
  let total_days = 0;
  let total_coeff = 0;
  let day_counter = [];

  for (let i = 1; i <= period; i++) {
    let day_count = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).getDate();
    total_days = total_days + day_count;

    let coeff = 1 / (1 + interest / 100 / 12) ** (total_days / 30);

    total_coeff = total_coeff + coeff;
    current_date.setDate(current_date.getDate() + day_count);

    day_counter.push([day_count, total_days]);
  }

  return [total_coeff, day_counter];
}

function calculate_gesv(day_counter) {
  let gesv = 0.05;
  let step = 0.05;
  let residual = 1;
  let epsilon = 0.0001;
  let limit = 10000;

  while (Math.abs(residual) > epsilon && limit > 0) {
    limit = limit - 1;
    residual = 0.0;

    day_counter.forEach((item, i) => {
      residual = residual + item[2] / gesv ** (item[1] / 360.0);
    });
    if (Math.abs(residual) > epsilon) {
      if (residual > 0) {
        gesv = gesv + step;
      } else {
        gesv = gesv - step;
        step = step / 2;
      }
    }
  }

  let percentage = (gesv - 1) * 100;
  return Math.round(percentage * 10) / 10;
}
