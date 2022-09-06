import React, { useContext } from 'react';
import tw from 'twin.macro';

import { BodyText, Caption } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import { identifySuffix, parseNumeric } from '@/helper';

const style = {
  desktop: tw`bg-secondary`,
  mobile: tw`bg-tertiary`,
  price: ({ value, newValue }) => {
    const parseNewValue = parseNumeric(newValue);
    const parseValue = parseNumeric(value);

    return Number(parseValue) > Number(parseNewValue)
      ? tw`text-green whitespace-nowrap`
      : tw`text-error whitespace-nowrap`;
  }
};

const LoanInfoBlock = ({
  title,
  value,
  newValue,
  icon,
  twStyle,
  valueStyle,
  suffix,
  text,
  newText,
  type,
  additionalData
}) => {
  const { isDesktop } = useContext(DeviceInfoContext);

  return (
    <div
      className='flex sm:items-center space-x-2 px-2 py-2 sm:p-4'
      css={[isDesktop ? style.desktop : style.mobile, twStyle]}
      style={{
        gridTemplateColumns: isDesktop
          ? 'repeat(6, minmax(max-content, 16.666%))'
          : 'repeat(3, minmax(max-content, 33.3333%))'
      }}
    >
      {icon && <div className='w-5 h-5 rounded-full bg-primary hidden sm:flex items-center justify-center'>{icon}</div>}
      <div className='flex '>
        <div>
          <Caption text={title} twStyle={tw`text-secondary mb-1`} />
          {newValue && !isNaN(newValue) && newValue !== value ? (
            <>
              <BodyText
                text={`${newText} ${identifySuffix(suffix, newValue)}`}
                variant='bold'
                twStyle={style.price({ value, newValue })}
              />
              <Caption text={`${text} ${identifySuffix(suffix, value)}`} twStyle={tw`line-through text-secondary`} />
            </>
          ) : (
            <BodyText
              text={`${text} ${identifySuffix(suffix, value) || ''}`}
              variant='bold'
              twStyle={valueStyle || '-'}
            />
          )}
        </div>
        {type === 'interest_rate' && (
          <div tw='flex flex-col ml-1 pb-1 justify-end'>
            <Caption text={`(ГЭСВ ${additionalData} %)`} twStyle={tw`text-[8px] whitespace-nowrap`} />
          </div>
        )}
      </div>
    </div>
  );
};
export default LoanInfoBlock;
