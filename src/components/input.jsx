import React, { useState } from 'react';
import { useController } from 'react-hook-form';
import { IMaskInput, useIMask } from 'react-imask';
import InputMask from 'react-input-mask';
import tw from 'twin.macro';

import { Caption } from '@/components/caption';
import { SubBody } from '@/components/sub-body';

/*{
  label?: string;
  type: string;
  subText?: string;
  placeholder: string;
  disabled?: boolean;
  icon?: ReactJSXElement;
  affix?: string;
  mask?: unknown;
}*/

const Input = ({ enableFocus = true, showMask, ...props }) => {
  const [lazy, setLazy] = useState(showMask);
  const { ref, maskRef } = useIMask(props.mask);
  maskRef.current?.updateOptions(props.mask);
  //console.log(ref, maskRef.current?.unmaskedValue);
  const {
    field: { value, onChange, name },
    fieldState: { invalid, error }
  } = useController({ name: props.name, control: props.control, rules: props.rules, shouldUnregister: false });

  const onChangeHandler = value => {
    onChange(value);
  };

  const onFocus = () => {
    setLazy(false);
  };

  const onBlur = () => {
    setLazy(true);
  };

  return (
    <span css={[tw`flex flex-col space-y-1 mt-1 min-w-0 max-w-full w-full relative`, props.disabled && tw`opacity-50`]}>
      {props.label && (
        <label htmlFor={name} tw='ml-s13 text-secondary'>
          <SubBody text={props.label} />
        </label>
      )}
      <span tw='relative' css={[props.twStyle]}>
        <IMaskInput
          id={name}
          name={name}
          mask={props?.mask?.mask}
          min={props?.min}
          prepare={props?.mask?.prepare}
          inputMode={props?.inputMode}
          unmask={true}
          value={value}
          onBlur={() => {
            if (enableFocus) {
              onBlur();
            }
          }}
          onFocus={() => {
            if (enableFocus) {
              onFocus();
            }
          }}
          onAccept={onChangeHandler}
          lazy={lazy}
          placeholderChar={' '}
          autoComplete='off'
          type={props.type}
          disabled={props.disabled}
          placeholder={props.placeholder}
          css={[
            tw`rounded-s14 bg-input outline-none text-primary font-bold placeholder-input
            placeholder-shown:font-normal px-5 py-s13 w-full border border-transparent
            focus:border-input-active disabled:cursor-not-allowed text-s14`,
            props.icon && tw`pl-11`,
            invalid && tw`border-input-invalid focus:border-input-invalid`
          ]}
        />
        <span tw='absolute left-2 inset-y-2'>{props.icon}</span>
        <span tw='absolute text-secondary right-5 inset-y-1/4'>{props.affix}</span>
      </span>

      {(props.subText || invalid) && (
        <span tw='ml-s13 leading-3 bottom-4' css={[props.errorStyle]}>
          <Caption
            text={props.subText || error?.message || ''}
            twStyle={invalid ? tw`text-error` : tw`text-secondary`}
          />
        </span>
      )}
    </span>
  );
};

const Input2 = ({ ...props }) => {
  const {
    field: { value, onChange, name },
    fieldState: { invalid, error }
  } = useController({ name: props.name, control: props.control, shouldUnregister: false });

  const onChangeHandler = value => {
    onChange(value);
  };

  return (
    <span css={[tw`flex flex-col space-y-1 mt-1 min-w-0 max-w-full w-full relative`, props.disabled && tw`opacity-50`]}>
      {props.label && (
        <label htmlFor={name} tw='ml-s13 text-secondary'>
          <SubBody text={props.label} />
        </label>
      )}
      <span tw='relative' css={[props.twStyle]}>
        <InputMask
          id={name}
          name={name}
          value={value}
          mask={props.mask}
          maskChar=' '
          type={props.type}
          inputMode={props.inputMode}
          formatChars={props.formatChars}
          placeholder={props.placeholder}
          onChange={onChangeHandler}
          disabled={props.disabled}
          css={[
            tw`rounded-s14 bg-input outline-none text-primary font-bold placeholder-input
            placeholder-shown:font-normal px-5 py-s13 w-full border border-transparent
            focus:border-input-active disabled:cursor-not-allowed text-s14`,
            props.icon && tw`pl-10`,
            invalid && tw`border-input-invalid focus:border-input-invalid`
          ]}
        />
        <span tw='absolute left-2 inset-y-2'>{props.icon}</span>
        <span tw='absolute text-secondary right-5 inset-y-1/4'>{props.affix}</span>
      </span>

      {(props.subText || invalid) && (
        <span tw='ml-s13 leading-3 bottom-4' css={[props.errorStyle]}>
          <Caption
            text={props.subText || error?.message || ''}
            twStyle={invalid ? tw`text-error` : tw`text-secondary`}
          />
        </span>
      )}
    </span>
  );
};

export { Input, Input2 };
