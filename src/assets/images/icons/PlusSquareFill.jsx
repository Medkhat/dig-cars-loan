import * as React from 'react';

function PlusSquareFill(props) {
  return (
    <svg width={21} height={20} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M6.326 2.441a3.333 3.333 0 00-3.334 3.334v8.333a3.333 3.333 0 003.334 3.333h8.333a3.333 3.333 0 003.333-3.333V5.775A3.333 3.333 0 0014.66 2.44H6.326zm4.166 3.334c.46 0 .833.373.833.833v2.5h2.5a.834.834 0 010 1.667h-2.5v2.5a.834.834 0 01-1.666 0v-2.5h-2.5a.834.834 0 010-1.667h2.5v-2.5c0-.46.373-.833.833-.833z'
        fill='#72BF44'
      />
    </svg>
  );
}

export default PlusSquareFill;
