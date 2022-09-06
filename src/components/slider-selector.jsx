import 'swiper/css';
import 'swiper/css/navigation';

import { propIs } from 'ramda';
import React, { useEffect, useState } from 'react';
import SwiperCore, { Keyboard, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
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

export const selectorStyles = {
  container: ({ small, withIcon, isPlate }) => [
    tw`flex justify-center space-x-2 w-full`,
    small && tw`w-auto`,
    withIcon && tw`flex-row space-x-0 space-x-2`,
    isPlate && tw`space-x-0 flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-row`
  ],
  button: ({ isActive, small, type, isPlate, isDisabled }) => {
    return [
      tw`flex justify-between items-center flex-wrap border border-grey w-full min-w-0 py-5 px-3 hover:border-button leading-s18`,
      type === 'primary' ? tw`rounded-2xl` : tw`rounded-lg`,
      isActive && tw`bg-selector border-green hover:border-green`,
      small && tw`w-[3.79rem] px-3 py-2`,
      isPlate && tw`h-[56px] py-0`,
      isDisabled && tw`cursor-not-allowed`
    ];
  },
  textContainer: ({ icon }) => [tw`flex flex-col justify-center space-y-2 items-center flex-1`, icon && tw`items-start`]
};

const SliderSelector = ({
  items,
  small,
  getActiveItem = () => {},
  defaultActiveItem,
  withIcon,
  setActiveArrow = null,
  activeArrow = null,
  allDisabled = false,
  type = 'primary',
  nextEl,
  prevEl,
  showElem = 5.55
}) => {
  const [activeItem, setActiveItem] = useState(defaultActiveItem);
  SwiperCore.use([Navigation, Keyboard]);

  const handleClick = (e, activeItem) => {
    e.preventDefault();
    setActiveItem(activeItem);
    getActiveItem(activeItem);
  };

  useEffect(() => {
    setActiveItem(defaultActiveItem);
  }, [defaultActiveItem]);

  return (
    <div css={selectorStyles.container({ small, withIcon })}>
      <Swiper
        spaceBetween={8}
        slidesPerView={showElem}
        navigation={{ prevEl, nextEl }}
        watchOverflow={true}
        slidesOffsetBefore={0}
        slidesOffsetAfter={0}
        grabCursor={true}
        onReachEnd={el => console.log(nextEl)}
        enabled={() => console.log('call')}
        tw='w-full'
      >
        {items.map((item, i) => {
          const isActive = activeItem === item.value;
          const subItem = propIs(String, 'subItem', item) ? (
            <Caption text={item.subItem} twStyle={isActive ? tw`text-green` : tw`text-secondary`} />
          ) : (
            item.subItem
          );
          return (
            <SwiperSlide key={i} className='min-h-[66px]'>
              <button
                css={selectorStyles.button({ isActive, small, type, isDisabled: allDisabled })}
                tw='min-h-full p-3'
                disabled={allDisabled}
                onClick={e => handleClick(e, item.value)}
              >
                <div css={selectorStyles.textContainer({ icon: item.icon })}>
                  {!small ? (
                    <SubBody text={item.title} variant='bold' twStyle={isActive ? tw`text-green` : tw`text-primary`} />
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
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
export default SliderSelector;
