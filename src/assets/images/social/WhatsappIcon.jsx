import React from 'react';

const WhatsappIcon = ({ isMobile }) => {
  const size = isMobile ? '40px' : '32px';

  return (
    <div className={`flex justify-center items-center bg-secondary rounded-full`} style={{ width: size, height: size }}>
      {isMobile ? (
        <svg width='20' height='21' viewBox='0 0 20 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M9.99902 0.953125C4.47602 0.953125 -0.000976562 5.43033 -0.000976562 10.9531C-0.000976562 12.3871 0.319012 13.8153 0.937012 15.1406C0.117012 19.3756 0.0300293 19.7656 0.0300293 19.7656C-0.103971 20.4592 0.492012 21.0532 1.18701 20.9219C1.18701 20.9219 1.56602 20.8563 5.84302 20.0469C7.13402 20.6605 8.56502 20.9531 9.99902 20.9531C15.522 20.9531 19.999 16.4759 19.999 10.9531C19.999 5.43033 15.522 0.953125 9.99902 0.953125ZM9.99902 2.95313C14.417 2.95313 17.999 6.53483 17.999 10.9531C17.999 15.3714 14.417 18.9531 9.99902 18.9531C8.74202 18.9531 7.53501 18.6579 6.43701 18.1093C6.24101 18.0117 6.02604 17.9749 5.81104 18.0156C2.26104 18.6876 2.54302 18.6475 2.24902 18.7031C2.30702 18.4055 2.25701 18.7144 2.93701 15.2031C2.97901 14.9857 2.94202 14.7446 2.84302 14.5469C2.28502 13.4412 1.99902 12.2207 1.99902 10.9531C1.99902 6.53483 5.58102 2.95313 9.99902 2.95313ZM7.18701 5.95313C6.24901 5.95313 4.99902 7.20313 4.99902 8.14063C4.99902 9.34883 6.24902 11.5781 7.49902 12.8281C7.63402 12.9626 7.98902 13.3186 8.12402 13.4531C9.37402 14.7031 11.603 15.9531 12.811 15.9531C13.749 15.9531 14.999 14.7031 14.999 13.7656C14.999 12.8281 13.749 11.5781 12.811 11.5781C12.499 11.5781 11.368 12.2246 11.249 12.2031C10.253 12.0233 8.95702 10.6959 8.74902 9.70313C8.72002 9.56453 9.37402 8.45313 9.37402 8.14063C9.37402 7.20313 8.12401 5.95313 7.18701 5.95313Z'
            fill='#72BF44'
          />
        </svg>
      ) : (
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M7.99919 1.30212C4.31719 1.30212 1.33252 4.28692 1.33252 7.96879C1.33252 8.92479 1.54585 9.87692 1.95785 10.7605C1.41118 13.5838 1.35319 13.8438 1.35319 13.8438C1.26386 14.3062 1.66118 14.7022 2.12451 14.6147C2.12451 14.6147 2.37718 14.5709 5.22852 14.0313C6.08918 14.4404 7.04319 14.6355 7.99919 14.6355C11.6812 14.6355 14.6659 11.6507 14.6659 7.96879C14.6659 4.28692 11.6812 1.30212 7.99919 1.30212ZM7.99919 2.63546C10.9445 2.63546 13.3325 5.02326 13.3325 7.96879C13.3325 10.9143 10.9445 13.3021 7.99919 13.3021C7.16119 13.3021 6.35651 13.1053 5.62451 12.7396C5.49385 12.6745 5.35053 12.65 5.20719 12.6771C2.84053 13.1251 3.02852 13.0984 2.83252 13.1355C2.87119 12.9371 2.83785 13.143 3.29118 10.8021C3.31918 10.6572 3.29452 10.4965 3.22852 10.3647C2.85652 9.62753 2.66585 8.81386 2.66585 7.96879C2.66585 5.02326 5.05385 2.63546 7.99919 2.63546ZM6.12451 4.63546C5.49918 4.63546 4.66585 5.46879 4.66585 6.09379C4.66585 6.89926 5.49919 8.38546 6.33252 9.21879C6.42252 9.30846 6.65919 9.54579 6.74919 9.63546C7.58252 10.4688 9.06853 11.3021 9.87386 11.3021C10.4992 11.3021 11.3325 10.4688 11.3325 9.84379C11.3325 9.21879 10.4992 8.38546 9.87386 8.38546C9.66586 8.38546 8.91185 8.81646 8.83252 8.80212C8.16852 8.68226 7.30452 7.79732 7.16585 7.13546C7.14652 7.04306 7.58252 6.30212 7.58252 6.09379C7.58252 5.46879 6.74918 4.63546 6.12451 4.63546Z'
            fill='#72BF44'
          />
        </svg>
      )}
    </div>
  );
};
export default WhatsappIcon;