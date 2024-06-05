"use client"

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/Components/Spinner';
import useAutoLogout from '@/hooks/useAutoLogout';
import { Web3authContext } from '@/providers/web3authProvider';


export default function Home() {
  useAutoLogout();
  const router = useRouter();

  const { web3auth } = useContext(Web3authContext);

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    router.push('/airspaces');
  }

  useEffect(() => {
    if (web3auth) {
      if (web3auth.status === "connected") {
        const userData = localStorage.getItem("user");
        if (userData && userData !== "undefined") {
          router.push('/dashboard');
        } else {
          logout();
        }
      }
    }
  }, [web3auth?.status]);


  return <Spinner />
}