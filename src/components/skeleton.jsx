import React from 'react';

const Skeleton = () => {
  return (
    <div className='flex-1 space-y-6 p-5 animate-pulse'>
      <div className='h-2 bg-slate-200 dark:bg-secondary rounded'></div>
      <div className='space-y-3'>
        <div className='grid grid-cols-3 gap-4'>
          <div className='h-2 bg-slate-200 dark:bg-secondary rounded col-span-2'></div>
          <div className='h-2 bg-slate-200 dark:bg-secondary rounded col-span-1'></div>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div className='h-2 bg-slate-200 dark:bg-secondary rounded col-span-2'></div>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div className='h-2 bg-slate-200 dark:bg-secondary rounded col-span-2'></div>
          <div className='h-2 bg-slate-200 dark:bg-secondary rounded col-span-1'></div>
          <div className='h-2 bg-slate-200 dark:bg-secondary rounded col-span-2'></div>
        </div>
        <div className='h-2 bg-slate-200 dark:bg-secondary rounded'></div>
      </div>
    </div>
  );
};
export default Skeleton;
