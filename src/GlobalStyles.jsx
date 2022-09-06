import { css, Global } from '@emotion/react';
import React from 'react';
import tw, { GlobalStyles as BaseStyles } from 'twin.macro';

const customStyles = css`
  :root {
    --color-white: #ffffff;
    --color-white-alpha87: rgba(255, 255, 255, 0.87);
    --color-white-alpha06: rgba(255, 255, 255, 0.06);
    --color-white-alpha25: rgba(255, 255, 255, 0.25);
    --color-black: #17191a;
    --color-biometry: #202020;
    --color-dark-grey: #1a1a1a;
    --color-progress-50: #e7f0e1;
    --color-progress-150: #eafae6;
    --dark-grey: #8e8e93;
    --lighter-grey: #e8eaeb;
    --light-grey: #f5f6f7;
    --green-primary: #72bf44;
    --green-secondary: #4f9d3a;
    --green-dark: #2d7d2f;
    --light-red: #fb5555;
    --dark-red: #c24141;
    --modal: #0000009c;
    --middle-grey: #8e8e93;
    --color-grey-50: #eeeeef;
    --color-grey-150: #383838;
  }
  .light {
    --bg-primary: var(--light-grey);
    --bg-secondary: var(--color-white);
    --bg-secondary-inverted: #282828;
    --bg-progress: var(--color-progress-50);
    --bg-wrapper: var(--color-white);
    --bg-extra: var(--color-white);
    --bg-input: var(--light-grey);
    --bg-green: var(--green-primary);
    --bg-green-secondary: var(--green-secondary);
    --bg-additional: rgba(238, 238, 238, 0.94);
    --bg-toolbar: rgba(238, 238, 238, 0.94);
    --bg-selector: rgba(79, 157, 58, 0.1);
    --text-primary: var(--color-black);
    --text-primary-inverted: var(--color-white-alpha87);
    --text-secondary: var(--dark-grey);
    --text-tertiary: var(--dark-grey);
    --text-green: var(--green-secondary);
    --text-green-secondary: var(--green-secondary);
    --text-green-hover: var(--green-dark);
    --text-error: var(--dark-red);
    --border-button: var(--lighter-grey);
    --border-input-active: var(--green-secondary);
    --border-input-invalid: var(--dark-red);
    --border-grey: var(--lighter-grey);
    --grey-footer: var(--color-grey-50);
    --divide-grey: var(--lighter-grey);
    --bg-border: #e8eaeb;
  }
  .dark {
    --bg-primary: var(--color-dark-grey);
    --bg-secondary: #282828;
    --bg-secondary-inverted: var(--color-white);
    --bg-progress: var(--color-progress-150);
    --bg-wrapper: var(--color-biometry);
    --bg-extra: var(--color-dark-grey);
    --bg-input: #00000033;
    --bg-green: var(--green-dark);
    --bg-green-secondary: var(--green-secondary);
    --bg-additional: #454545;
    --bg-toolbar: rgba(58, 58, 58, 0.94);
    --bg-selector: rgba(114, 191, 68, 0.1);
    --text-primary: var(--color-white-alpha87);
    --text-primary-inverted: var(--color-black);
    --text-secondary: #b7bbbd;
    --text-tertiary: var(--color-white-alpha87);
    --text-green: var(--green-secondary);
    --text-green-secondary: var(--green-primary);
    --text-green-hover: var(--green-secondary);
    --text-error: var(--light-red);
    --border-button: var(--middle-grey);
    --border-input-active: var(--green-primary);
    --border-input-invalid: var(--light-red);
    --border-grey: var(--color-white-alpha06);
    --grey-footer: var(--color-grey-150);
    --divide-grey: var(--color-white-alpha25);
    --bg-border: #454545;
  }
  body {
    ${tw`bg-primary text-primary antialiased transition-all duration-200 font-sans`}
  }

  body {
    overflow-x:hidden;
  }

  .swiper-button-disabled svg {
    cursor: not-allowed;
    fill: rgba(255, 255, 255, 0.06) !important;
  }

  .swiper-button-disabled svg path {
    cursor: not-allowed;
    fill: rgba(255, 255, 255, 0.10) !important;
  }

  input,
  textarea,
  button,
  select,
  a {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }

  ::-webkit-scrollbar-thumb {
    background-color: #4f9d3a;
    border-radius: 16px;
    border: 3px solid #4f9d3a;
  }

  -webkit-tap-highlight-color: transparent;

  :root {
    scrollbar-color: #4f9d3a;
    scrollbar-width: thin;
  }

  }
`;

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
);

export default GlobalStyles;
