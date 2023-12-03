import { useRouter } from 'next/router';

import Script from 'next/script';

const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className='flex h-screen flex-col items-center justify-center gap-5'>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-C0J4J56QW5' />
      <Script id='google-analytics'>
        {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', 'G-C0J4J56QW5');
            `}
      </Script>
      <p>404!</p>
      <p>oops! the page you try to visit does not exist</p>
      <button
        onClick={() => router.push('/homepage/dashboard')}
        className='rounded-md bg-bleach-brown p-2 text-white'
      >
        return to homepage
      </button>
    </div>
  );
};

export default ErrorPage;
