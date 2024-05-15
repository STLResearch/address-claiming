import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
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
    router.push('/auth/join');
  }

  useEffect(() => {
    if (web3auth) {
      if (web3auth.status === "connected") {
        const userData = localStorage.getItem("user");
        if (userData && userData !== "undefined") {
          router.push('/homepage/dashboard2');
        } else {
          logout();
        }
      }
    }
  }, [web3auth?.status]);


  return <Spinner />
}
