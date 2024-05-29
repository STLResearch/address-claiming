import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { UserIcon } from "./Shared/Icons";

const PageHeader = ({ pageTitle }) => {
  const { user } = useAuth();

  return (
    <div className="relative w-full z-30 flex flex-col">
      <div
        className="flex items-center justify-between py-[25.5px] md:pb-[23px] md:pt-[32px] md:pl-[39.71px] md:pr-[41px] text-[#222222] bg-white"
        style={{ boxShadow: "0px 2px 12px 0px #00000014" }}
      >
        <p className="md:text-2xl text-xl font-normal md:font-medium mx-auto md:m-0">
          {pageTitle}
        </p>
        <Link
          href={"/my-account"}
          className="gap-[14px] items-center absolute md:flex md:relative left-[19px]"
        >
          <div className="w-6 h-6">
            <UserIcon />
          </div>
          <p className="md:block hidden">{user?.name}</p>
        </Link>
      </div>
    </div>
  );
};

export default PageHeader;
