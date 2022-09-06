import 'swiper/css';

import { propIs } from 'ramda';
import React, { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';

import { BodyText } from '@/components/body-text';
import { Caption } from '@/components/caption';
import { SubBody } from '@/components/sub-body';

/*SelectorProps {
  items: {
    value: string;
    title: string;
    subItem?: string | JSX.Element;
  }[];
  small?: boolean;
  getActiveItem: ({ activeItem: string }) => void;
  defaultActiveItem?: string;
}*/

const styles = {
  container: ({ small, withIcon, isPlate, disabled }) => [
    tw`flex justify-center space-x-2 w-full`,
    small && tw`w-auto`,
    withIcon && tw`flex-row space-x-0 space-x-2`,
    isPlate && tw`space-x-0 flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-row`,
    disabled && tw`opacity-50`
  ],
  button: ({ isActive, small, type, isPlate, disabled }) => {
    return [
      tw`flex justify-between items-center flex-wrap border border-grey w-full min-w-0 py-5 px-3 hover:border-button leading-s18`,
      type === 'primary' ? tw`rounded-2xl` : tw`rounded-lg`,
      isActive && tw`bg-selector border-green hover:border-green`,
      small && tw`w-[3.79rem] px-3 py-2`,
      isPlate && tw`h-[56px] py-0`,
      disabled && tw`border-0 cursor-not-allowed`,
      disabled && isActive && tw`border border-green`
    ];
  },
  textContainer: ({ icon }) => [tw`flex flex-col justify-center space-y-2 items-center flex-1`, icon && tw`items-start`]
};

const Selector = ({
  items,
  small,
  getActiveItem = () => {},
  defaultActiveItem,
  withIcon,
  isPlate = false,
  type = 'primary',
  variant = 'primary',
  disabled
}) => {
  const [activeItem, setActiveItem] = useState(defaultActiveItem);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    setActiveItem(defaultActiveItem);
  }, [defaultActiveItem]);

  const handleClick = (e, activeItem, disabled) => {
    e.preventDefault();
    if (!disabled) {
      setActiveItem(activeItem);
      getActiveItem(activeItem);
    }
  };

  return (
    <>
      {variant === 'primary' && (
        <div css={styles.container({ small, withIcon, isPlate, disabled })}>
          {items.map(item => {
            const isActive = activeItem === item.value;
            const subItem = propIs(String, 'subItem', item) ? (
              <Caption text={item.subItem} twStyle={isActive ? tw`text-green` : tw`text-secondary`} />
            ) : (
              item.subItem
            );
            return (
              <button
                css={styles.button({ isActive, small, type, isPlate, disabled })}
                key={item.value}
                onClick={e => handleClick(e, item.value, disabled)}
              >
                <div css={styles.textContainer({ icon: item.icon })}>
                  {!small ? (
                    <SubBody text={item.title} variant='bold' twStyle={isActive ? tw`text-link` : tw`text-primary`} />
                  ) : (
                    <BodyText
                      text={item.title}
                      variant='bold'
                      twStyle={isActive ? tw`text-green` : tw`text-tertiary`}
                    />
                  )}
                  {subItem}
                </div>
                <div>{item.icon}</div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

export { Selector };
