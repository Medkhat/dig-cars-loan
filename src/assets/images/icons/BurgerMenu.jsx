import * as React from 'react';

function BurgerMenu(props) {
  return (
    <svg width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M4 7h16M3.998 12h15.996M4 17h15.994'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default BurgerMenu;
