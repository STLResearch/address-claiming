import Link from "next/link";
import Image from "next/image";
import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import swal from "sweetalert";

import { useVerification } from "@/hooks/useVerification";
import { counterActions } from "@/store/store";
import Spinner from "./Spinner";
import Backdrop from "./Backdrop";
import logo from "../public/images/logo.jpg";

const Sidebar = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { asPath } = router;
    const { verificationCheck } = useVerification();
   
    const [airspaceOptions, setAirspaceOption] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    let isActive;
    
    const NavLink = (props) =>  {
        // const isActive = asPath === props.href;
        isActive = asPath.includes(props.href);

        return <Link href={props.href} className={`${isActive && "border-s-2 border-dark-blue bg-gradient-to-r from-blue-400 to-white"} flex flex-row items-center gap-2 rounded-md p-2 hover:border-s-2 hover:border-dark-blue hover:bg-gradient-to-r hover:from-blue-400 hover:to-white`}>
          {props.children}
        </Link>
    };

    const airspaceOptionsHandler = () => {
        setAirspaceOption(!airspaceOptions);
    };

    const airspaceSection = () => {
        if(props.user.categoryId === 1 && props.user.KYCStatusId !== 2) {
            swal({
                title: "Sorry!",
                text: "Your KYB is yet to be completed. A member of our team will be in contact with you soon",
              })
            return;
        }

        router.push("/homepage/airspace");
        verificationCheck(props.users);
    };

    const logoutHandler = () => {
        setIsLoading(true);
        localStorage.removeItem("openlogin_store");
        localStorage.removeItem("email");
        localStorage.removeItem("signature");
        router.replace("/auth/join");
    }

    return <Fragment>
         {isLoading && createPortal(<Backdrop />, document.getElementById("backdrop-root"))}
        {isLoading && createPortal(<Spinner />, document.getElementById("backdrop-root"))}
        <aside className="bg-white relative border-e-2 pe-5" style={{width: "257px", height: "100vh"}}>
            <Image src={logo} alt="Company's logo" width={164} height={58} className="mt-4 ms-12 my-12" />
            <div className="flex flex-col gap-2 ms-10">
                <NavLink href="/homepage/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath == "/homepage/dashboard" ? "#0653EA" : "#252530"}`}>
                        <path d="M8.74866 2.41602H6.45283C3.80658 2.41602 2.41699 3.8056 2.41699 6.43977V8.7356C2.41699 11.3698 3.80658 12.7593 6.44074 12.7593H8.73658C11.3707 12.7593 12.7603 11.3698 12.7603 8.7356V6.43977C12.7724 3.8056 11.3828 2.41602 8.74866 2.41602Z" />
                        <path d="M22.5598 2.41602H20.264C17.6298 2.41602 16.2402 3.8056 16.2402 6.43977V8.7356C16.2402 11.3698 17.6298 12.7593 20.264 12.7593H22.5598C25.194 12.7593 26.5836 11.3698 26.5836 8.7356V6.43977C26.5836 3.8056 25.194 2.41602 22.5598 2.41602Z" />
                        <path d="M22.5598 16.2285H20.264C17.6298 16.2285 16.2402 17.6181 16.2402 20.2523V22.5481C16.2402 25.1823 17.6298 26.5718 20.264 26.5718H22.5598C25.194 26.5718 26.5836 25.1823 26.5836 22.5481V20.2523C26.5836 17.6181 25.194 16.2285 22.5598 16.2285Z" />
                        <path d="M8.74866 16.2285H6.45283C3.80658 16.2285 2.41699 17.6181 2.41699 20.2523V22.5481C2.41699 25.1943 3.80658 26.5839 6.44074 26.5839H8.73658C11.3707 26.5839 12.7603 25.1944 12.7603 22.5602V20.2643C12.7724 17.6181 11.3828 16.2285 8.74866 16.2285Z" />
                    </svg>
                    <span className={`${asPath == "/homepage/dashboard" ? "text-dark-blue" : "text-light-brown"} font-semibold`}>Dashboard</span>
                </NavLink>
                {/* <NavLink href="/homepage/airspace"> */}
                <div>
                    <button onClick={airspaceOptionsHandler} className={`${asPath.includes("/homepage/airspace") && "border-s-2 border-dark-blue bg-gradient-to-r from-blue-400 to-white"}   flex flex-row justify-between items-center w-full rounded-md p-2 pe-4 hover:border-s-2 hover:border-dark-blue hover:bg-gradient-to-r hover:from-blue-400 hover:to-white`}>                
                        <div className="flex flex-row items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath == "/homepage/airspace"  ? "#0653EA" : "#252530"}`}>
                                <path d="M23.3574 6.86354L15.7811 2.77938C14.9836 2.34437 14.0169 2.34437 13.2194 2.77938L5.64319 6.86354C5.08736 7.16563 4.74902 7.74563 4.74902 8.41021C4.74902 9.06271 5.08736 9.65479 5.64319 9.95688L13.2194 14.041C13.6182 14.2585 14.0653 14.3673 14.5003 14.3673C14.9353 14.3673 15.3824 14.2585 15.7811 14.041L23.3574 9.95688C23.9132 9.65479 24.2515 9.07479 24.2515 8.41021C24.2515 7.74563 23.9132 7.16563 23.3574 6.86354Z" />
                                <path d="M11.9749 15.4552L4.91824 11.9269C4.37449 11.6611 3.74616 11.6852 3.23866 11.9994C2.71908 12.3257 2.41699 12.8694 2.41699 13.4736V20.1315C2.41699 21.2794 3.05741 22.3186 4.08449 22.8382L11.1291 26.3665C11.3707 26.4873 11.6366 26.5477 11.9024 26.5477C12.2166 26.5477 12.5307 26.4632 12.8087 26.294C13.3282 25.9798 13.6303 25.424 13.6303 24.8198V18.1619C13.6424 17.0019 13.002 15.9627 11.9749 15.4552Z" />
                                <path d="M25.7618 11.9984C25.2422 11.6843 24.6139 11.648 24.0822 11.9259L17.0376 15.4543C16.0105 15.9738 15.3701 17.0009 15.3701 18.1609V24.8188C15.3701 25.423 15.6722 25.9788 16.1918 26.293C16.4697 26.4622 16.7839 26.5468 17.098 26.5468C17.3639 26.5468 17.6297 26.4863 17.8714 26.3655L24.916 22.8372C25.943 22.3176 26.5835 21.2905 26.5835 20.1305V13.4726C26.5835 12.8684 26.2814 12.3247 25.7618 11.9984Z" />
                            </svg>
                            <span className={`${asPath == "/homepage/airspace"  ? "text-dark-blue" : "text-light-brown"} font-semibold`}>Airspaces</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none" className={`${airspaceOptions && "rotate-180"} transition-all duration-200 ease-in-out`}>
                            <path d="M2.72027 6.71203L7.06694 11.602C7.58027 12.1795 8.42027 12.1795 8.93361 11.602L13.2803 6.71203" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    {airspaceOptions &&
                        <div className="flex flex-col items-start ps-10 mb-2 mt-2">
                            <button onClick={airspaceSection}>
                                <span className="text-light-brown text-sml hover:text-dark-blue font-semibold">Claim Airspace</span>
                            </button>
                            <button onClick={() => router.push("/homepage/airspace")} className="hover:text-dark-blue">
                                <span className="text-light-brown text-sml hover:text-dark-blue font-semibold">Airspaces</span>
                            </button>
                            {/* <button className="hover:text-dark-blue">
                                <span className="text-light-brown text-sml hover:text-dark-blue font-semibold">My Airspace</span>
                            </button> */}
                        </div>  
                    }
                </div>
                {/* <NavLink href="/homepage/uavs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath.includes("/homepage/uavs")  ? "#0653EA" : "#252530"}`}>
                        <path d="M24.2272 12.845L18.5843 10.4163L17.3276 9.88458C17.1343 9.78792 16.9651 9.53417 16.9651 9.31667V5.61917C16.9651 4.45917 16.1072 3.08167 15.068 2.55C14.7055 2.36875 14.2705 2.36875 13.908 2.55C12.8809 3.08167 12.023 4.47125 12.023 5.63125V9.32875C12.023 9.54625 11.8538 9.8 11.6605 9.89667L4.77301 12.8571C4.01176 13.1713 3.39551 14.1258 3.39551 14.9475V16.5425C3.39551 17.5696 4.16884 18.0771 5.12342 17.6663L11.1772 15.0563C11.6484 14.8508 12.0351 15.1046 12.0351 15.6242V16.9654V19.1404C12.0351 19.4183 11.878 19.8171 11.6847 20.0104L8.88134 22.8258C8.59134 23.1158 8.45842 23.6838 8.59134 24.0946L9.13509 25.7379C9.35259 26.4508 10.1622 26.7892 10.8268 26.4508L13.7026 24.0342C14.1376 23.6596 14.8505 23.6596 15.2855 24.0342L18.1613 26.4508C18.8259 26.7771 19.6355 26.4508 19.8772 25.7379L20.4209 24.0946C20.5538 23.6958 20.4209 23.1158 20.1309 22.8258L17.3276 20.0104C17.1222 19.8171 16.9651 19.4183 16.9651 19.1404V15.6242C16.9651 15.1046 17.3397 14.8629 17.823 15.0563L23.8768 17.6663C24.8313 18.0771 25.6047 17.5696 25.6047 16.5425V14.9475C25.6047 14.1258 24.9884 13.1713 24.2272 12.845Z" fill=""/>
                    </svg>
                    <span className={`${asPath.includes("/homepage/uavs")  ? "text-dark-blue" : "text-light-brown"} font-semibold`}>UAVs</span>
                </NavLink> */}

                <div className="flex flex-row items-center gap-2 rounded-md p-2 relative cursor-default">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath.includes("/homepage/uavs")  ? "#0653EA" : "#252530"}`}>
                        <path d="M24.2272 12.845L18.5843 10.4163L17.3276 9.88458C17.1343 9.78792 16.9651 9.53417 16.9651 9.31667V5.61917C16.9651 4.45917 16.1072 3.08167 15.068 2.55C14.7055 2.36875 14.2705 2.36875 13.908 2.55C12.8809 3.08167 12.023 4.47125 12.023 5.63125V9.32875C12.023 9.54625 11.8538 9.8 11.6605 9.89667L4.77301 12.8571C4.01176 13.1713 3.39551 14.1258 3.39551 14.9475V16.5425C3.39551 17.5696 4.16884 18.0771 5.12342 17.6663L11.1772 15.0563C11.6484 14.8508 12.0351 15.1046 12.0351 15.6242V16.9654V19.1404C12.0351 19.4183 11.878 19.8171 11.6847 20.0104L8.88134 22.8258C8.59134 23.1158 8.45842 23.6838 8.59134 24.0946L9.13509 25.7379C9.35259 26.4508 10.1622 26.7892 10.8268 26.4508L13.7026 24.0342C14.1376 23.6596 14.8505 23.6596 15.2855 24.0342L18.1613 26.4508C18.8259 26.7771 19.6355 26.4508 19.8772 25.7379L20.4209 24.0946C20.5538 23.6958 20.4209 23.1158 20.1309 22.8258L17.3276 20.0104C17.1222 19.8171 16.9651 19.4183 16.9651 19.1404V15.6242C16.9651 15.1046 17.3397 14.8629 17.823 15.0563L23.8768 17.6663C24.8313 18.0771 25.6047 17.5696 25.6047 16.5425V14.9475C25.6047 14.1258 24.9884 13.1713 24.2272 12.845Z" fill=""/>
                    </svg>
                    <span className={`${asPath.includes("/homepage/uavs")  ? "text-dark-blue" : "text-light-brown"} font-semibold`}>UAVs</span>
                    <div className="me-1.5 flex flex-col items-center justify-center font-semibold absolute right-0 px-2 py-2.5" style={{height: "16px", borderRadius:"3px", }}>
                        <p className="text-sm text-dark-green">Coming</p>
                        <span className="text-sm text-dark-green">Soon</span>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 rounded-md p-2 relative cursor-default">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath == "/homepage/weather" ? "#0653EA" : "#252530"}`}>
                        <path d="M24.3724 21.2301C23.732 21.8221 22.9949 22.2692 22.1974 22.5713C21.3999 22.8734 20.542 22.2934 20.542 21.4355V19.8405C20.542 17.4842 18.6328 15.5751 16.2766 15.5751H12.7241C10.3678 15.5751 8.45866 17.4842 8.45866 19.8405V21.7496C8.45866 22.4142 7.91491 22.958 7.25033 22.958H6.70658C3.74616 22.5109 2.41699 20.1063 2.41699 17.9555C2.41699 15.9255 3.60116 13.678 6.17491 13.0496C5.46199 10.2342 6.06616 7.58797 7.90282 5.66672C9.99324 3.47964 13.3282 2.60964 16.2041 3.50381C18.8503 4.31339 20.7112 6.48839 21.3757 9.50922C23.6837 10.0288 25.5324 11.7688 26.2695 14.1855C27.067 16.8076 26.342 19.5021 24.3724 21.2301Z" fill=""/>
                    </svg>
                    <span className="text-light-brown font-semibold">Weather</span>
                    <div className="me-1.5 flex flex-col items-center justify-center font-semibold absolute right-0 px-2 py-2.5" style={{height: "16px", borderRadius:"3px", }}>
                        <p className="text-sm text-dark-green">Coming</p>
                        <span className="text-sm text-dark-green">Soon</span>
                    </div>
                </div>

                {/* <NavLink href="/homepage/weather">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath == "/homepage/weather" ? "#0653EA" : "#252530"}`}>
                        <path d="M24.3724 21.2301C23.732 21.8221 22.9949 22.2692 22.1974 22.5713C21.3999 22.8734 20.542 22.2934 20.542 21.4355V19.8405C20.542 17.4842 18.6328 15.5751 16.2766 15.5751H12.7241C10.3678 15.5751 8.45866 17.4842 8.45866 19.8405V21.7496C8.45866 22.4142 7.91491 22.958 7.25033 22.958H6.70658C3.74616 22.5109 2.41699 20.1063 2.41699 17.9555C2.41699 15.9255 3.60116 13.678 6.17491 13.0496C5.46199 10.2342 6.06616 7.58797 7.90282 5.66672C9.99324 3.47964 13.3282 2.60964 16.2041 3.50381C18.8503 4.31339 20.7112 6.48839 21.3757 9.50922C23.6837 10.0288 25.5324 11.7688 26.2695 14.1855C27.067 16.8076 26.342 19.5021 24.3724 21.2301Z" fill=""/>
                    </svg>
                    <span className={`${asPath == "/homepage/weather"  ? "text-dark-blue" : "text-light-brown"} font-semibold`}>Weather</span>
                </NavLink> */}

                {/* <NavLink href="/homepage/pilots">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath == "/homepage/pilots"  ? "#0653EA" : "#252530"}`}>
                        <path d="M23.5746 7.0681L16.3971 2.92352C15.225 2.24685 13.775 2.24685 12.5908 2.92352L5.4254 7.0681C4.25332 7.74477 3.52832 9.00143 3.52832 10.3668V18.6318C3.52832 19.9852 4.25332 21.2418 5.4254 21.9306L12.6029 26.0752C13.775 26.7518 15.225 26.7518 16.4092 26.0752L23.5867 21.9306C24.7587 21.2539 25.4837 19.9973 25.4837 18.6318V10.3668C25.4717 9.00143 24.7467 7.75685 23.5746 7.0681ZM14.5 8.86852C16.0587 8.86852 17.3154 10.1252 17.3154 11.6839C17.3154 13.2427 16.0587 14.4993 14.5 14.4993C12.9412 14.4993 11.6846 13.2427 11.6846 11.6839C11.6846 10.1373 12.9412 8.86852 14.5 8.86852ZM17.7383 20.1302H11.2617C10.2829 20.1302 9.71499 19.0427 10.2587 18.2331C11.0804 17.0127 12.6754 16.191 14.5 16.191C16.3246 16.191 17.9196 17.0127 18.7412 18.2331C19.285 19.0306 18.705 20.1302 17.7383 20.1302Z" />
                    </svg>
                    <span className={`${asPath == "/homepage/pilots"  ? "text-dark-blue" : "text-light-brown"} font-semibold`}>Pilots</span>
                </NavLink> */}

                <div className="flex flex-row items-center gap-2 rounded-md p-2 relative cursor-default">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath == "/homepage/pilots"  ? "#0653EA" : "#252530"}`}>
                        <path d="M23.5746 7.0681L16.3971 2.92352C15.225 2.24685 13.775 2.24685 12.5908 2.92352L5.4254 7.0681C4.25332 7.74477 3.52832 9.00143 3.52832 10.3668V18.6318C3.52832 19.9852 4.25332 21.2418 5.4254 21.9306L12.6029 26.0752C13.775 26.7518 15.225 26.7518 16.4092 26.0752L23.5867 21.9306C24.7587 21.2539 25.4837 19.9973 25.4837 18.6318V10.3668C25.4717 9.00143 24.7467 7.75685 23.5746 7.0681ZM14.5 8.86852C16.0587 8.86852 17.3154 10.1252 17.3154 11.6839C17.3154 13.2427 16.0587 14.4993 14.5 14.4993C12.9412 14.4993 11.6846 13.2427 11.6846 11.6839C11.6846 10.1373 12.9412 8.86852 14.5 8.86852ZM17.7383 20.1302H11.2617C10.2829 20.1302 9.71499 19.0427 10.2587 18.2331C11.0804 17.0127 12.6754 16.191 14.5 16.191C16.3246 16.191 17.9196 17.0127 18.7412 18.2331C19.285 19.0306 18.705 20.1302 17.7383 20.1302Z" />
                    </svg>
                    <span className={`${asPath == "/homepage/pilots"  ? "text-dark-blue" : "text-light-brown"} font-semibold`}>Pilots</span>
                    <div className="me-1.5 flex flex-col items-center justify-center font-semibold absolute right-0 px-2 py-2.5" style={{height: "16px", borderRadius:"3px", }}>
                        <p className="text-sm text-dark-green">Coming</p>
                        <span className="text-sm text-dark-green">Soon</span>
                    </div>
                </div>

                <NavLink href="/homepage/wallet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath.includes("/homepage/wallet")  ? "#0653EA" : "#252530"}`}>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M25.3874 12.2907L25.3906 16.6684C25.3597 17.0854 25.32 17.502 25.2714 17.9177C25.1901 18.613 24.6249 19.1739 23.9151 19.2532C21.6921 19.5016 19.3916 19.5016 17.1686 19.2532C16.4588 19.1739 15.8936 18.613 15.8123 17.9177C15.5467 15.6473 15.5467 13.3536 15.8123 11.0831C15.8936 10.3878 16.4588 9.82699 17.1686 9.74766C19.3916 9.49921 21.6921 9.49921 23.9151 9.74766C24.6249 9.82699 25.1901 10.3878 25.2714 11.0831C25.3184 11.485 25.3571 11.8876 25.3874 12.2907ZM20.5418 12.6879C19.5408 12.6879 18.7293 13.4994 18.7293 14.5004C18.7293 15.5014 19.5408 16.3129 20.5418 16.3129C21.5429 16.3129 22.3543 15.5014 22.3543 14.5004C22.3543 13.4994 21.5429 12.6879 20.5418 12.6879Z" />
                        <path d="M24.6545 7.29842C24.8424 7.62378 24.4898 7.98811 24.1164 7.94638C21.7596 7.68297 19.3241 7.68297 16.9673 7.94638C15.4335 8.1178 14.193 9.32558 14.0121 10.8726C13.7301 13.2829 13.7301 15.7179 14.0121 18.1283C14.193 19.6753 15.4335 20.883 16.9673 21.0545C19.3241 21.3179 21.7596 21.3179 24.1164 21.0545C24.4923 21.0125 24.8478 21.3793 24.6581 21.7065C23.7173 23.3291 22.04 24.4615 20.0909 24.6666L19.3032 24.7495C15.3026 25.1705 11.2675 25.1427 7.27302 24.6667L6.75109 24.6046C4.59769 24.3479 2.89146 22.6655 2.60464 20.5159C2.07189 16.5233 2.07189 12.4776 2.60464 8.48492C2.89146 6.33534 4.59769 4.65291 6.75109 4.3963L7.27302 4.33411C11.2675 3.85811 15.3026 3.83035 19.3032 4.25134L20.0909 4.33423C22.0416 4.5395 23.7163 5.67366 24.6545 7.29842Z" />
                    </svg>
                    <span className={`${asPath.includes("/homepage/wallet") ? "text-dark-blue" : "text-light-brown"} font-semibold`}>Wallet</span>
                </NavLink>

                <NavLink href="/homepage/settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill={`${asPath == "/homepage/settings" ? "#0653EA" : "#252530"}`}>
                        <path d="M24.2878 11.1399C22.1007 11.1399 21.2066 9.59326 22.2941 7.69617C22.9224 6.59659 22.5478 5.19492 21.4482 4.56659L19.3578 3.37034C18.4032 2.80242 17.1707 3.14076 16.6028 4.09534L16.4699 4.32492C15.3824 6.22201 13.5941 6.22201 12.4945 4.32492L12.3616 4.09534C11.8178 3.14076 10.5853 2.80242 9.63074 3.37034L7.54033 4.56659C6.44074 5.19492 6.06616 6.60867 6.69449 7.70826C7.79408 9.59326 6.89991 11.1399 4.71283 11.1399C3.45616 11.1399 2.41699 12.167 2.41699 13.4358V15.5624C2.41699 16.8191 3.44408 17.8583 4.71283 17.8583C6.89991 17.8583 7.79408 19.4049 6.69449 21.302C6.06616 22.4016 6.44074 23.8033 7.54033 24.4316L9.63074 25.6278C10.5853 26.1958 11.8178 25.8574 12.3857 24.9028L12.5187 24.6733C13.6062 22.7762 15.3945 22.7762 16.4941 24.6733L16.627 24.9028C17.1949 25.8574 18.4274 26.1958 19.382 25.6278L21.4724 24.4316C22.572 23.8033 22.9466 22.3895 22.3182 21.302C21.2187 19.4049 22.1128 17.8583 24.2999 17.8583C25.5566 17.8583 26.5957 16.8312 26.5957 15.5624V13.4358C26.5837 12.1791 25.5566 11.1399 24.2878 11.1399ZM14.5003 18.4262C12.3374 18.4262 10.5732 16.662 10.5732 14.4991C10.5732 12.3362 12.3374 10.572 14.5003 10.572C16.6632 10.572 18.4274 12.3362 18.4274 14.4991C18.4274 16.662 16.6632 18.4262 14.5003 18.4262Z" fill=""/>
                    </svg>
                    <span className={`${asPath == "/homepage/settings"  ? "text-dark-blue" : "text-light-brown"} font-semibold`}>Settings</span>
                </NavLink>
            </div>
            <button onClick={logoutHandler} className="absolute bottom-2 ms-10 flex flex-row gap-2 w-10/12 rounded-md p-2 hover:border-s-2 hover:border-dark-blue hover:bg-gradient-to-r hover:from-blue-400 hover:to-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                    <path d="M20.3 2.41602H17.1583C13.2917 2.41602 10.875 4.83268 10.875 8.69935V13.5931H18.4271C18.9225 13.5931 19.3333 14.0039 19.3333 14.4993C19.3333 14.9948 18.9225 15.4056 18.4271 15.4056H10.875V20.2993C10.875 24.166 13.2917 26.5827 17.1583 26.5827H20.2879C24.1546 26.5827 26.5712 24.166 26.5712 20.2993V8.69935C26.5833 4.83268 24.1667 2.41602 20.3 2.41602Z" fill="#252530"/>
                    <path d="M5.51023 13.5937L8.01148 11.0925C8.19273 10.9112 8.27732 10.6816 8.27732 10.4521C8.27732 10.2225 8.19273 9.98081 8.01148 9.81164C7.66107 9.46122 7.08107 9.46122 6.73065 9.81164L2.68273 13.8596C2.33232 14.21 2.33232 14.79 2.68273 15.1404L6.73065 19.1883C7.08107 19.5387 7.66107 19.5387 8.01148 19.1883C8.3619 18.8379 8.3619 18.2579 8.01148 17.9075L5.51023 15.4062H10.8752V13.5937H5.51023Z" fill="#252530"/>
                </svg>
                <span className="text-light-brown font-semibold">Log Out</span>
            </button>
        </aside>
    </Fragment>
}

export default Sidebar;