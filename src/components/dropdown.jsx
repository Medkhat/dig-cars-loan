import 'twin.macro';

import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

const Dropdown = ({ dropdownButton, menuItems }) => {
  const DropdownButton = dropdownButton;
  const MenuItems = menuItems;
  return (
    <div>
      <Menu as='div' tw='relative'>
        <div>
          <DropdownButton />
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 w-56 mt-2 origin-top-right bg-primary divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
            <div className='px-1 py-1 '>
              <MenuItems />
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export { Dropdown };
