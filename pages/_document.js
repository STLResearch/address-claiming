import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link
          href='https://unpkg.com/maplibre-gl@3.1.0/dist/maplibre-gl.css'
          rel='stylesheet'
        />
        <link
          rel='shortcut icon'
          href='https://sky.trade/assets/images/ttt-2.jpg'
          type='image/x-icon'
        ></link>
      </Head>
      <body>
        <div id='backdrop-root'></div>
        <div id='modal-root'></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
