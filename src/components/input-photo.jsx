import 'twin.macro';

import React from 'react';
import tw from 'twin.macro';

import CameraIcon from '@/assets/images/icons/CameraIcon';

const InputPhoto = ({ text = 'Загрузить документ', name, onChange, disabled, file, onDelete }) => {
  const handleUpload = e => {
    e.preventDefault();
    onDelete();
  };

  return (
    // <label
    //   css={disabled && tw`opacity-50 cursor-not-allowed`}
    //   tw='flex justify-between items-center py-4 px-5 max-w-full min-w-button w-full bg-input border border-grey rounded-s14'
    // >
    //   <input type='file' name={name} onChange={onChange} accept='image/jpeg' disabled={disabled} />
    //   <SubBody
    //     text={file ? String(file.name).substring(0, 50) + '...' : text}
    //     variant='bold'
    //     twStyle={tw`max-w-full`}
    //   />
    //   {file ? (
    //     <div onKeyDown={handleUpload} onClick={handleUpload} aria-hidden='true' tw='cursor-pointer'>
    //       <DeleteIcon />
    //     </div>
    //   ) : (
    //     <CameraIcon tw='text-green' />
    //   )}
    // </label>
    <label
      css={disabled && tw`opacity-50 cursor-not-allowed`}
      tw='flex justify-center items-center w-[50px] h-[45.91px] mt-1 relative bg-input rounded-s14 cursor-pointer'
    >
      <input type='file' name={name} onChange={onChange} accept='image/jpeg' disabled={disabled} />
      <CameraIcon tw='text-green relative w-[25px] h-[25px]' />
    </label>
  );
};

export { InputPhoto };
