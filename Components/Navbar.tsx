import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

interface NavbarProps {
  onClose: () => void;
  children?: ReactNode;
  name: string;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const router = useRouter();

  return (
    <header onClick={props.onClose} className="bg-white p-0">
      <nav
        className={`my-0 flex w-full flex-row ${
          props.children ? "justify-between" : "justify-end"
        } items-center`}
      >
        {props.children}
        <div
          className={`me-5 flex flex-row items-center justify-center ${
            !props.children && "mt-7"
          } cursor-pointer`}
        >
          <Image
            src="/images/user-icon.png"
            alt="icon"
            className="ms-6"
            width={30}
            height={30}
          />
          <div
            onClick={() => router.push("/homepage/settings")}
            className="me-5 ms-2"
          >
            <p className="font-base font-medium">{props.name}</p>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
