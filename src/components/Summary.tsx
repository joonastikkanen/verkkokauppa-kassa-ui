import React, { useContext } from "react";
import {
  Button,
  Container,
  IconAngleLeft,
  IconAngleRight,
  Checkbox,
  Notification
} from "hds-react";
import { useHistory, useParams } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

import Products from "./Products";
import { AppContext } from "../context/Appcontext";
import { Formik, Form, Field } from "formik";
import { getSearchParam } from "../hooks/useSearchParam";
import { stringToArray } from "../utils/StringUtils";
import authService from '../auth/authService';

function Summary() {
  const { t } = useTranslation();
  const { merchantTermsOfServiceUrl, orderId, firstName, lastName, email, phone, merchantUrl,namespace } = useContext(AppContext);

  const history = useHistory();
  let { id } = useParams();

  let skipTermsAcceptForNamespaces = stringToArray(process.env.REACT_APP_SKIP_TERMS_ACCEPT_FOR_NAMESPACES);
  const isSkipTermsAcceptForNameSpace = skipTermsAcceptForNamespaces.includes(namespace);

  if (!firstName) {
    if (authService.isAuthenticated()) {
      history.push("/profile/" + id);
    } else {
      history.push("/" + id);
    } 
  }

  const goBack = () => {
    history.goBack(); // TODO: ok?
  };
  
  const backToService = () => {
    window.location.replace(merchantUrl);
  };

  const paymentPaid = getSearchParam("paymentPaid");

  return (
    <div className="App2">
      <Container className="checkout-container">
        {paymentPaid === "false" ? (
          <Notification label={t("alert.payment-cancelled.title")} type="alert">{t("alert.payment-cancelled.description")}</Notification>
        ) : (
          ""
        )}
      </Container>
      <Container className="checkout-container desktop-flex" id="checkout-container">
        
                
        <Products activeStep={2} />

        <div className="subscriber-details">
          <h2>{t("summary.customer-information")}</h2>
          <div className="inner-box">
            <div className="subscriber-details-values">
              <table>
                <tr><td>{firstName} {lastName}</td></tr>
                <tr><td>{email}</td></tr>
                <tr><td>{phone}</td></tr>
              </table>
            </div>
          </div>
          <hr />

          <div className="checkout-actions">
          <Formik
            initialValues={{ acceptTerms: false }}
            onSubmit={() => {
              if (authService.isAuthenticated()) {
                history.push("/profile/" + orderId + "/paymentmethod");
              } else {
                history.push("/" + orderId + "/paymentmethod");
              } 
            }}
            validate={(values) => {
              const errors: any = {};
              // skips validation for some namespaces
              if (!isSkipTermsAcceptForNameSpace && !values.acceptTerms ) {
                errors.acceptTerms = t("summary.terms.cb-error");
              }

              return errors
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>

                {!isSkipTermsAcceptForNameSpace && <Field
                  as={Checkbox}
                  id="acceptTerms"
                  type="checkbox"
                  name="acceptTerms"
                  label={
                    <Trans i18nKey="summary.terms.cb-label" t={t}>I have read and agree to the <a target="_blank"  href={merchantTermsOfServiceUrl} rel="noreferrer">terms of use</a> and <a target="_blank"  href={merchantTermsOfServiceUrl} rel="noreferrer">privacy policy</a></Trans>
                  }
                  className="checkout-input"
                  errorText={
                    errors.acceptTerms && touched.acceptTerms
                      ? errors.acceptTerms
                      : undefined
                  }
                />}

                <div className="desktop-flex">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit"
                    iconRight={<IconAngleRight />}
                  >
                    {t("checkout.form.submit-button")}
                  </Button>

                  {paymentPaid === "false" ? (
                     <Button
                      onClick={backToService}
                      className="cancel"
                      variant="secondary"
                      iconLeft={<IconAngleLeft />}
                    >
                      {t("common.cancel-and-return")}
                    </Button>
                  ) : (
                    <Button
                      onClick={goBack}
                      className="cancel"
                      variant="secondary"
                      iconLeft={<IconAngleLeft />}
                    >
                      {t("common.cancel-and-return")}
                    </Button>
                  )}
                 
                </div>
              </Form>
            )}
          </Formik>
        </div>
        </div>
      </Container>
    </div>
  );
}

export default Summary;
