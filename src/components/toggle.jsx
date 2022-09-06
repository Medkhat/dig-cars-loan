import { motion } from 'framer-motion';
import React from 'react';
import tw from 'twin.macro';

const spring = {
  type: 'spring',
  stiffness: 700,
  damping: 30
};

const styles = {
  container: ({ isOn }) => [
    tw`flex items-center bg-tertiary px-[4px] py-[2px] rounded-full w-[4.125rem] h-8 relative `,
    isOn ? tw`justify-end` : tw`justify-start`
  ],
  toggle: [tw`w-7 h-7 bg-button rounded-full p-1 text-white flex justify-center items-center`],
  right: ({ isOn }) => [tw`absolute right-2 text-primary`, isOn && tw`hidden`],
  left: ({ isOn }) => [tw`absolute left-2 text-primary`, !isOn && tw`hidden`],
  dot: ({ isOn, isLeft }) => [
    tw`rounded-full w-4 h-4 bg-white`,
    !isOn && !isLeft && tw`bg-gray-300`,
    isOn && isLeft && tw`bg-gray-400`
  ]
};

const Toggle = ({ icons, toggleHandler, isOn }) => {
  const RightIcon = ({ isOn }) => (icons ? icons[0] : <div css={styles.dot({ isOn, isLeft: false })} />);
  const LeftIcon = ({ isOn }) => (icons ? icons[1] : <div css={styles.dot({ isOn, isLeft: true })} />);

  return (
    <div aria-hidden={true} css={styles.container({ isOn })} onClick={toggleHandler}>
      <motion.div css={styles.toggle} layout transition={spring}>
        {isOn ? <RightIcon isOn={isOn} /> : <LeftIcon isOn={isOn} />}
      </motion.div>
      <span css={styles.right({ isOn })}>
        <RightIcon isOn={isOn} />
      </span>
      <span css={styles.left({ isOn })}>
        <LeftIcon isOn={isOn} />
      </span>
    </div>
  );
};

export { Toggle };
