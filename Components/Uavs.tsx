import Image from "next/image";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import { Fragment, useState, MouseEvent } from "react";

import Sidebar from "@/Components/Shared/Sidebar";
import Navbar from "@/Components/Navbar";
import AddUavModal from "@/Components/Modals/AddUavModal";

import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";

import useAuth from "@/hooks/useAuth";

const UAVs: React.FC = () => {
  const router = useRouter();
  const [addUav, setAddUav] = useState<boolean>(false);

  const { user } = useAuth();

  const uavProfileHandler = () => {
    router.push("/homepage/uavs/1");
  };

  const backdropCloseHandler = () => {
    setAddUav(false);
  };

  const showModalHandler = () => {
    setAddUav(true);
  };

  const closeModalHandler = (e: MouseEvent) => {
    e.preventDefault();
    setAddUav(false);
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <Fragment>
      {addUav &&
        createPortal(
          <Backdrop />,
          document.getElementById("backdrop-root")!
        )}
      {addUav &&
        createPortal(
          <AddUavModal onClose={closeModalHandler} />,
          document.getElementById("modal-root")!
        )}
      <div className="mx-auto flex flex-row" style={{ maxWidth: "1440px" }}>
        <Sidebar />
        <div
          style={{ width: "calc(100vw - 257px)", height: "100vh" }}
          className="overflow-y-auto"
        >
          <Navbar onClose={() => {}} name={user.name} />
          <div
            className="overflow-y-auto bg-white px-10 py-11"
            style={{ height: "100vh", borderTop: "2px solid #F0F0FA" }}
          >
            <h3 className="mb-5 font-semibold">UAVs</h3>
            <div className="grid gap-y-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              <div
                className="rounded"
                style={{
                  width: "260px",
                  height: "324px",
                  boxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Image
                  src="/images/uav.png"
                  alt="a picture of UAV"
                  width={260}
                  height={200}
                />
                <div className="flex flex-col items-center">
                  <div className="mt-5 flex flex-row justify-center gap-1">
                    <p className="font-medium">UAV Nickname</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="6"
                      viewBox="0 0 6 6"
                      fill="none"
                    >
                      <circle cx="3" cy="3" r="3" fill="#1A572E" />
                    </svg>
                  </div>
                  <button
                    onClick={uavProfileHandler}
                    className="my-5 rounded-md bg-dark-blue text-sml font-normal text-white transition-all duration-500 ease-in-out hover:bg-blue-600"
                    style={{ width: "104px", height: "40px" }}
                  >
                    Select
                  </button>
                </div>
              </div>
              <div
                className="rounded"
                style={{
                  width: "260px",
                  height: "324px",
                  boxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Image
                  src="/images/uav.png"
                  alt="a picture of UAV"
                  width={260}
                  height={200}
                />
                <div className="flex flex-col items-center">
                  <div className="mt-5 flex flex-row justify-center gap-1">
                    <p className="font-medium">UAV Nickname</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="6"
                      viewBox="0 0 6 6"
                      fill="none"
                    >
                      <circle cx="3" cy="3" r="3" fill="#1A572E" />
                    </svg>
                  </div>
                  <button
                    onClick={uavProfileHandler}
                    className="my-5 rounded-md bg-dark-blue text-sml font-normal text-white transition-all duration-500 ease-in-out hover:bg-blue-600"
                    style={{ width: "104px", height: "40px" }}
                  >
                    Select
                  </button>
                </div>
              </div>
              <div
                className="rounded"
                style={{
                  width: "260px",
                  height: "324px",
                  boxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Image
                  src="/images/uav.png"
                  alt="a picture of UAV"
                  width={260}
                  height={200}
                />
                <div className="flex flex-col items-center">
                  <div className="mt-5 flex flex-row justify-center gap-1">
                    <p className="font-medium">UAV Nickname</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="6"
                      viewBox="0 0 6 6"
                      fill="none"
                    >
                      <circle cx="3" cy="3" r="3" fill="#1A572E" />
                    </svg>
                  </div>
                  <button
                    onClick={uavProfileHandler}
                    className="my-5 rounded-md bg-dark-blue text-sml font-normal text-white transition-all duration-500 ease-in-out hover:bg-blue-600"
                    style={{ width: "104px", height: "40px" }}
                  >
                    Select
                  </button>
                </div>
              </div>
              <div
                className="rounded"
                style={{
                  width: "260px",
                  height: "324px",
                  boxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Image
                  src="/images/uav.png"
                  alt="a picture of UAV"
                  width={260}
                  height={200}
                />
                <div className="flex flex-col items-center">
                  <div className="mt-5 flex flex-row justify-center gap-1">
                    <p className="font-medium">UAV Nickname</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="6"
                      viewBox="0 0 6 6"
                      fill="none"
                    >
                      <circle cx="3" cy="3" r="3" fill="#1A572E" />
                    </svg>
                  </div>
                  <button
                    onClick={uavProfileHandler}
                    className="my-5 rounded-md bg-dark-blue text-sml font-normal text-white transition-all duration-500 ease-in-out hover:bg-blue-600"
                    style={{ width: "104px", height: "40px" }}
                  >
                    Select
                  </button>
                </div>
              </div>
              <button
                onClick={showModalHandler}
                className="flex flex-col items-center justify-center gap-2 rounded border-2 border-dashed transition-all duration-500 ease-in-out hover:bg-bleach-blue"
                style={{ width: "260px", height: "324px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.9165 11.4993C1.9165 6.20647 6.20696 1.91602 11.4998 1.91602C16.7927 1.91602 21.0832 6.20647 21.0832 11.4993C21.0832 16.7922 16.7927 21.0827 11.4998 21.0827C6.20696 21.0827 1.9165 16.7922 1.9165 11.4993ZM11.4998 3.83268C9.46651 3.83268 7.51646 4.64042 6.07869 6.0782C4.64091 7.51598 3.83317 9.46602 3.83317 11.4993C3.83317 13.5327 4.64091 15.4827 6.07869 16.9205C7.51646 18.3583 9.46651 19.166 11.4998 19.166C13.5332 19.166 15.4832 18.3583 16.921 16.9205C18.3588 15.4827 19.1665 13.5327 19.1665 11.4993C19.1665 9.46602 18.3588 7.51598 16.921 6.0782C15.4832 4.64042 13.5332 3.83268 11.4998 3.83268Z"
                    fill="#0653EA"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.4583 6.70833C12.4583 6.45417 12.3574 6.21041 12.1776 6.03069C11.9979 5.85097 11.7542 5.75 11.5 5.75C11.2458 5.75 11.0021 5.85097 10.8224 6.03069C10.6426 6.21041 10.5417 6.45417 10.5417 6.70833V10.5417H6.70833C6.45417 10.5417 6.21041 10.6426 6.03069 10.8224C5.85097 11.0021 5.75 11.2458 5.75 11.5C5.75 11.7542 5.85097 11.9979 6.03069 12.1776C6.21041 12.3574 6.45417 12.4583 6.70833 12.4583H10.5417V16.2917C10.5417 16.5458 10.6426 16.7896 10.8224 16.9693C11.0021 17.149 11.2458 17.25 11.5 17.25C11.7542 17.25 11.9979 17.149 12.1776 16.9693C12.3574 16.7896 12.4583 16.5458 12.4583 16.2917V12.4583H16.2917C16.5458 12.4583 16.7896 12.3574 16.9693 12.1776C17.149 11.9979 17.25 11.7542 17.25 11.5C17.25 11.2458 17.149 11.0021 16.9693 10.8224C16.7896 10.6426 16.5458 10.5417 16.2917 10.5417H12.4583V6.70833Z"
                    fill="#0653EA"
                  />
                </svg>
                <p>Add a UAV</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UAVs;
