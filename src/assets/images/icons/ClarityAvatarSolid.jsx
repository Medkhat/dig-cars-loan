import React from 'react';

export function ClarityAvatarSolid(props) {
  return (
    <svg width='1em' height='1em' viewBox='0 0 36 36' {...props}>
      <path
        d='M30.61 24.52a17.16 17.16 0 0 0-25.22 0a1.51 1.51 0 0 0-.39 1v6A1.5 1.5 0 0 0 6.5 33h23a1.5 1.5 0 0 0 1.5-1.5v-6a1.51 1.51 0 0 0-.39-.98z'
        className='clr-i-solid clr-i-solid-path-1'
        fill='currentColor'
      ></path>
      <circle cx='18' cy='10' r='7' className='clr-i-solid clr-i-solid-path-2' fill='currentColor'></circle>
    </svg>
  );
}
export default ClarityAvatarSolid;
