import 'twin.macro';
import 'twin.macro';

import React from 'react';
import tw from 'twin.macro';

import DeleteIcon from '@/assets/images/icons/DeleteIcon';
import EntypoAttachment from '@/assets/images/icons/EntypoAttachment';
import { SubBody } from '@/components/sub-body';

const InputFile = ({ text = 'Загрузить документ', name, onChange, disabled, file, onDelete }) => {
  const handleUpload = e => {
    e.preventDefault();
    onDelete();
  };

  return (
    <label tw='flex justify-between items-center py-4 px-5 max-w-full min-w-button w-full bg-input border border-grey rounded-s14'>
      <input type='file' name={name} onChange={onChange} accept='.pdf' disabled={disabled} />
      <SubBody
        text={file ? String(file.name).substring(0, 50) + '...' : text}
        variant='bold'
        twStyle={tw`max-w-full`}
      />
      {file ? (
        <div onKeyDown={handleUpload} onClick={handleUpload} aria-hidden='true' tw='cursor-pointer'>
          <DeleteIcon />
        </div>
      ) : (
        <EntypoAttachment tw='text-green' />
      )}
    </label>
  );
};

export { InputFile };
