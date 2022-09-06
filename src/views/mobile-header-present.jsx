import { motion, useCycle } from 'framer-motion';
import React from 'react';
import { useLockBodyScroll } from 'react-use';

import { MenuToggle, Selector, SubBody } from '@/components';
import { ContactsInfo } from '@/views/contacts-info';
import ThemeToggle from '@/views/theme-toggle';

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: 'circle(5px at 30px 30px)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40
    }
  }
};

const lang = [
  { value: 'rus', title: 'Рус' },
  { value: 'kaz', title: 'Каз' }
];

const MobileHeaderPresent = ({ height }) => {
  const [isOpen, toggleOpen] = useCycle(false, true);

  useLockBodyScroll(isOpen);

  return (
    <motion.div initial={false} animate={isOpen ? 'open' : 'closed'} custom={height}>
      <motion.div
        tw='absolute top-0 bottom-0 left-0 w-full h-full bg-primary pt-16 overflow-hidden z-20'
        variants={sidebar}
      >
        <div tw='px-[1.25rem] pb-1 divide-y divide-dark'>
          <div tw='flex justify-between items-center pb-6'>
            <ThemeToggle />
            <Selector
              defaultActiveItem={lang[0].value}
              type='lang'
              items={lang}
              getActiveItem={value => {
                console.log(value);
              }}
              small
            />
          </div>
          <div tw='flex flex-col py-3 space-y-3'>
            <SubBody text='Главная' />
            <SubBody text='Калькулятор' />
          </div>
          <ContactsInfo />
        </div>
      </motion.div>
      <div tw='pb-3'>
        <MenuToggle toggle={toggleOpen} />
      </div>
    </motion.div>
  );
};

export default MobileHeaderPresent;
