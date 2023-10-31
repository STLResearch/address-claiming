import Image from "next/image";
import { createPortal } from "react-dom";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Web3Auth } from "@web3auth/modal";
import swal from "sweetalert";
import Script from "next/script";

import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import Backdrop from "@/Components/Backdrop";
import PilotProfileModal from "@/Components/Modals/PilotProfileModal";
import AddPilotModal from "@/Components/Modals/AddPilotModal";
import Spinner from "@/Components/Spinner";

const UAVs = (props) => {
    const { users } = props;
    const router = useRouter();

    const [pilotProfile, setPilotProfile] = useState(false);
    const [addPilot, setAddPilot] = useState(false);

    const [user, setUser] = useState();
    const [token, setToken] = useState("");

    useEffect(() => {
        if(users) {
            const authUser = async() => {
                const chainConfig = {
                    chainNamespace: "solana",
                    chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                    rpcTarget: "https://api.testnet.solana.com",
                    displayName: "Solana Mainnet",
                    blockExplorer: "https://explorer.solana.com",
                    ticker: "SOL",
                    tickerName: "Solana",
                };

                const web3auth = new Web3Auth({
                        // For Production
                        // clientId: "",
                        clientId: process.env.NEXT_PUBLIC_PROD_CLIENT_ID,
                
                        // For Development
                        // clientId: process.env.NEXT_PUBLIC_DEV_CLIENT_ID,
                        web3AuthNetwork: "cyan",
                        chainConfig: chainConfig,
                    });
            
                await web3auth.initModal();

                // await web3auth.connect();
                
                let userInfo;

                try{
                    userInfo = await web3auth.getUserInfo();
                } catch(err) {
                    localStorage.removeItem("openlogin_store")
                    swal({
                        title: "oops!",
                        text: "Something went wrong. Kindly try again",
                      })
                      .then(() => router.push("/auth/join"))
                    return;
                }

                const fetchedToken = JSON.parse(localStorage.getItem("openlogin_store"));
            
                const singleUser = users.filter(user => user.email === userInfo.email);

                if(singleUser.length < 1){
                    localStorage.removeItem("openlogin_store")
                    router.push("/auth/join");
                    return;
                };

                setToken(fetchedToken.sessionId);  
                setUser(singleUser[0]);
            } 

            authUser();
        }
    }, []);

    const backdropCloseHandler = () => {
        setPilotProfile(false);
        setAddPilot(false);
    }

    const showPilotModalHandler = () => {
        setPilotProfile(true);
    }

    const addPilotHandler = () => {
        setAddPilot(true);
    }

    const closeModalHandler = () => {
        setPilotProfile(false);
        setAddPilot(false);
    }

    if(!user || !token) {
        return <Spinner />
    } 

    return <Fragment>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C0J4J56QW5" />
        <Script id="google-analytics">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', 'G-C0J4J56QW5');
            `}
        </Script>
        {(pilotProfile || addPilot) && createPortal(<Backdrop onClick={backdropCloseHandler} />, document.getElementById("backdrop-root"))}
        {pilotProfile && createPortal(<PilotProfileModal onClose={closeModalHandler} />, document.getElementById("modal-root"))}
        {addPilot && createPortal(<AddPilotModal onClose={closeModalHandler} />, document.getElementById("modal-root"))}
        <div className="flex flex-row mx-auto">
            <Sidebar users={users} />
            <div style={{width: "calc(100vw - 257px)", height: "100vh"}} className="overflow-y-auto">
                <Navbar />
                <div className="bg-white py-11 px-10 overflow-y-auto" style={{height: "100vh", borderTop: "2px solid #F0F0FA"}}>
                    <div className="mx-auto flex flex-col items-center">
                        <h3 className="font-semibold text-dark-brown text-lg">Our Pilots</h3> 
                        <p className="text-dark-brown text-sml">Our Pilots  are certified professionals with over 100 hours of flight time</p>
                        <button onClick={addPilotHandler} className="bg-dark-blue rounded-md text-sml font-normal text-white my-5 transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width: "104px", height: "40px"}}>Add Pilot</button>
                    </div>
                    <div className="grid lg:grid-cols-3 2xl:grid-cols-4 gap-y-5">
                        <div className="rounded pt-5 flex flex-col items-center text-center bg-bleach-blue-100" style={{width: "260px", height: "324px",}}>
                            <Image src="/images/Ellipse.png" alt="a picture of a pilot" width={123} height={123} />
                            <p className="font-medium text-dark-brown mt-3">Eleanor Pena</p>
                            <p className="text-dark-brown text-sml">156hrs Flight time</p>
                            <p className="text-dark-brown font-medium text-sml mt-2">3891 Ranchview Dr. Richardson, California 62639</p>
                            <button onClick={showPilotModalHandler} className="bg-dark-blue rounded-md text-sml font-normal text-white mt-2.5 transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width: "120px", height: "40px"}}>Select</button>
                        </div> 
                        <div className="rounded pt-5 flex flex-col items-center text-center bg-bleach-blue-100" style={{width: "260px", height: "324px"}}>
                            <Image src="/images/Ellipse.png" alt="a picture of a pilot" width={123} height={123} />
                            <p className="font-medium text-dark-brown mt-3">Eleanor Pena</p>
                            <p className="text-dark-brown text-sml">156hrs Flight time</p>
                            <p className="text-dark-brown font-medium text-sml mt-2">3891 Ranchview Dr. Richardson, California 62639</p>
                            <button onClick={showPilotModalHandler} className="bg-dark-blue rounded-md text-sml font-normal text-white mt-2.5 transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width: "120px", height: "40px"}}>Select</button>
                        </div> 
                        <div className="rounded pt-5 flex flex-col items-center text-center bg-bleach-blue-100" style={{width: "260px", height: "324px"}}>
                            <Image src="/images/Ellipse.png" alt="a picture of a pilot" width={123} height={123} />
                            <p className="font-medium text-dark-brown mt-3">Eleanor Pena</p>
                            <p className="text-dark-brown text-sml">156hrs Flight time</p>
                            <p className="text-dark-brown font-medium text-sml mt-2">3891 Ranchview Dr. Richardson, California 62639</p>
                            <button onClick={showPilotModalHandler} className="bg-dark-blue rounded-md text-sml font-normal text-white mt-2.5 transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width: "120px", height: "40px"}}>Select</button>
                        </div> 
                        <div className="rounded pt-5 flex flex-col items-center text-center bg-bleach-blue-100" style={{width: "260px", height: "324px"}}>
                            <Image src="/images/Ellipse.png" alt="a picture of a pilot" width={123} height={123} />
                            <p className="font-medium text-dark-brown mt-3">Eleanor Pena</p>
                            <p className="text-dark-brown text-sml">156hrs Flight time</p>
                            <p className="text-dark-brown font-medium text-sml mt-2">3891 Ranchview Dr. Richardson, California 62639</p>
                            <button onClick={showPilotModalHandler} className="bg-dark-blue rounded-md text-sml font-normal text-white mt-2.5 transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width: "120px", height: "40px"}}>Select</button>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
}

export default UAVs;

export async function getServerSideProps() {
    try{
        // const response = await fetch("http://localhost:3000/api/proxy", {
        const response = await fetch(`https://main.d3a3mji6a9sbq0.amplifyapp.com/api/proxy?${Date.now()}`, {
            headers: {
                "Content-Type": "application/json",
                uri: "/users",
                // proxy_to_method: "GET",
            }
        })

        if(!response.ok) {
            throw new Error()
        }
        
        const data = await response.json();

        return {
            props: {
                users: JSON.parse(JSON.stringify(data))
            }
        }
    }
    catch(err) {
        return {
                props: { 
                    error: "oops! something went wrong. Kindly try again."
                }
            }
    }
}