import { Html, Head, Main, NextScript } from 'next/document';
// import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href='https://unpkg.com/maplibre-gl@3.1.0/dist/maplibre-gl.css' rel='stylesheet' />
        <link rel="shortcut icon" href="https://sky.trade/assets/images/ttt-2.jpg" type="image/x-icon"></link>
      </Head>
      <body>
        
        {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-C0J4J56QW5" />
        <Script id="google-analytics">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', 'G-C0J4J56QW5');
            `}
        </Script> */}
        <div id="backdrop-root"></div>
        <div id="modal-root"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
