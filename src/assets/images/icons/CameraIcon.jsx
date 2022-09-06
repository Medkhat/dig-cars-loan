import React from 'react';

function CameraIcon(props) {
  return (
    <svg width='24px' height='24px' {...props} viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        width='32px'
        height='32px'
        d='M8.999 2.014a1.02 1.02 0 00-.719.281l-1.719 1.72h-.562a4 4 0 00-4 4v9a4 4 0 004 4h12a4 4 0 004-4v-9a4 4 0 00-4-4h-.562l-1.719-1.72a1.02 1.02 0 00-.719-.28h-6zm3 5a5 5 0 110 10 5 5 0 010-10zm6 0a1 1 0 110 2 1 1 0 010-2zm-6 2a3 3 0 100 6 3 3 0 000-6z'
      />
    </svg>
  );
}

export default CameraIcon;
