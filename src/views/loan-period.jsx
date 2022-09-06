import 'twin.macro';

import { __, applySpec, compose, curry, divide, identity, map, multiply, unfold } from 'ramda';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

import ArrowIcon from '@/assets/images/icons/ArrowIcon';
import { BodyText } from '@/components';
import SliderSelector from '@/components/slider-selector';
import { declOfNum, throughNByValue } from '@/helper';

const oneYear = divide(__, 12);

const getMetrics = applySpec({
  value: multiply(12),
  title: identity,
  subItem: declOfNum
});

const getYearsByMaxPeriod = curry((max, min) =>
  compose(map(getMetrics), map(oneYear), unfold(__, min), throughNByValue(max))(min)
);

const LoanPeriod = ({ title, max, min, name, control, twStyle }) => {
  const periods = getYearsByMaxPeriod(max)(min);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  return (
    <div tw='p-5 bg-secondary flex flex-col space-y-4 sm:rounded-2xl' css={[twStyle]}>
      <div tw='flex justify-between items-center'>
        <BodyText text={title} variant='bold' />
        <div tw='flex space-x-2'>
          <div tw='cursor-pointer rotate-180 mr-[23px]'>
            <ArrowIcon setPrevEl={setPrevEl} setNextEl={setNextEl} />
          </div>
          {/* <div ref={node => setNextEl(node)} tw='cursor-pointer'>
            <ArrowIcon />
          </div> */}
        </div>
      </div>
      <Controller
        render={({ field: { value, onChange } }) => (
          <SliderSelector
            variant='slider'
            items={periods}
            defaultActiveItem={value}
            getActiveItem={onChange}
            nextEl={nextEl}
            prevEl={prevEl}
          />
        )}
        name={name}
        control={control}
      />
    </div>
  );
};

export default LoanPeriod;
