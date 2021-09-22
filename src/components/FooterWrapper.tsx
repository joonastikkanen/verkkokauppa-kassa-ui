import { useTranslation } from "react-i18next";
import React from "react";
import { Footer } from "hds-react";

export function FooterWrapper() {
  const { t } = useTranslation();
  let footerLinks = [];
  let supportEmail = 'tuki.checkout@hel.fi'
  footerLinks.push([ 'https://www.hel.fi/static/talpa/verkkokauppa-alustan-rekisteriseloste.pdf', t('footer.terms-url') ])

  return <Footer title="checkout.hel.fi">
    <Footer.Navigation>
      { footerLinks.map((data) => (
        <Footer.Item key={ data[0] } href={ data[0] } onClick={ (e: { preventDefault: () => void; }) => {
          e.preventDefault()
          window.open(data[0])
        } } label={ data[1] }/>
      ))
      }

      <Footer.Item key={ 'cookieHubOpen' } href={ '#' } onClick={ (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        (window as any).cookiehub.openSettings()
      } } label={ t('footer.cookie-hub') }/>

      <Footer.Item className={'footer-support'} key={ 'support-email' }
                   label={
                     <div className={'footer-support-div'}>
                       <span className={'footer-support-header'}>{t('footer.support.header',{ email: supportEmail, }) }</span>
                       <span className={'footer-support-text'} dangerouslySetInnerHTML={{
                         __html: t('footer.support.text', { email: supportEmail , interpolation: { escapeValue: false } })
                       }}/>
                     </div>
                   }
                   />

    </Footer.Navigation>
    <Footer.Base copyrightHolder="Copyright" copyrightText="All rights reserved"/>
  </Footer>;
}