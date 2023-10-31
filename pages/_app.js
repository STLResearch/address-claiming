import '@/styles/globals.css';
import { Provider } from 'react-redux';
import store from '@/store/store';
import Script from 'next/script'

export default function App({ Component, pageProps }) {
    return <Provider store={store}>
        <>
            <Script src="https://cdn.withpersona.com/dist/persona-v4.8.0.js" />
            <Component {...pageProps} />
        </>
    </Provider>
}
