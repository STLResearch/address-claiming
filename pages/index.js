import Head from 'next/head';
import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const fetchedToken = JSON.parse(localStorage.getItem('openlogin_store'));

    if (fetchedToken?.sessionId) {
      router.push('/homepage/dashboard');
      return;
    }
  }, []);

  return (
    <Fragment>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-C0J4J56QW5' />
      <Script id='google-analytics'>
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
      
              gtag('config', 'G-C0J4J56QW5');
          `}
      </Script>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>SkyTrade</title>
      </Head>
      <div className='mt-20 flex flex-col items-center justify-center'>
        <h1>Welcome to SkyTrade</h1>
        <button
          onClick={() => router.push('/auth/join')}
          className='my-5 rounded-md bg-dark-blue text-sml font-normal text-white transition-all duration-500 ease-in-out hover:bg-blue-600'
          style={{ width: '104px', height: '40px' }}
        >
          Get Started
        </button>
      </div>
    </Fragment>
  );
}
