import { motion, useCycle } from 'framer-motion';
import { test } from 'ramda';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLockBodyScroll } from 'react-use';
import tw from 'twin.macro';

import { MenuToggle } from '@/components';
import { ContactsInfo } from '@/views/contacts-info';
import { SellerSteps } from '@/views/seller-steps';
import { StepsBlock } from '@/views/steps-block';
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

const styles = {
  container: [tw``]
};

const Menu = ({ height, currentStep }) => {
  /* console.log(height);
  console.log('menu');*/
  const [isOpen, toggleOpen] = useCycle(false, true);

  useLockBodyScroll(isOpen);

  /*  useEffect(() => {
    const root = document.getElementsByClassName('body');
    if (isOpen) {
      root[0].style.overflow = 'hidden';
    } else {
      root[0].style.overflow = 'auto';
    }
  }, [isOpen]);*/

  return (
    <motion.div css={styles.container} initial={false} animate={isOpen ? 'open' : 'closed'} custom={height}>
      <motion.div
        tw='absolute top-0 bottom-0 left-0 w-full h-full bg-primary pt-16 overflow-hidden z-20'
        variants={sidebar}
      >
        <MenuBlock currentStep={currentStep} />
      </motion.div>
      <MenuToggle toggle={toggleOpen} />
    </motion.div>
  );
};

export { Menu };

/*const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};*/

const lang = [
  { value: 'rus', title: 'Рус' },
  { value: 'kaz', title: 'Каз' }
];

const MenuBlock = ({ currentStep }) => {
  const [isMainFlow, setIsMainFlow] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (test(/^\/main/, pathname)) {
      setIsMainFlow(true);
    }
  }, [pathname]);

  return (
    <div tw='px-[1.25rem] pb-1 divide-y divide-dark'>
      <div tw='flex justify-between items-center pb-6'>
        <ThemeToggle />
        {/* <Selector
          defaultActiveItem={lang[0].value}
          type='lang'
          items={lang}
          getActiveItem={value => {
            console.log(value);
          }}
          small
        /> */}
      </div>
      {isMainFlow ? <StepsBlock /> : <SellerSteps currentStep={currentStep} />}
      <ContactsInfo />
    </div>
  );
};
