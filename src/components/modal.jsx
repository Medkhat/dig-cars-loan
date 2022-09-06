import 'twin.macro';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import tw from 'twin.macro';

import CloseIcon from '@/assets/images/icons/CloseIcon';

import { BodyText } from '.';

const Modal = ({
  setOpen,
  open = false,
  children,
  title,
  twStyle,
  headerStyle,
  wrapperStyle,
  outsideClose = true,
  withBlur = false
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleOutside = e => {
    if (outsideClose) {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
          css={[
            tw`min-h-screen overflow-y-scroll flex fixed top-0 left-0 bottom-0 right-0 z-50 bg-modal sm:p-5 !mt-[-5px]`,
            wrapperStyle,
            withBlur && tw`backdrop-blur-sm`
          ]}
          onClick={handleOutside}
        >
          <motion.div
            css={[twStyle]}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: '0.5' }}
            tw='p-8 m-auto bg-primary'
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <div className='flex justify-between' css={[headerStyle]}>
              <BodyText text={title} variant='bold' />
              <div className='self-center'>
                <CloseIcon onClick={handleClose} />
              </div>
            </div>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export { Modal };
