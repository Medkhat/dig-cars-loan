import React, { useEffect } from 'react';
import { useController } from 'react-hook-form';
import OtpInputComponent from 'react-otp-input';
import tw from 'twin.macro';

import { Caption } from '@/components/caption';
import { SubBody } from '@/components/sub-body';

const OtpInput = ({
  control,
  name,
  label,
  shouldAutoFocus,
  disabled,
  rules,
  handleVerify = () => {},
  numInputs = 4
}) => {
  const {
    field: { onChange, value },
    fieldState: { error, invalid }
  } = useController({ control, name, rules });

  useEffect(() => {
    if (value.length === 4) {
      handleVerify(value);
    }
  }, [handleVerify, value]);

  console.log(error);

  return (
    <div css={[tw`flex flex-col space-y-1 min-w-0 max-w-button w-full`, disabled && tw`opacity-50`]}>
      {label && (
        <label htmlFor={name} tw='text-secondary'>
          <SubBody text={label} />
        </label>
      )}
      <OtpInputComponent
        shouldAutoFocus={shouldAutoFocus}
        value={value}
        onChange={onChange}
        hasErrored={invalid}
        isInputNum={true}
        numInputs={numInputs}
        inputStyle={tw`border border-transparent outline-none text-primary font-bold bg-input w-[50px] h-[60px] mr-2 rounded-2xl`}
        focusStyle={tw`border-input-active`}
        errorStyle={tw`border-input-invalid focus:border-input-invalid`}
      />
      {invalid && (
        <span tw='ml-s13 leading-3'>
          <Caption text={error?.message} twStyle={tw`text-error relative right-3`} />
        </span>
      )}
    </div>
  );
};

export { OtpInput };
