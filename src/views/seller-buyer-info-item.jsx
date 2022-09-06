import React from 'react';
import tw from 'twin.macro';

import { BodyText, Caption } from '@/components';
import { capitalizeFirstLetter } from '@/helper';

const SellerBuyerInfoItem = ({ title = '', body = '' }) => {
  const formattingText = () => {
    const names = String(body).split(' ');
    const formattedName = names.map(name => capitalizeFirstLetter(name)).join(' ');

    return formattedName;
  };

  return (
    <div>
      <Caption text={title} twStyle={tw`text-secondary block`} />
      <BodyText text={formattingText()} variant='bold' twStyle={tw`text-s14`} />
    </div>
  );
};
export default SellerBuyerInfoItem;
