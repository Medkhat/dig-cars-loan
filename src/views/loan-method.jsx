import React from 'react';
import { Controller } from 'react-hook-form';

import { ContainerBlock, Selector } from '@/components';
import { selectorItems } from '@/helper/constants';

const LoanMethod = ({ title, name, control, twStyle, disabled = false }) => {
  return (
    <ContainerBlock title={title} twStyle={twStyle}>
      <Controller
        render={({ field: { value, onChange } }) => (
          <Selector items={selectorItems} defaultActiveItem={value} getActiveItem={onChange} disabled={disabled} />
        )}
        name={name}
        control={control}
      />
    </ContainerBlock>
  );
};

export default LoanMethod;
