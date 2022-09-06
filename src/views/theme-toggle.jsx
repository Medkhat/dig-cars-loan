import 'twin.macro';

import React, { useCallback } from 'react';

import { Moon } from '@/assets/images/icons/Moon';
import { Sun } from '@/assets/images/icons/Sun';
import { Toggle } from '@/components';
import { ThemeContext } from '@/contexts/theme-context';

const ThemeToggle = () => {
  const { theme, setTheme } = React.useContext(ThemeContext);

  const isDark = useCallback(() => theme === 'dark', [theme]);

  const toggleHandler = useCallback(() => {
    setTheme(isDark() ? 'light' : 'dark');
  }, [setTheme, isDark]);
  return (
    <div>
      <Toggle
        toggleHandler={toggleHandler}
        isOn={isDark()}
        icons={[<Moon theme={theme} key='moon' />, <Sun theme={theme} key='sun' />]}
      />
    </div>
  );
};

export default ThemeToggle;
