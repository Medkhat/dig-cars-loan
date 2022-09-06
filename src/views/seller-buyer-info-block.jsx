import React from 'react';

const style = {
  wrapper: 'p-5 bg-secondary'
};

const SellerBuyerInfoBlock = ({ children, twStyle }) => {
  return (
    <div className={style.wrapper} css={[twStyle]}>
      {children}
    </div>
  );
};
export default SellerBuyerInfoBlock;
