import React from 'react';
import tw from 'twin.macro';

import { BodyText, Caption, CurrencyInput } from '@/components';
import Gauge from '@/views/gauge';

const styles = {
  container: ({ twStyle }) => [tw`flex bg-secondary sm:rounded-2xl`, twStyle],
  input: [tw`flex-1`],
  gauge: [tw`flex justify-center items-start ml-5 mt-[8px]`]
};

const SpeedometerBlock = ({ caption, title, control, name, disabled, min, max, affix, twStyle }) => {
  return (
    <div css={styles.container({ twStyle })}>
      <div css={styles.input}>
        <div tw='pb-4 flex flex-col space-y-1 min-h-[54px] sm:min-h-0'>
          <BodyText text={title} variant='bold' />
          {caption && <Caption text={caption} twStyle={tw`text-secondary`} />}
        </div>

        <CurrencyInput name={name} control={control} disabled={disabled} affix={affix} />
      </div>
      <div css={styles.gauge}>
        <Gauge min={min} max={max} name={name} control={control} />
      </div>
    </div>
  );
};

export default SpeedometerBlock;
