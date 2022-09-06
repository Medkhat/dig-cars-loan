import { yupResolver } from '@hookform/resolvers/yup';
import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAsync, useFirstMountState } from 'react-use';
import tw from 'twin.macro';
import * as yup from 'yup';

import { useVisibility } from '@/app/hooks';
// icons && images
import FlagIcon from '@/assets/images/icons/FlagIcon';
import { Backdrop, Button, Caption, ContainerBlock, Modal, Select, Selector, SubBody, SubTitle } from '@/components';
import { DeviceInfoContext } from '@/contexts/device-info-context';
import {
  applyMainStatus,
  useApplyMainConstructorMutation,
  useApplyMainGetGrnzListMutation,
  useApplyMainSetFinalOptionsMutation,
  useApplyMainSetOptionsMutation,
  useConstructorAdditionalInfoMutation
} from '@/features/api/apply-main';
import { useActualParamsQuery } from '@/features/api/credits';
import { useDirectoryAutoCentersQuery, useDirectoryRegionsQuery } from '@/features/api/directory';
import { getFlowUuid, getLeadUuid, getVehicleImageByType } from '@/features/application/selectors';
import { getStepUuid } from '@/features/application/selectors';
import { setConditionBlockVisible } from '@/features/application/slice';
import { getCalculationData } from '@/features/calculation/selectors';
import { setConstructorSolution as setConstructorSolutionAction } from '@/features/calculation/slice';
import { getCurrentStep, getStepByName } from '@/features/status/selectors';
import { resetCommonStatus, setConstructorFinalSolution } from '@/features/status/slice';
import { getFullName } from '@/features/user/selectors';
import { collectConstructor, findGrnz, getNumberPlates, getProfitableSolution, getTariffs, selectMap } from '@/helper';
import { carImageTypes, decisionTypes, flowSteps } from '@/helper/constants';
import { grnzTypes } from '@/helper/loan-approve-data';
import CarTaxBlock from '@/views/car-tax-block';
import ChangeConditionContent from '@/views/change-condition-content';
import ChangeTarifModal from '@/views/change-tarif-modal';
import ConstructorLoanInfo from '@/views/constuctor-loan-info';
import FlexibleTariffBlock from '@/views/flexible-tariff-block';
import MainNewPlate, { numberPlates } from '@/views/main-new-plate';
import RejectCreditBlock from '@/views/reject-credit-block';
import TariffBlock from '@/views/tariff-block';

const defaultValues = {
  grnz: 'new',
  grnz_type: '',
  tcon: '',
  region: '',
  auto_identifier: '',
  auto_identifier_new: '',
  auto_identifier_type: '',
  delivery_type: '',
  street: '',
  building: '',
  flat: '',
  comment: '',
  tcon_address: ''
};

const MainLoanApprovePage = () => {
  const navigate = useNavigate();
  const schema = yup.object({
    delivery_type: yup.string().required(),
    street: yup
      .string()
      .max('50', '50', 'Максимальная длина 50 символов')
      .when('delivery_type', {
        is: val => val === 'delivery',
        then: yup.string().min(1, 'Это поле не может быть пустым').required('Это поле не может быть пустым')
      }),
    building: yup
      .string()
      .max('50', 'Максимальная длина 50 символов')
      .when('delivery_type', {
        is: val => val === 'delivery',
        then: yup.string().min(1, 'Это поле не может быть пустым').required('Это поле не может быть пустым')
      })
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { isValid }
  } = useForm({ mode: 'onChange', defaultValues, resolver: yupResolver(schema) });

  const grnz = watch('grnz');
  const region = watch('region');
  const autoIdentifierType = watch('auto_identifier_type');
  const tcon = watch('tcon');
  const grnzType = watch('grnz_type');
  const autoIdentifierNew = watch('auto_identifier_new');
  const autoIdentifier = watch('auto_identifier');
  const tconAddress = watch('tcon_address');
  const deliveryType = watch('delivery_type');

  const isFirstMount = useFirstMountState();

  const calculationData = useSelector(getCalculationData);
  const flowUuid = useSelector(getFlowUuid);
  const currentStep = useSelector(getCurrentStep);
  const step = useSelector(getStepByName(currentStep));
  const fullName = useSelector(getFullName);
  const stepUuid = useSelector(getStepUuid);
  const leadUuid = useSelector(getLeadUuid);
  const carLoader = useSelector(getVehicleImageByType(carImageTypes.SIDE_VIEW_LOGO));

  const finalSolution = step?.finalSolution;

  const [isVisible, loanConditionBlockRef] = useVisibility(100);

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [grnzList, setGrnzList] = useState();
  const [needPayment, setNeedPayment] = useState(false);
  const [plates, setPlates] = useState();
  const [additionalInfo, setAdditionalInfo] = useState();
  const [alternativeSolutions, setAltivernativeSolutions] = useState();
  const [tariffs, setTariffs] = useState();
  const [constructorSolution, setConstructorSolution] = useState();
  const [constructorSolutions, setConstructorSolutions] = useState([]);
  const [platePrices, setPlatePrice] = useState();
  const [openChangeTarifModal, setOpenChangeTarifModal] = useState(false);

  const { isMobile } = useContext(DeviceInfoContext);

  const [fetchConstructor] = useApplyMainConstructorMutation();
  const [fetchSetFinalOption, { isSuccess: finalSuccess, isLoading: finalLoading, error: finalOptionError }] =
    useApplyMainSetFinalOptionsMutation();
  const [fetchSetOptions, optionsSolution] = useApplyMainSetOptionsMutation();
  const { data: resRegions, isLoading: loadingRegion } = useDirectoryRegionsQuery();
  const [fetchConstructorAdditionalInfo] = useConstructorAdditionalInfoMutation();
  const { data: resAutoCenters, isLoading: loadingAutoCenters } = useDirectoryAutoCentersQuery(
    { region },
    { skip: !region }
  );
  const [getGrnzList, grnzResults] = useApplyMainGetGrnzListMutation();

  const { isSuccess: actualParamsSuccess, refetch: actualParamsRefetch } = useActualParamsQuery(
    { lead_uuid: leadUuid },
    { skip: !leadUuid }
  );

  const { isLoading } = grnzResults;
  const { isLoading: solutionLoading, data: solutionData, error: optionError } = optionsSolution;

  const regions = selectMap(resRegions?.results, 'id');
  const autoCenters = selectMap(resAutoCenters?.results, 'id');

  useEffect(() => {
    // получение тарифов
    if (constructorSolutions && constructorSolutions.length > 0) {
      const tariffResults = getTariffs(constructorSolutions);

      console.log('tariffResults: ', tariffResults);

      setTariffs(tariffResults);
    }
  }, [constructorSolutions]);

  useEffect(() => {
    dispatch(setConditionBlockVisible(isFirstMount ? true : isVisible));
  }, [isVisible, isFirstMount]);

  useAsync(async () => {
    // Получения ГРНЗ из ШЭП
    if (autoIdentifierType && autoIdentifierType.length > 0) {
      console.log(stepUuid);
      const { data } = await getGrnzList({ uuid: stepUuid, reo: tcon, shape: grnzType, rarity: autoIdentifierType });
      let grnzResult = getNumberPlates(data, autoIdentifierType);

      setPlates(data);
      setGrnzList(grnzResult);
    }
  }, [autoIdentifierType, tcon, grnzType]);

  useAsync(async () => {
    // Получения решения после 2.2
    if (flowUuid && flowUuid.length > 0 && actualParamsSuccess) {
      const { data } = await fetchConstructor({ uuid: flowUuid, step: currentStep });

      if (data) {
        const { solutions, status } = data;
        const scorringSolution = getProfitableSolution(solutions, status, calculationData);

        dispatch(setConstructorSolutionAction(scorringSolution));
        setConstructorSolutions(solutions);
        setConstructorSolution(scorringSolution);
      }
    }
  }, [flowUuid, actualParamsSuccess]);

  useEffect(() => {
    // Удаляет данные из формы если он выбрал тариф или алт решение
    reset();
  }, [calculationData]);

  useEffect(() => {
    // Удаляет финальное решение, если изменились зависимости
    if (currentStep === flowSteps.CONSTRUCTOR) {
      dispatch(setConstructorFinalSolution({ finalSolution: null, step: currentStep }));
    }
  }, [autoIdentifierType, grnzType, tcon, region, calculationData]);

  useEffect(() => {
    if (constructorSolutions?.length > 0) {
      const alternatives = constructorSolutions?.filter(item => {
        if (item.solution_type === decisionTypes.ALTERNATIVE) {
          return item;
        }
      });

      setAltivernativeSolutions(alternatives);
    }
  }, [constructorSolutions]);

  useAsync(async () => {
    // Получения решения после заполнения конструктора
    if (autoIdentifierNew && autoIdentifierNew.length > 0) {
      const submitData = collectConstructor(getValues(), calculationData);
      const { data: finalResult } = await fetchSetOptions({ stepUuid: stepUuid, data: submitData });

      dispatch(setConstructorFinalSolution({ finalSolution: finalResult, step: currentStep }));
    }
  }, [autoIdentifierNew]);

  useAsync(async () => {
    // Получения решения после заполнения конструктора - вариант свой номер
    if (autoIdentifier && autoIdentifier.length > 0) {
      const grnzObject = findGrnz(autoIdentifier, grnzList);
      setNeedPayment(grnzObject?.price > 0);
      if (grnzType && grnz.length > 0) {
        const submitData = collectConstructor(getValues(), calculationData);
        const { data: finalResult } = await fetchSetOptions({ stepUuid: stepUuid, data: submitData });

        dispatch(setConstructorFinalSolution({ finalSolution: finalResult, step: currentStep }));
      }
      setValue('delivery_type', 'pickup');
    }
  }, [autoIdentifier, grnzType]);

  useAsync(async () => {
    const resetValues = defaultValues;
    resetValues.grnz = grnz;
    reset(resetValues);
    if (grnz === 'own') {
      const { data } = await getGrnzList({
        uuid: stepUuid,
        reo: tcon,
        shape: grnzType,
        rarity: autoIdentifierType,
        is_own: grnz === 'own'
      });
      console.log(data);
      if (data?.grnz_list.length <= 0) {
        setValue('grnz', 'new');
      } else {
        let grnzResult = getNumberPlates(data, autoIdentifierType);
        setGrnzList(grnzResult);
      }
    }
  }, [grnz]);

  /*  useEffect(() => {
    const resetValue = defaultValues;
    resetValue.region = region;
    resetValue.grnz = grnz;
    reset(resetValue);
  }, [region]);*/

  useEffect(() => {
    // Получение адрес цона
    if (autoCenters.length > 0) {
      const address = resAutoCenters?.results?.find(item => item.id === tcon);
      setValue('tcon_address', address);
    }
  }, [tcon]);

  useAsync(async () => {
    // Получение информации о гпо,каско и т.д
    if (stepUuid && constructorSolution) {
      const { data } = await fetchConstructorAdditionalInfo({ stepUuid: stepUuid });
      setAdditionalInfo(data);
    }
  }, [constructorSolution]);

  useEffect(() => {
    if (finalSuccess) {
      dispatch(setConstructorFinalSolution({ finalSolution: null, step: currentStep }));
      dispatch(resetCommonStatus());
      dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
    }
  }, [finalSuccess]);

  const sendFinalOption = () => {
    // Отправка финального результата
    const { comment, street, building, flat } = getValues();

    const delivery_info = {
      comment,
      street,
      building,
      flat
    };

    fetchSetFinalOption({ stepUuid, delivery_info: deliveryType === 'delivery' ? delivery_info : null });
  };

  const handleOpenChangeCondition = () => {
    setOpen(true);
  };

  const checkFormValidation = () => {
    return !finalSolution || !isValid;
  };

  return (
    <>
      <div className='flex flex-col space-y-3'>
        <div tw='flex flex-col space-y-2 p-5 md:py-3'>
          <SubTitle text={<span>{fullName}!</span>} variant='bold' />
          <SubBody
            text={
              <span tw='leading-[25px]'>
                Продавец прошел идентификацию и право собственности! <br /> Вам одобрен кредит на следующих условиях:
              </span>
            }
            twStyle={tw`text-secondary`}
          />
        </div>

        <div ref={loanConditionBlockRef}>
          <ConstructorLoanInfo calculationData={calculationData} finalSolution={finalSolution} />
        </div>

        <div className='flex flex-col space-y-[1px]'>
          <div className='flex justify-between bg-secondary p-5 sm:rounded-t-2xl'>
            <div className='flex space-x-2'>
              <div>
                <SubBody text='Что входит в итоговую сумму займа' twStyle={tw`text-secondary`} />
                <SubTitle
                  text={`${
                    Number(
                      finalSolution?.additional_principal
                        ? calculationData?.credit_amount + finalSolution?.additional_principal
                        : calculationData?.credit_amount
                    ).toLocaleString() || 0
                  } ₸`}
                  variant='bold'
                  twStyle={tw`text-s24`}
                />
              </div>
            </div>
            <div className={`self-center`}>
              <img src={carLoader} width={105} height={45} alt='car' />
            </div>
          </div>
          <CarTaxBlock
            additionalInfo={additionalInfo}
            watch={watch}
            downPayment={calculationData.down_payment}
            platePrices={platePrices}
          />
        </div>

        {tariffs && tariffs?.length > 0 && (
          <ContainerBlock title='Альтернативные условия'>
            {alternativeSolutions?.length > 0 && (
              <FlexibleTariffBlock calculationData={calculationData} setOpen={setOpen} />
            )}
            {tariffs?.length > 0 &&
              tariffs?.map((tariff, i) => (
                <TariffBlock
                  key={i}
                  tariff={tariff}
                  constructorSolution={constructorSolution}
                  calculationData={calculationData}
                  setOpenChangeTarifModal={setOpenChangeTarifModal}
                />
              ))}
          </ContainerBlock>
        )}
        <form noValidate onSubmit={handleSubmit(sendFinalOption)} className='space-y-3'>
          <ContainerBlock title='Выбор гос. номера' disabled={isLoading}>
            <Controller
              name='grnz'
              control={control}
              render={({ field: { value, onChange } }) => {
                return <Selector items={grnzTypes} defaultActiveItem={value} getActiveItem={onChange} />;
              }}
            />
            {grnz === 'own' && (
              <>
                <Select
                  name='auto_identifier'
                  icon={<FlagIcon />}
                  control={control}
                  options={grnzList}
                  placeholder='Выберите номер'
                />
                <Caption
                  text={`Пожалуйста, выберите отдел ЦОНа где оставлялся на хранение выбранный ГРНЗ.
                         В случае, если ГРНЗ будет отсутствовать, заявка будет отказана сотрудником государственного органа`}
                  twStyle={tw`text-dark !mt-[5px] pl-[10px]`}
                />

                {autoIdentifier && autoIdentifier.length > 0 && (
                  <SubBody
                    text={
                      needPayment
                        ? 'Указанный номер хранится в отделе ЦОНа свыше 30 дней. Сумма номера будет включена в кредит.'
                        : 'Указанный номер хранится в отделе ЦОНа менее 30 дней. Номер будет предоставлен бесплатно.'
                    }
                    twStyle={tw`text-secondary ml-3`}
                  />
                )}
              </>
            )}
            <>
              {(grnz === 'new' || autoIdentifier) && (
                <Select
                  isLoading={loadingRegion}
                  name='region'
                  control={control}
                  options={regions}
                  disabled={isLoading}
                  placeholder='Выберите город'
                />
              )}
              {region && (
                <>
                  <Select
                    isLoading={loadingAutoCenters}
                    name='tcon'
                    control={control}
                    options={autoCenters}
                    disabled={isLoading}
                    placeholder='Выберите СпецЦОН'
                  />

                  <Caption text={tconAddress?.address} variant='bold' twStyle={tw`text-dark pt-2 pl-[10px] text-s14`} />
                </>
              )}
              {grnz === 'own' && tcon && (
                <Controller
                  name='grnz_type'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Selector
                      disabled={isLoading}
                      items={numberPlates}
                      isPlate
                      defaultActiveItem={value}
                      getActiveItem={onChange}
                      withIcon
                    />
                  )}
                />
              )}
            </>
          </ContainerBlock>
          {grnz === 'new' && (
            <MainNewPlate
              setGrnzList={setGrnzList}
              grnzList={grnzList}
              optionsSolution={optionsSolution}
              isLoading={isLoading}
              control={control}
              watch={watch}
              setValue={setValue}
              regions={regions}
              plates={plates}
              platePrices={platePrices}
              setPlatePrice={setPlatePrice}
              carFrontUrl={solutionData?.auto_grnz_image_url}
            />
          )}
          {finalOptionError && (
            <div tw='p-5'>
              <Caption
                text={'Извините, временно недоступен сторонний сервис. Пожалуйста, повторите попытку.'}
                twStyle={tw`text-error`}
              />
            </div>
          )}
          <div className='text-center space-y-3 px-5 pt-5 mt-5 sm:mt-0 sm:px-0 sm:flex sm:space-y-0 sm:flex-row-reverse md:items-center md:pb-[230px] pb-10'>
            <div className='flex-1 md:ml-2 md:w-[337px]'>
              <Button
                type='submit'
                variant='primary'
                loading={solutionLoading || finalLoading}
                disabled={checkFormValidation()}
                caption='Перейти к оплате'
              >
                Продолжить
              </Button>
            </div>
            <div>
              <RejectCreditBlock flowUuid={flowUuid} />
            </div>
          </div>
        </form>
      </div>
      {isMobile ? (
        <Backdrop
          title='Собрать свой вариант'
          isOpen={open}
          setIsOpen={setOpen}
          twStyle={tw`bg-primary p-0`}
          headerStyle={tw`bg-secondary p-5 mb-[12px] rounded-t-2xl`}
        >
          {alternativeSolutions?.length > 0 && (
            <ChangeConditionContent
              setOpen={setOpen}
              alternativeSolutions={alternativeSolutions}
              setOpenChangeTarifModal={setOpenChangeTarifModal}
            />
          )}
        </Backdrop>
      ) : (
        <Modal
          title='Собрать свой вариант'
          open={open}
          setOpen={setOpen}
          twStyle={tw`max-w-[540px] !p-0 rounded-2xl`}
          headerStyle={tw`bg-secondary p-5 rounded-t-2xl mb-[12px]`}
          wrapperStyle={tw`!rounded-b-2xl`}
        >
          {alternativeSolutions?.length > 0 && (
            <ChangeConditionContent
              setOpen={setOpen}
              alternativeSolutions={alternativeSolutions}
              setOpenChangeTarifModal={setOpenChangeTarifModal}
            />
          )}
        </Modal>
      )}
      <ChangeTarifModal open={openChangeTarifModal} setOpen={setOpenChangeTarifModal} />
    </>
  );
};

export default MainLoanApprovePage;
