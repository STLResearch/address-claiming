import Head from 'next/head';
import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Spinner from '@/Components/Spinner';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const fetchedToken = JSON.parse(localStorage.getItem('openlogin_store'));

    if (fetchedToken?.sessionId) {
      router.push('/homepage/dashboard2');
      return;
    } else {
      router.push("/auth/join");
    }
  }, []);

  return <Spinner />
}
