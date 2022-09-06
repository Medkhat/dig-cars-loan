import { useCallback, useEffect, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';

import { calculationLoan } from '@/features/calculation/calculation-loan-new';

export const useCalculateLoan = (control, interestRate) => {
  const [gesv, setGesv] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const { period, repayment_method, car_principal, down_payment } = useWatch({ control });

  const creditAmount = car_principal < down_payment ? 0 : car_principal - down_payment;

  useEffect(() => {
    setMonthlyPayment(
      calculationLoan({
        amount: creditAmount,
        setGesv,
        insurance: [],
        percentage: interestRate,
        paymentType: repayment_method,
        period
      })
    );
  }, [period, repayment_method, creditAmount, interestRate]);

  return [creditAmount, gesv, monthlyPayment, period, repayment_method, down_payment, car_principal];
};

export const useVisibility = (offset = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const currentElement = useRef(null);

  const onScroll = () => {
    if (!currentElement.current) {
      setIsVisible(false);
      return;
    }
    const top = currentElement.current.getBoundingClientRect().top;
    setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
  };

  useEffect(() => {
    document.addEventListener('scroll', onScroll, true);
    return () => document.removeEventListener('scroll', onScroll, true);
  });

  return [isVisible, currentElement];
};

export const useUserMedia = requestedMedia => {
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    async function enableVideoStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
        setMediaStream(stream);
      } catch (err) {
        // Handle the error
      }
    }

    if (!mediaStream) {
      enableVideoStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      };
    }
  }, [mediaStream, requestedMedia]);

  return mediaStream;
};

export const useCardRatio = initialParams => {
  const [aspectRatio, setAspectRatio] = useState(initialParams);

  const calculateRatio = useCallback((height, width) => {
    if (height && width) {
      const isLandscape = height <= width;
      const ratio = isLandscape ? width / height : height / width;

      setAspectRatio(ratio);
    }
  }, []);

  return [aspectRatio, calculateRatio];
};

export const useOffsets = (vWidth, vHeight, cWidth, cHeight) => {
  const [offsets, setOffsets] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (vWidth && vHeight && cWidth && cHeight) {
      const x = vWidth > cWidth ? Math.round((vWidth - cWidth) / 2) : 0;
      const y = vHeight > cHeight ? Math.round((vHeight - cHeight) / 2) : 0;

      setOffsets({ x, y });
    }
  }, [vWidth, vHeight, cWidth, cHeight]);

  return offsets;
};
