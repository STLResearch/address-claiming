import { Fragment} from "react";

import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";

import useAuth from '@/hooks/useAuth';

import Head from "next/head";

import LoginPage from "@/Components/common/LoginPage";

const InAppSignIn = () => {
    return (
      <Fragment>
        <Head>
          <title>SkyTrade </title>
        </Head>
  
        <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
          <Sidebar />
          
          <div className={`w-full h-full flex flex-col overflow-scroll md:overflow-hidden pointer-events-none`}>
            <PageHeader pageTitle={"SkyTrade"} />
            <section className=" md:flex relative w-full h-full md:pl-[53px]  " style={{ backgroundImage: "url('/images/map-bg.png')" }}>
            </section>
          </div>
          <LoginPage />
        </div>
      </Fragment>
    );
};

export default InAppSignIn;
