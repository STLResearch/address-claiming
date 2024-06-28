import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel="preload" href="/styles/globals.css" as="style" />
          <link rel="stylesheet" href="/styles/globals.css" />
      
    <link
      href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
      rel="stylesheet"
    />
        <link rel="icon" href="/favicon-1.ico" sizes="any" type="image/x-icon" />
        <link
          href='https://unpkg.com/maplibre-gl@3.1.0/dist/maplibre-gl.css'
          rel='stylesheet'
        />
      </Head>
      <body>
        <div id='backdrop-root'></div>
        <div id='modal-root'></div>
        <Main />
        <NextScript />
        <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/655381bacec6a912820fc8a3/1hf735gcu';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
                })();
              `,
          }}
        />
      </body>
    </Html>
  );
}