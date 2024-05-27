import { Fragment } from "react";
import Head from "next/head";
import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";

interface IProps {
  title: string;
  isLoading: boolean;
  showSidebar: boolean;
  showPageHeader: boolean;
  children: React.ReactNode;
}

export default function MainLayout({ isLoading, title, children, showSidebar, showPageHeader }: IProps) {

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - {title}</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}
      <div className="relative rounded bg-white sm:bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden ">
        {showSidebar && <Sidebar />}
        
        <div className="w-full h-full flex flex-col">
          {showPageHeader && <PageHeader pageTitle={title} />}
          
          { children }
        </div>
      </div>
    </Fragment>
  )
}
