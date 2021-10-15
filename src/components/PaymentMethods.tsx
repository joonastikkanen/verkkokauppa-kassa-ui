import React, { useState } from "react"
import { Button, Container, IconAngleLeft, IconAngleRight, LoadingSpinner } from "hds-react";
import { useTranslation } from "react-i18next";

import { usePaymentMethods } from "../talons/checkout/usePaymentMethods";
import { PaymentMethod } from "./PaymentMethod";
import ConfigurableContainer from "./ConfigurableContainer";

const PaymentMethods = () => {
  const { t } = useTranslation();
  const {
    availablePaymentMethods,
    currentSelectedPaymentMethod,
    initialSelectedMethod,
    setCurrentSelectedPaymentMethod,
    isLoading,
    handleProceedToPayment,
    proceedToPaymentLoading,
    goBack,
  } = usePaymentMethods();

  const [noMethodSelected, setNoMethodSelected] = useState(true);

  // TODO: validate somehow that we're allowed to be here?

  if (isLoading) {
    return <ConfigurableContainer containerClassName={'box py-5 full-width'}>
              <LoadingSpinner />
           </ConfigurableContainer>;
  }

  const hasPaymentMethods = availablePaymentMethods && Object.keys(availablePaymentMethods).length > 0

  return (
    <Container className="checkout-container">
      <h2>{t("payment-methods.choose-payment-method")}</h2>
      <div className="inner-box">
        {hasPaymentMethods ? (
          <p>{t("payment-methods.choose-payment-method-info")}</p>
        ) : (
          <p>{t("payment-methods.no-payment-methods-info")}</p>
        )}

        <ul className="payment_methods" aria-label={t("payment-methods.choose-payment-method")}>
          {hasPaymentMethods &&
            Object.keys(availablePaymentMethods).map((key) => {
              const { code, img, name } = availablePaymentMethods[key]
              const isSelected =
                currentSelectedPaymentMethod === null
                  ? initialSelectedMethod === null
                  : currentSelectedPaymentMethod === code;

              const handleSelectPaymentMethod = () => {
                setNoMethodSelected(false);
                setCurrentSelectedPaymentMethod(code);
              }

              const cssRootClass = "payment_method";

              // TODO: styling
              return (
                <PaymentMethod
                  key={name}
                  className={
                    isSelected ? cssRootClass + " selected" : cssRootClass
                  }
                  onClick={handleSelectPaymentMethod}
                  onChange={handleSelectPaymentMethod}
                  onFocus={handleSelectPaymentMethod}
                  image={img}
                  title={name}
                  checked={isSelected}    
                  code={code}
                />
              );
            })}
        </ul>
      </div>
      <div className="checkout-actions desktop-flex">
        <Button
          className="submit"
          onClick={handleProceedToPayment}
          disabled={noMethodSelected || isLoading || proceedToPaymentLoading}
          iconRight={<IconAngleRight />}
        >
          {t("payment-methods.proceed-to-payment")}
        </Button>
        <Button
          className="cancel"
          onClick={goBack}
          variant="secondary"
          iconLeft={<IconAngleLeft />}
        >
          {t("common.cancel-and-return")}
        </Button>
      </div>
    </Container>
  );
};

export default PaymentMethods;
