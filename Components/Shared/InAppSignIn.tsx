'use client'

import { Fragment, useEffect} from "react";
import Sidebar from "@/Components/Shared/Sidebar";
import Head from "next/head";
import { toast } from "react-toastify";
import LoginPage from "@/Components/Shared/LoginPage";
import { useMobile } from "@/hooks/useMobile";
import useAuth from '@/hooks/useAuth';
import { usePathname } from "next/navigation";

const InAppSignIn = () => {

    const {user}=useAuth()

    const { isMobile } = useMobile();
    const pathname = usePathname()
    if(user && user.blockchainAddress){
        return null
    }
  
  return (
      <Fragment>
        <Head>
          <title>SkyTrade </title>
        </Head>

        <div className="fixed left-0 top-0 rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden z-50">
          {!isMobile && (
          <Sidebar />
          )}

          <div className={`w-full h-full flex flex-col overflow-scroll md:overflow-hidden pointer-events-none`}>
           
            <section className=" md:flex relative w-full h-full md:pl-[53px]  " style={{ backgroundImage: "url('/images/map-bg.png')",backgroundSize:"cover" }}>
            </section>
          </div>
          <LoginPage />
        </div>
      </Fragment>
    );
};

export default InAppSignIn;