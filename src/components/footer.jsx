import PhoneIcon from "@/assets/images/icons/PhoneIcon";
import Logo from "@/assets/images/Logo";
import FacebookIcon from "@/assets/images/social/FacebookIcon";
import InstagramIcon from "@/assets/images/social/InstagramIcon";
import { BigTitle, SubBody } from "@/components";
import React from "react";
import tw from "twin.macro";

const styles = {
  container: ({ twStyles }) => [tw`w-full pt-[150px]`, twStyles],
  wrapper: [tw`pt-[150px] max-w-layout p-5 mx-auto`],
};

const Footer = ({ twStyles }) => {
  return (
    <div css={styles.container({ twStyles })}>
      <footer css={styles.wrapper}>
        <div tw="flex flex-col md:flex-row justify-between space-y-4 sm:space-y-0 sm:flex-row items-start">
          <div>
            <Logo tw="flex-1" />
            <div tw="mt-[20px] w-[220px]">
              <SubBody text="050000, г. Алматы, Алмалинский район, ул. Курмангазы, дом 61А" />
            </div>
          </div>

          <div tw="flex flex-col">
            <div tw="flex flex-col mt-5 sm:mt-0">
              <SubBody
                text="Мы есть социальных сетях"
                twStyle={tw`text-green`}
              />
              <div tw="flex items-center space-x-3 mt-3">
                <a
                  href="https://www.instagram.com/accounts/login/?next=/bankffin.kz/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.facebook.com/bankffin.kz/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>

            <a href="tel:595" tw="flex items-center space-x-2 mt-[15px]">
              <div tw="w-[36px] h-[36px] bg-[#4f9d3a] rounded-xl flex items-center justify-center">
                <PhoneIcon />
              </div>
              <BigTitle text="595" twStyle={tw`font-normal`} />
              <SubBody
                text={
                  <span>
                    Бесплатный <br /> звонок
                  </span>
                }
              />
            </a>
          </div>
        </div>
        <div tw="mt-[30px] mb-[10px] text-center">
          <SubBody text='©2022, АО "Банк Фридом Финанс Казахстан". Лицензия АРРФР №1.1.260 от 09.02.2021.' />
        </div>
      </footer>
    </div>
  );
};
export default Footer;
