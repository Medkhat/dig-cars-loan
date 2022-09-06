import React from 'react';
import { Controller } from 'react-hook-form';
import RSelect from 'react-select';
import tw from 'twin.macro';

import { SubBody } from '.';

/*SelectProps {
  options: any;
  icon?: ReactJSXElement;
}*/

const Select = ({ options, icon, control, name, rules, label, placeholder, isLoading, disabled = false }) => {
  const styles = icon => ({
    control: provided => [
      { ...provided },
      {
        ...tw`bg-input font-normal text-s14  rounded-2xl px-3 py-3 pl-5 shadow-none border border-transparent hover:border-transparent`
      },
      { ...tw`focus-within:border-input-active` },
      icon && { ...tw`pl-10` }
    ],
    indicatorSeparator: provided => ({ ...provided, ...tw`hidden` }),
    singleValue: provided => ({ ...provided, ...tw`text-secondary font-bold text-s14 m-0` }),
    input: provided => ({ ...provided, ...tw`text-secondary font-bold text-s14 m-0` }),
    valueContainer: provided => ({ ...provided, ...tw`p-0` }),
    dropdownIndicator: provided => ({ ...provided, ...tw`p-0` }),
    placeholder: provided => ({ ...provided, ...tw`font-normal text-secondary` }),
    menu: provided => ({ ...provided, ...tw`bg-secondary` }),
    option: (base, { isFocused, isSelected }) => {
      const customSelected = isSelected ? tw`bg-tertiary text-primary` : tw``;
      const customFocused = isFocused ? tw`bg-input` : tw``;
      return { ...base, ...customSelected, ...customFocused, ...tw`active:bg-tertiary text-s14` };
    }
  });

  return (
    <div tw='relative w-full min-w-button'>
      {label && (
        <label htmlFor={name} tw='ml-s13 text-secondary pb-1'>
          <SubBody text={label} />
        </label>
      )}
      <Controller
        name={name}
        rules={rules}
        control={control}
        render={({ field: { value, onChange, name, ref } }) => (
          <RSelect
            isLoading={isLoading}
            placeholder={placeholder}
            options={options}
            isDisabled={disabled}
            name={name}
            value={options?.find(c => c.value === value) || ''}
            onChange={data => {
              const { value } = data;
              onChange(value);
            }}
            styles={styles(icon)}
          />
        )}
      />
      <span tw='absolute inset-y-2 left-1 flex justify-center items-center'>{icon}</span>
    </div>
  );
};

export { Select };
