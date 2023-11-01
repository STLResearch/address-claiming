import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import map from "../../../../public/images/map-bg.png";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import User from "@/models/User";


const ScheduleFlight = (props) => {
    const { users } = props;
    const router = useRouter();

    const [user, setUser] = useState();
    const [token, setToken] = useState("");

    useEffect(() => {
        const fetchedEmail = localStorage.getItem("email");
        const fetchedToken = JSON.parse(localStorage.getItem("openlogin_store"));

        if(!fetchedEmail || fetchedToken.sessionId.length !== 64){
            router.push("/auth/join");
            return;
        };

        setToken(fetchedToken.sessionId);

        const singleUser = users.filter(user => user.email === fetchedEmail);
        setUser(singleUser[0]);
    }, []);

    if(!user || !token) {
        return <Spinner />
    } 

    return <div className="flex flex-row w-screen">
        <Sidebar />
        <div style={{width: "calc(100vw - 257px)", height: "100vh"}} className="overflow-y-auto">
            <Navbar name={user.name} />
            <div style={{height: "calc(100vh - 91px)"}}>
                <Image src={map} alt="a map" style={{height: "50%"}} className="w-full max-w-6xl object-cover" />
                <div style={{height: "50%"}} className="relative w-full max-w-6xl mx-auto">
                    <div style={{borderRadius: "135px 135px 0px 0px"}} className="absolute pt-2 bottom-9 z-10 h-full text-center text-white bg-dark-blue w-full">
                        <p>Schedule Flight</p>
                    </div>
                    <div style={{height: "98%", borderRadius: "60px 60px 0px 0px"}} className="absolute z-20 bottom-0 bg-white w-full overflow-y-auto">
                        <form className="mx-auto z-20 w-10/12">
                            <div className="relative flex flex-row gap-2 items-end">
                                <div className="mb-2.5 mt-5" style={{width: "50%", maxWidth: "483px"}}>
                                    <label htmlFor="address" className="text-dark-brown">Address</label> <br />
                                    <input type="text" style={{height: "37px", width: "100%", maxWidth: "483px", border: "0.35px solid #0653EA"}} className="rounded ps-5 placeholder:text-dark-brown" placeholder="Pick Up" name="address" id="address" />
                                </div>
                                <div className="flex flex-row mb-2.5 mt-5">
                                    <div style={{width: "130px"}}>Distance</div>
                                    <div style={{width: "130px"}} className="ps-2">ETA</div>
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-row items-center gap-2 mb-2.5">
                                    <input type="text" style={{height: "37px", width: "50%", maxWidth: "483px", border: "0.35px solid #0653EA"}} className="rounded ps-5 placeholder:text-dark-brown" placeholder="Add Stop" name="address" id="address" />
                                    <input type="text" style={{height: "37px", width: "15%", maxWidth: "130px", border: "0.35px solid #0653EA"}} disabled className="rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue" defaultValue="0.00 km" name="address" id="address" />
                                    <input type="text" style={{height: "37px", width: "15%", maxWidth: "130px", border: "0.35px solid #0653EA"}} disabled className="rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue" defaultValue="0 mins" name="address" id="address" />
                                    <button className="cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                            <path d="M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z" stroke="#6F6D80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.16992 13.8299L13.8299 8.16992" stroke="#6F6D80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M13.8299 13.8299L8.16992 8.16992" stroke="#6F6D80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <input type="text" style={{height: "37px", width: "50%", maxWidth: "483px", border: "0.35px solid #0653EA"}} className="rounded ps-5 placeholder:text-dark-brown" placeholder="Add Stop" name="address" id="address" />
                                    <input type="text" style={{height: "37px", width: "15%", maxWidth: "130px", border: "0.35px solid #0653EA"}} disabled className="rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue" defaultValue="0.00 km" name="address" id="address" />
                                    <input type="text" style={{height: "37px", width: "15%", maxWidth: "130px", border: "0.35px solid #0653EA"}} disabled className="rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue" defaultValue="0 mins" name="address" id="address" />
                                    <button className="bg-dark-blue rounded-md text-white text-sml transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width: "10%", height: "40px"}}>Add Stop</button>
                                </div>
                            </div>
                            <div style={{width: "354px"}} className="mx-auto mt-12">
                                <p className="text-dark-brown font-semibold ms-4">Overview</p>
                                <hr className="bg-dark-blue" />
                                <div className="mx-auto w-10/12">
                                    <div className="mb-2.5 mt-5 flex flex-row gap-5 items-center justify-between">
                                        <label htmlFor="distance" className="text-dark-brown">Total Distance</label>
                                        <input type="text"  defaultValue="0.00 km" name="distance" id="distance" style={{height: "37px", width: "133px", border: "0.35px solid #0653EA"}} disabled className="rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue" />
                                    </div>
                                    <div className="mb-2.5 mt-5 flex flex-row gap-5 items-center justify-between">
                                        <label htmlFor="arrival time" className="text-dark-brown ps-0">ETA</label>
                                        <input type="text"  defaultValue="0 mins" name="arrival time" id="arrival time" style={{height: "37px", width: "133px", border: "0.35px solid #0653EA"}} disabled className="rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue" />
                                    </div>
                                    <div className="mb-2.5 mt-5 flex flex-row gap-5 items-center justify-between">
                                        <label htmlFor="cost" className="text-dark-brown">Cost</label>
                                        <input type="text"  defaultValue="$ 0.00" name="cost" id="cost" style={{height: "37px", width: "133px", border: "0.35px solid #0653EA"}} disabled className="rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue" />
                                    </div>
                                </div>
                                <div className="flex flex-row justify-center mt-5 mb-8">
                                    <button className="bg-dark-blue mx-auto rounded-md text-white text-sml transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width:"310px", height: "40px"}}>Schedule</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default ScheduleFlight;


export async function getServerSideProps() {
    const { slug } = context.query;

    return {
        props: {
        slug,
        },
    };
}
