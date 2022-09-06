import 'twin.macro';
import 'twin.macro';

import { Menu } from '@headlessui/react';
import { compose, head, join, map, split, take } from 'ramda';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twin.macro';

import ClarityAvatarSolid from '@/assets/images/icons/ClarityAvatarSolid';
import { BodyText, Checkbox } from '@/components';
import { getAvatar, showAvatar } from '@/features/application/selectors';
import { toggleShowAvatar } from '@/features/application/slice';
import { logout } from '@/features/auth/tasks';

// style={{ background: `url(${alisher})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}} w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]

const getAvatarLetter = compose(join('.'), take(2), map(head), split(' '));

export const withProfileMenu = Component => {
  return function HOCWithProfileMenu({ fullName, ...props }) {
    const dispatch = useDispatch();
    const avatar = getAvatarLetter(fullName);

    const isShowAvatar = useSelector(showAvatar);

    const { control, watch } = useForm({
      mode: 'onChange',
      defaultValues: {
        showAvatar: isShowAvatar
      }
    });

    const userPhoto = useSelector(getAvatar);

    const showAvatarWatch = watch('showAvatar');

    useEffect(() => {
      if (userPhoto) {
        dispatch(toggleShowAvatar(showAvatarWatch));
      }
    }, [showAvatarWatch]);

    const handleLogout = () => {
      dispatch(logout());
    };

    const dropdownButton = () => (
      <Menu.Button
        css={[
          tw`inline-flex bg-cover bg-no-repeat  justify-center  text-sm font-bold text-primary bg-primary rounded-full bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`,
          (!userPhoto || !isShowAvatar) && tw`px-3 py-3`
        ]}
      >
        {userPhoto && isShowAvatar ? (
          <img src={userPhoto} alt='avatar' tw='object-cover w-[45px] h-[45px] rounded-full' />
        ) : (
          `${avatar}.` || <ClarityAvatarSolid />
        )}
      </Menu.Button>
    );

    const menuItems = () => (
      <div tw='z-50'>
        <Menu.Item>
          <div tw='p-3'>
            <BodyText text={fullName} variant='bold' />
          </div>
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <div tw='p-3'>
              <Checkbox control={control} name='showAvatar' label='Профиль с фото' disabled={!userPhoto} />
            </div>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-selector text-primary' : 'text-secondary'
              } group flex rounded-md items-center w-full px-[12px] py-2 text-sm`}
              onClick={handleLogout}
            >
              Выйти
            </button>
          )}
        </Menu.Item>
      </div>
    );

    return <Component dropdownButton={dropdownButton} menuItems={menuItems} {...props} />;
  };
};
