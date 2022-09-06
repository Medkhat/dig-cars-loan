import React from 'react';
import CurrencyFormat from 'react-currency-format';
import { Controller } from 'react-hook-form';
import tw from 'twin.macro';

import { Caption } from '@/components/caption';
import { SubBody } from '@/components/sub-body';

const CurrencyInput = ({ name, control, disabled, subText, label, affix }) => {
  return (
    <div css={[tw`flex flex-col space-y-1 min-w-0 max-w-button w-full`, disabled && tw`opacity-50`]}>
      {label && (
        <label htmlFor={name} tw='ml-s13 text-secondary'>
          <SubBody text={label} />
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
          <>
            <div tw='relative'>
              <CurrencyFormat
                name={name}
                id={name}
                value={value}
                type='tel'
                thousandSeparator=' '
                decimalScale={0}
                onValueChange={values => onChange(values.floatValue || 0)}
                onBlur={onBlur}
                ref={ref}
                suffix={'\u2004₸'}
                disabled={disabled}
                css={[
                  tw`rounded-s14 bg-input outline-none text-primary font-bold placeholder-input
            placeholder-shown:font-normal px-5 py-s13 w-full border border-transparent
            focus:border-input-active disabled:cursor-not-allowed`,
                  error && tw`border-input-invalid focus:border-input-invalid`
                ]}
              />
              <span tw='absolute text-dark-grey right-5 inset-y-1/4'>{affix}</span>
            </div>

            {subText && !error && (
              <span tw='ml-s13 pt-1 leading-3'>
                <Caption text={subText || ''} twStyle={tw`text-secondary`} />
              </span>
            )}
            {error && (
              <span tw='ml-s13 pt-1 leading-3'>
                <Caption text={error.message || ''} twStyle={tw`text-error`} />
              </span>
            )}
          </>
        )}
      />
    </div>
  );
};

export { CurrencyInput };
