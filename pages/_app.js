import '@/styles/globals.css';
import { Provider } from 'react-redux';
import store from '@/store/store';
import Script from 'next/script';
import CookieConsent from '@/Components/CookieConsent'

import { AuthProvider } from '@/hooks/useAuth';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <>
          <Script src='https://cdn.withpersona.com/dist/persona-v4.8.0.js' />
          <Component {...pageProps} />
          <CookieConsent /> 
        </>
      </Provider>
    </AuthProvider>
  );
}
