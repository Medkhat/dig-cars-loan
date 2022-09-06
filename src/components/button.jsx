import { motion } from 'framer-motion';
import React from 'react';
import tw from 'twin.macro';

import BiArrowRightShort from '@/assets/images/icons/BiArrowRightShort';
import DocIcon from '@/assets/images/icons/DocIcon';
import DownloadIcon from '@/assets/images/icons/DownloadIcon';
import { BodyText } from '@/components/body-text';
import { Caption } from '@/components/caption';
import Loader from '@/views/loader';

// ButtonVariant = 'primary' | 'ghost' | 'secondary' | 'text' | 'link' | 'download' ;

const buttonVariants = {
  primary: tw`max-w-button bg-button text-white rounded-s30 shadow-button hover:bg-button-hover transition-colors disabled:bg-button`,
  link: tw`text-green p-0 active:text-link-hover hover:text-link-hover disabled:text-green max-w-none w-auto min-w-0`,
  text: tw`text-link rounded-s20 py-4 active:text-link-hover hover:text-link-hover disabled:text-green`,
  ghost: tw`border border-green bg-selector text-green rounded-s20 py-4 hover:border-button-hover active:text-green-middle disabled:border-button disabled:text-green`,
  secondary: tw`bg-button text-white rounded-s20 py-4 shadow-button hover:bg-button-hover transition-colors disabled:bg-button`,
  download: tw`bg-secondary py-3 w-full min-w-0 rounded-2xl hover:border-button leading-s18`,
  shadow: tw`border border-dark text-green rounded-s20 py-4 hover:border-button-hover active:text-green-middle disabled:border-button disabled:text-green`
};

const styles = {
  button: ({ variant = 'text', twStyle, loading }) => [
    tw`w-full min-w-button py-5 px-6 disabled:opacity-60 disabled:cursor-not-allowed`,
    buttonVariants[variant],
    twStyle && twStyle,
    variant === 'ghost' && loading && tw`h-[51px] py-0`
  ]
};

const Button = ({ variant, children, caption = '', icon, disabled, type, onClick, loading = false, twStyle }) => {
  return (
    <motion.button
      css={styles.button({ variant, twStyle, loading })}
      disabled={loading || disabled}
      whileTap={{ scale: !disabled || !loading ? 0.97 : 1 }}
      type={type}
      onClick={onClick}
    >
      {variant === 'primary' && <PrimaryButton loading={loading} text={children} caption={caption} icon={icon} />}
      {variant === 'ghost' && <SecondaryButton loading={loading} text={children} icon={icon} />}
      {variant === 'secondary' && <SecondaryButton loading={loading} text={children} icon={icon} />}
      {variant === 'text' && <SecondaryButton loading={loading} text={children} icon={icon} />}
      {variant === 'link' && <SecondaryButton loading={loading} text={children} icon={icon} variant={variant} />}
      {variant === 'download' && <DownloadButton loading={loading} text={children} icon={icon} />}
      {variant === 'shadow' && <SecondaryButton loading={loading} text={children} icon={icon} />}
    </motion.button>
  );
};

export { Button };

const PrimaryButton = ({ text, caption, icon = <BiArrowRightShort tw='text-s24' />, loading }) => {
  return (
    <div tw='flex justify-between items-center space-x-2 w-full'>
      <div tw='flex flex-col items-start w-4/5'>
        <BodyText text={text} variant='bold' twStyle={tw`line-clamp-1`} />
        <Caption text={caption} twStyle={tw`text-white text-opacity-87 line-clamp-2`} />
      </div>
      <div tw='flex flex-shrink-0 justify-center items-center w-1/5 max-w-[40px] h-[40px] bg-white text-black rounded-s14'>
        {loading ? <Loader variant='small' /> : icon}
      </div>
    </div>
  );
};

const DownloadButton = ({ text, before = <DocIcon />, icon = <DownloadIcon />, loading }) => {
  return (
    <div tw='flex justify-between items-center'>
      <div tw='flex flex-shrink-0 justify-center items-center w-1/5 max-w-[40px] h-[40px] text-black rounded-s14'>
        {before}
      </div>
      <div tw='flex flex-col items-start w-4/5'>
        <BodyText text={text} variant='bold' twStyle={tw`text-s14`} />
      </div>
      <div tw='flex justify-center items-center w-[20px] h-[20px] bg-primary rounded-full '>
        {loading ? <Loader variant='small' /> : icon}
      </div>
    </div>
  );
};

const SecondaryButton = ({ icon, text, variant = '', loading }) => {
  return (
    <div css={[tw`flex justify-center items-center space-x-2 flex-none`, variant === 'link' && tw`justify-start`]}>
      <BodyText text={text} variant='bold' twStyle={tw`line-clamp-1 text-s14`} />
      {loading ? <Loader variant='small' /> : icon}
    </div>
  );
};
