import { has } from 'ramda';
import React from 'react';
import { useContext } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';

import successDark from '@/assets/images/success-dark.svg';
import successLight from '@/assets/images/success-light.svg';
import { Caption } from '@/components/caption';
import { SubBody } from '@/components/sub-body';
import { ThemeContext } from '@/contexts/theme-context';

const styles = {
  container: ({ disabled }) => [tw`min-w-button w-full`, disabled && tw`opacity-50`]
};

const Checkbox = props => {
  const {
    field: { value, onChange, name, ref },
    fieldState: { error }
  } = useController({ name: props.name, control: props.control, rules: props.rules });
  const { theme } = useContext(ThemeContext);

  const hasLink = has('link');

  return (
    <div css={styles.container({ disabled: props.disabled })}>
      <div tw='flex items-start '>
        <input
          type='checkbox'
          id={name}
          name={name}
          disabled={props.disabled}
          checked={value}
          onChange={onChange}
          ref={ref}
          className='opacity-0 absolute h-8 w-8'
        />
        {value ? (
          <>
            {theme === 'dark' ? (
              <img src={successDark} alt='success' className='mr-2' />
            ) : (
              <img src={successLight} alt='success' className='mr-2' />
            )}
          </>
        ) : (
          <div tw='bg-transparent border-2 rounded-md border-checkbox w-[1.125rem] h-[1.125rem] flex flex-shrink-0 justify-center items-center mr-2' />
        )}
        {/* <div tw='bg-transparent border-2 rounded-md border-checkbox w-[1.125rem] h-[1.125rem] flex flex-shrink-0 justify-center items-center mr-2'>
          {value && <img src={success} alt='success icon' />}
        </div> */}
        <label htmlFor={name} tw='select-none flex flex-wrap'>
          <SubBody text={props.label || ''} />
          {hasLink(props) && (
            <a
              href={props.disabled ? '/#' : props.link?.href || '#'}
              target='_blank'
              className='block text-green text-s14 underline pl-1'
            >
              {props.link?.text}
            </a>
          )}
        </label>
      </div>
      {error && <Caption text={error.message || ''} twStyle={tw`text-error relative top-1`} />}
    </div>
  );
};

export { Checkbox };
