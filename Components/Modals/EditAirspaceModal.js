import { counterActions } from "@/store/store";
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import moment from "moment-timezone";
import swal from "sweetalert";
import { Web3Auth } from "@web3auth/modal";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import base58 from "bs58";

import TimeSelect from "../TimeSelect";
import Spinner from "../Spinner";
import Backdrop from "../Backdrop";
import TimezoneSelectComponent from "../Timezone";

const EditAispaceModal = (props) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [costChecked, setCostChecked] = useState(props.variable);
    const [deckChecked, setDeckChecked] = useState(props.deck);
    const [stationChecked, setStationChecked] = useState(props.station);
    const [storageChecked, setStorageChecked] = useState(props.storage);

    const [negotiable, setNegotiable] = useState(false);
    const [deck, setDeck] = useState("");
    // const [station, setStation] = useState("");
    const [storage, setStorage] = useState("");
    const [rentAirspace, setRentAirspace] = useState("");
    const [sellAirspace, setSellAirspace] = useState("");
    const [airspaceStatus, setAirspaceStatus] = useState(props.status)
    const [monAvailable, setMonAvailable] = useState(props.weeks[0].isAvailable);
    const [tueAvailable, setTueAvailable] = useState(props.weeks[1].isAvailable);
    const [wedAvailable, setWedAvailable] = useState(props.weeks[2].isAvailable);
    const [thuAvailable, setThuAvailable] = useState(props.weeks[3].isAvailable);
    const [friAvailable, setFriAvailable] = useState(props.weeks[4].isAvailable);
    const [satAvailable, setSatAvailable] = useState(props.weeks[5].isAvailable);
    const [sunAvailable, setSunAvailable] = useState(props.weeks[6].isAvailable);
    const [fromMonday, setFromMonday] = useState(7);
    const [toMonday, setToMonday] = useState(22);
    const [fromTuesday, setFromTuesday] = useState(7);
    const [toTuesday, setToTuesday] = useState(22);
    const [fromWednesday, setFromWednesday] = useState(7);
    const [toWednesday, setToWednesday] = useState(22);
    const [fromThursday, setFromThursday] = useState(7);
    const [toThursday, setToThursday] = useState(22);
    const [fromFriday, setFromFriday] = useState(7);
    const [toFriday, setToFriday] = useState(22);
    const [fromSaturday, setFromSaturday] = useState(7);
    const [toSaturday, setToSaturday] = useState(22);
    const [fromSunday, setFromSunday] = useState(7);
    const [toSunday, setToSunday] = useState(22);
    const [timezone, setTimezone] = useState(props.timeZone);

    const airspaceTitleRef = useRef();
    

    const dispatch = useDispatch();

    

    const closeModalHandler = (e) => {
        e.preventDefault();
        dispatch(counterActions.closeAdditionalInfoModal());
    }

    const costCheckedHandler = (e) => {
        setCostChecked(!costChecked);
    }

    const deckCheckedHandler = (e) => {
        setDeckChecked(!deckChecked);

        if(!deckChecked) {
            setDeck("Landing Deck");
        } else {
            setDeck("");
        }
    }

    const stationHandler = (e) => {
        setStationChecked(!stationChecked);
    }

    const storageHandler = (e) => {
        setStorageChecked(!storageChecked);

        if(!storageChecked) {
            setStorage("Storage Hub");
        } else {
            setStorage("");
        }
    }

    const rentHandler = () => {
        setRentChecked(!rentChecked);
    }

    const sellHandler = () => {
        setSellChecked(!sellChecked);

        if(!sellChecked) {
            setSellAirspace("Sell AirSpace");
        } else {
            setSellAirspace("");
        }
    }


    const airspaceStatusHandler = (e) => {
        setAirspaceStatus(!airspaceStatus);
    }

    const formSubmitHandler = async(e) => {
        e.preventDefault();
        const airspaceTitle = airspaceTitleRef.current.value;

        const weekDayRanges = [
            {
                weekDayId: 0,
                fromTime: +fromMonday,
                toTime: +toMonday,
                isAvailable: (monAvailable && !airspaceStatus) ? true : false 
            },
            {
                weekDayId: 1,
                fromTime: +fromTuesday,
                toTime: +toTuesday,
                isAvailable: (tueAvailable && !airspaceStatus) ? true : false 
            },
            {
                weekDayId: 2,
                fromTime: +fromWednesday,
                toTime: +toWednesday,
                isAvailable: (wedAvailable && !airspaceStatus) ? true : false 
            },
            {
                weekDayId: 3,
                fromTime: +fromThursday,
                toTime: +toThursday,
                isAvailable: (thuAvailable && !airspaceStatus) ? true : false 
            },
            {
                weekDayId: 4,
                fromTime: +fromFriday,
                toTime: +toFriday,
                isAvailable: (friAvailable && !airspaceStatus) ? true : false 
            },
            {
                weekDayId: 5,
                fromTime: +fromSaturday,
                toTime: +toSaturday,
                isAvailable: (satAvailable && !airspaceStatus) ? true : false 
            },
            {
                weekDayId: 6,
                fromTime: +fromSunday,
                toTime: +toSunday,
                isAvailable: (sunAvailable && !airspaceStatus) ? true : false 
            },
        ]

        setIsLoading(true);

        const signatureObj = {};

        // const retrievedObj = JSON.parse(localStorage.getItem("signature"));
        
       

        // if(retrievedObj && retrievedObj.sign_issue_at) {
        //     console.log(retrievedObj)
        //     const issuedAt = new Date(retrievedObj.sign_issue_at);
        //     const issuedTime = Math.floor(issuedAt.getTime() / 1000);
        //     console.log(issuedAt);
        //     console.log(issuedTime);
        //     console.log(retrievedObj.sign_issue_at);
        //     const currentTimestampInSeconds = Math.floor(new Date().getTime() / 1000);
        //     const timeDifference = currentTimestampInSeconds - issuedTime;
        //     console.log("This is the time difference", timeDifference);

        //     if(timeDifference > 300) {
        //         console.log("The time has expired")
        //         const chainConfig = {
        //             chainNamespace: "solana",
        //             chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
        //             rpcTarget: "https://api.testnet.solana.com",
        //             displayName: "Solana Mainnet",
        //             blockExplorer: "https://explorer.solana.com",
        //             ticker: "SOL",
        //             tickerName: "Solana",
        //         };
        
        //         const web3auth = new Web3Auth({
        //                 // For Production
        //                 // clientId: "",
        //                 clientId: process.env.NEXT_PUBLIC_PROD_CLIENT_ID,
                
        //                 // For Development
        //                 // clientId: process.env.NEXT_PUBLIC_DEV_CLIENT_ID,
        //                 web3AuthNetwork: "cyan",
        //                 chainConfig: chainConfig,
        //             });
                
        //         await web3auth.initModal();
        
        //         const web3authProvider = await web3auth.connect();
        
        //         const solanaWallet = new SolanaWallet(web3authProvider);
        
            
        
        //         const userInfo = await web3auth.getUserInfo();
        //         console.log(userInfo);
            
        //         // const domain = window.location.host;
        //         const domain = 'localhost:3000';
        //         // const origin = window.location.origin;
        //         const origin = 'http://localhost:3000';
        
        //         console.log("domain", domain);
        //         console.log("origin", origin);
        
        
        //         const payload = new SIWPayload();
        //         payload.domain = domain;
        //         payload.uri = origin;
        //         payload.address = props.user.blockchainAddress
        //         payload.statement = "Sign in with Solana to the app.";
        //         payload.version = "1";
        //         payload.chainId = 1;
        
        //         const header = { t: "sip99" };
        //         const network = "solana";
        
        //         console.log(JSON.stringify(payload));
        
        //         let message = new SIWWeb3({ header, payload, network });
        //         console.log(message)
        
        //         const messageText = message.prepareMessage();
        //         console.log(messageText);
        //         const msg = new TextEncoder().encode(messageText);
        //         const result = await solanaWallet.signMessage(msg);
        
        //         const signature = base58.encode(result);
        //         console.log("This is the signature", signature);
        
        //         signatureObj.sign = signature
        //         signatureObj.sign_nonce = message.payload.nonce
        //         signatureObj.sign_issue_at = message.payload.issuedAt
        //         signatureObj.sign_address = props.user.blockchainAddress
        
        //         localStorage.setItem("signature", JSON.stringify({
        //             sign: signature,
        //             "sign_issue_at": message.payload.issuedAt,
        //             "sign_nonce": message.payload.nonce,
        //             "sign_address": props.user.blockchainAddress,
        //         }));
        //     } else {
        //         console.log("I retrieved a valid sigature and used it");
        //         signatureObj.sign = retrievedObj.sign
        //         signatureObj.sign_nonce = retrievedObj.sign_nonce
        //         signatureObj.sign_issue_at = retrievedObj.sign_issue_at
        //         signatureObj.sign_address = retrievedObj.sign_address
        //     }
        // } else {
        //     console.log("I didn't find any signature");
        //     const chainConfig = {
        //         chainNamespace: "solana",
        //         chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
        //         rpcTarget: "https://api.testnet.solana.com",
        //         displayName: "Solana Mainnet",
        //         blockExplorer: "https://explorer.solana.com",
        //         ticker: "SOL",
        //         tickerName: "Solana",
        //     };
    
        //     const web3auth = new Web3Auth({
        //             // For Production
        //             // clientId: "",
        //             clientId: process.env.NEXT_PUBLIC_PROD_CLIENT_ID,
            
        //             // For Development
        //             // clientId: process.env.NEXT_PUBLIC_DEV_CLIENT_ID,
        //             web3AuthNetwork: "cyan",
        //             chainConfig: chainConfig,
        //         });
            
        //     await web3auth.initModal();
    
        //     const web3authProvider = await web3auth.connect();
    
        //     const solanaWallet = new SolanaWallet(web3authProvider); 
    
        
    
        //     const userInfo = await web3auth.getUserInfo();
        //     console.log(userInfo);
        
        //     // const domain = window.location.host;
        //     const domain = 'localhost:3000';
        //     // const origin = window.location.origin;
        //     const origin = 'http://localhost:3000';
    
        //     console.log("domain", domain);
        //     console.log("origin", origin);
    
    
        //     const payload = new SIWPayload();
        //     payload.domain = domain;
        //     payload.uri = origin;
        //     payload.address = props.user.blockchainAddress
        //     payload.statement = "Sign in with Solana to the app.";
        //     payload.version = "1";
        //     payload.chainId = 1;
    
        //     const header = { t: "sip99" };
        //     const network = "solana";
    
    
        //     let message = new SIWWeb3({ header, payload, network });
    
        //     const messageText = message.prepareMessage();
        //     const msg = new TextEncoder().encode(messageText);
        //     const result = await solanaWallet.signMessage(msg);
    
        //     const signature = base58.encode(result);
    
        //     signatureObj.sign = signature
        //     signatureObj.sign_nonce = message.payload.nonce
        //     signatureObj.sign_issue_at = message.payload.issuedAt
        //     signatureObj.sign_address = props.user.blockchainAddress
    
        //     localStorage.setItem("signature", JSON.stringify({
        //         sign: signature,
        //         "sign_issue_at": message.payload.issuedAt,
        //         "sign_nonce": message.payload.nonce,
        //         "sign_address": props.user.blockchainAddress,
        //     }));
        // };



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

        const web3authProvider = await web3auth.connect();

        const solanaWallet = new SolanaWallet(web3authProvider); 

    

        // const userInfo = await web3auth.getUserInfo();
    
        const domain = window.location.host;
        // const domain = 'localhost:3000';
        const origin = window.location.origin;
        // const origin = 'http://localhost:3000';


        const payload = new SIWPayload();
        payload.domain = domain;
        payload.uri = origin;
        payload.address = props.user.blockchainAddress
        payload.statement = "Sign in with Solana to the app.";
        payload.version = "1";
        payload.chainId = 1;

        const header = { t: "sip99" };
        const network = "solana";


        let message = new SIWWeb3({ header, payload, network });

        const messageText = message.prepareMessage();
        const msg = new TextEncoder().encode(messageText);
        const result = await solanaWallet.signMessage(msg);

        const signature = base58.encode(result);

        signatureObj.sign = signature
        signatureObj.sign_nonce = message.payload.nonce
        signatureObj.sign_issue_at = message.payload.issuedAt
        signatureObj.sign_address = props.user.blockchainAddress


        const airspaceInformation = {
            ownerId: props.user.id,
            propertyId: props.id,
            title: airspaceTitle,
            transitFee: "$0.01 - $99.00",
            hasStorageHub: storageChecked,
            hasLandingDeck: deckChecked,
            hasChargingStation: stationChecked,
            isFixedTransitFee: costChecked,
            noFlyZone: !airspaceStatus ? false : true,
            weekDayRanges,
            timezone: !airspaceStatus ? timezone : "GMT"
        }

        

        fetch(`/api/proxy?${Date.now()}`, {
            method: "PATCH",
            body: JSON.stringify(airspaceInformation),
            headers: {
                "Content-Type": "application/json",
                URI: "/properties/update",
                // proxy_to_method: "POST",
                sign: signatureObj.sign,
                time:  signatureObj.sign_issue_at,
                nonce: signatureObj.sign_nonce,
                address: signatureObj.sign_address,
            }
        })
        .then(res => {
            if(!res.ok || res.statusCode === 500) {
                return res.json()
                .then((err) => {
                    console.log(err)
                    throw new Error(err.errorMessage);
                })
            }
            return res.json()
            .then(response => {
                if(response.statusCode === 500) {
                    throw new Error("something went wrong");
                };
                swal({
                    title: "Submitted",
                    text: "Airspace record updated successfully",
                    icon: "success",
                    button: "Ok"
                  }).then(() => {
                    // dispatch(counterActions.closeAdditionalInfoModal());
                    // props.onClose()
                    setIsLoading(false);
                    router.push("/homepage/dashboard")
                  })
            })
        })
        .catch(error => {
            console.log(error)
            const err = error.toString().split(":");
            setIsLoading(false)
            swal({
                title: "Oops!",
                // text: "something went wrong. kindly try again",
                text: err[1] || "Something went wrong. Kindly try again"
              })    
        })
    }

    return <Fragment>
        {/* {isLoading && createPortal(<Backdrop />, document.getElementById("backdrop-root"))}
        {isLoading && createPortal(<Spinner />, document.getElementById("backdrop-root"))} */}
        <div className="bg-white rounded fixed z-20 py-10 overflow-y-auto" style={{width: "740px", height: "90vh", maxHeight: "908px", 
            top: "7vh", // This is for live environment
            left: "calc(50% - 370px)", 
            }}>
            <button onClick={props.onClose} className="absolute top-3 right-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path d="M12.7279 12.7285L21.2132 21.2138" stroke="#252530" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.7279 21.2138L21.2132 12.7285" stroke="#252530" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <h3 className="text-center font-semibold pt-6">AirSpace Details</h3>
            <form className="px-10">
                <div className="px-14 pb-5 flex flex-row items-center justify-between gap-8">
                    <div style={{width: "114px"}} className="mt-9">
                        <p className="font-medium">Title</p>
                        <p className="text-xs">Give a unique name to the AirSpace for easy identification</p>
                    </div>
                    <input ref={airspaceTitleRef} defaultValue={props.title} type="text" placeholder="AirSpace Title" style={{width: "383px", height: "27px"}} className="bg-light-blue focus:outline-blue-200 ps-2 placeholder:text-sml placeholder:text-light-brown rounded-sm" name="AirSpace Title" />
                </div>
                <hr />
                {/* <div className="px-14 pb-5 pt-2 flex flex-row items-center justify-between gap-8">
                    <p htmlFor="AirSpace Title" className="font-medium me-10">Transit Fee</p>
                    <div className="flex flex-row justify-center items-center">
                        <input type="number" ref={costRef} defaultValue={props.fee} name="hour" min="1" placeholder="$ 10:00" style={{width: "143px", height: "27px"}} className="bg-light-blue ps-2 focus:outline-blue-200 placeholder:text-sml placeholder:text-light-brown rounded-sm" />
                        <label htmlFor="hour" className="text-dark-brown text-sml ms-2">$/per journey</label>
                    </div>
                    <div>
                        <div className="flex flex-row justify-center items-center gap-2">
                            <input type="checkbox" onChange={costCheckedHandler} checked={costChecked} value={negotiable} name="hour" min="1" style={{height: "27px"}} className="bg-light-blue ps-2 cursor-pointer placeholder:text-sml w-4 checked:bg-blue-500 rounded-sm" />
                            <label htmlFor="hour" onClick={costCheckedHandler} className="text-dark-brown text-sml cursor-pointer">Variable</label>
                        </div>
                        <div style={{width: "110px"}}>
                            <p className="text-xs ps-4">Select if your cost can be negotiated</p>
                        </div>
                    </div>
                </div> */}
                {/* <div>
                    <div className="flex flex-row gap-1 items-center">
                        {!airspaceStatus &&
                            <input name="monday" type="checkbox" onChange={costCheckedHandler} checked={costChecked} className="cursor-pointer" />}
                            <label htmlFor="AirSpace Title" onClick={costCheckedHandler} className="font-medium me-10 cursor-pointer">Variable Rental Range (per transit)</label>
                    </div>
                    <select disabled={airspaceStatus !== "Available" || !costChecked} className="bg-light-blue ps-2 placeholder:text-sml text-dark-brown text-sml placeholder:text-light-brown rounded-sm" style={{width: "180px", height: "27px"}}>
                        <option selected>$0.01 - $99.00</option>
                    </select>
                </div> */}

                <div className="px-14 pb-5 flex flex-row items-center pt-5 gap-8">
                    <div className="flex flex-row gap-1 items-center">
                        {!airspaceStatus &&
                            <input name="monday" type="checkbox" onChange={costCheckedHandler} checked={costChecked} className="cursor-pointer" />}
                            <label htmlFor="AirSpace Title" onClick={costCheckedHandler} className="font-medium me-10 cursor-pointer">Variable Rental Range (per transit)</label>
                    </div>
                    <select disabled={airspaceStatus || !costChecked} className="bg-light-blue ps-2 placeholder:text-sml text-dark-brown text-sml placeholder:text-light-brown rounded-sm" style={{width: "180px", height: "27px"}}>
                        <option selected>$0.01 - $99.00</option>
                    </select>
                </div>

                

                <hr />
                <div className="px-14 pb-5 pt-3 flex flex-row items-center justify-start gap-3">
                    <div style={{width: "147px"}} className="">
                        <p className="font-medium">Facilities</p>
                        <p className="text-xs">Select the extra features your facility provides</p>
                    </div>
                    <div className="ps-1">
                        <div className="flex flex-row justify-start items-center gap-2">
                            <input type="checkbox" onChange={deckCheckedHandler} checked={deckChecked} value={deck} name="hour" min="1" style={{height: "27px"}} className="bg-light-blue ps-2 cursor-pointer w-4 checked:bg-blue-500 rounded-sm" />
                            <label htmlFor="hour" onClick={deckCheckedHandler} className="text-dark-brown cursor-pointer text-sml">Landing Deck</label>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-2">
                            <input type="checkbox" onChange={stationHandler} checked={stationChecked} name="hour" min="1" style={{height: "27px"}} className="bg-light-blue ps-2 cursor-pointer w-4 checked:bg-blue-500 rounded-sm" />
                            <label htmlFor="hour" onClick={stationHandler} className="text-dark-brown text-sml cursor-pointer">Charging station</label>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-2">
                            <input type="checkbox" onChange={storageHandler} checked={storageChecked} value={storage} name="hour" min="1" style={{height: "27px"}} className="bg-light-blue ps-2 cursor-pointer w-4 checked:bg-blue-500 rounded-sm" />
                            <label htmlFor="hour" onClick={storageHandler} className="text-dark-brown text-sml cursor-pointer">Storage Hub</label>
                        </div>
                    </div>
                </div>
                <hr />

                <div className="px-14 pb-2 pt-3 flex flex-row items-start gap-36">
                    <div>
                        <div style={{width: "138px"}} className="">
                            <p className="font-medium">Status</p>
                            <p className="text-xs">Give your AirSpace a Status</p>
                            <select onChange={airspaceStatusHandler} className="bg-light-blue mt-2 ps-2 placeholder:text-sml text-dark-brown text-sml placeholder:text-light-brown rounded-sm" style={{width: "143px", height: "27px"}}>
                                <option  disabled>Status</option>
                                <option selected={!airspaceStatus}>Available</option>
                                <option selected={airspaceStatus}>No-fly zone</option>
                            </select> 
                        </div>
                        {/* <div className="flex flex-row justify-center mt-10 -ms-14 items-center"> */}
                        <div style={{width: "138px"}} className="mt-10">
                            <TimezoneSelectComponent onChange={(e) => {
                                        setTimezone(e.target.value)
                                    }} 
                                    timeZone={props.timeZone}
                                    timezone={timezone}
                                    disable={airspaceStatus} />
                        </div>   
                    </div>  
                    {!airspaceStatus &&    
                        <div>
                            <div className="flex flex-row justify-between mb-1 items-center gap-2">
                                <div className="flex flex-row gap-1">
                                    {!airspaceStatus && <input name="monday" checked={monAvailable} onChange={() => setMonAvailable(!monAvailable)} type="checkbox" className="cursor-pointer" />}
                                    <label htmlFor="monday" className="text-sml cursor-pointer"  onClick={() => setMonAvailable(!monAvailable)}>Mon</label>
                                </div>
                                <TimeSelect disable={airspaceStatus || !monAvailable} 
                                        timeSelect={!airspaceStatus && monAvailable && props.weeks[0].fromTime}
                                        toTimeSelect={!airspaceStatus && monAvailable && props.weeks[0].toTime}
                                        fromChange={(value) => {
                                        setFromMonday(value)
                                        }} toChange={(value) => {
                                            setToMonday(value)
                                        }} /> 
                            </div>
                            <div className="flex flex-row justify-between mb-1 items-center gap-2">
                                <div className="flex flex-row gap-1">
                                    {!airspaceStatus && <input name="tuesday" checked={tueAvailable} onChange={() => setTueAvailable(!tueAvailable)} type="checkbox" className="cursor-pointer" />}
                                    <label htmlFor="tuesday" onClick={() => setTueAvailable(!tueAvailable)} className="text-sml cursor-pointer">Tue</label>
                                </div>
                                <TimeSelect disable={airspaceStatus || !tueAvailable} 
                                    timeSelect={!airspaceStatus && tueAvailable && props.weeks[1].fromTime} 
                                    toTimeSelect={!airspaceStatus && tueAvailable && props.weeks[1].toTime} 
                                    fromChange={(value) => {
                                    setFromTuesday(value)
                                }} toChange={(value) => {
                                    setToTuesday(value)
                                }} />
                            </div>
                            <div className="flex flex-row justify-between mb-1 items-center gap-2">
                                <div className="flex flex-row gap-1">
                                    {!airspaceStatus && <input checked={wedAvailable} onChange={() => setWedAvailable(!wedAvailable)} name="wednesday" type="checkbox" className="cursor-pointer" />}
                                    <label htmlFor="wednesday" onClick={() => setWedAvailable(!wedAvailable)} className="text-sml cursor-pointer">Wed</label>
                                </div>
                                <TimeSelect disable={airspaceStatus || !wedAvailable} 
                                    timeSelect={!airspaceStatus && wedAvailable && props.weeks[2].fromTime} 
                                    toTimeSelect={!airspaceStatus && wedAvailable && props.weeks[2].toTime}
                                    fromChange={(value) => {
                                        setFromWednesday(value)
                                    }} toChange={(value) => {
                                        setToWednesday(value)
                                    }} />
                            </div>
                            <div className="flex flex-row justify-between mb-1 items-center gap-2">
                                <div className="flex flex-row gap-1">
                                    {!airspaceStatus && <input name="thursday" checked={thuAvailable} onChange={() => setThuAvailable(!thuAvailable)} type="checkbox" className="cursor-pointer" />}
                                    <label htmlFor="thursday" className="text-sml cursor-pointer" onClick={() => setThuAvailable(!thuAvailable)}>Thu</label>
                                </div>
                                <TimeSelect disable={airspaceStatus || !thuAvailable}  
                                    timeSelect={!airspaceStatus && thuAvailable && props.weeks[3].fromTime} 
                                    toTimeSelect={!airspaceStatus && thuAvailable && props.weeks[3].toTime}
                                    fromChange={(value) => {
                                        setFromThursday(value)
                                    }} toChange={(value) => {
                                        setToThursday(value)
                                    }} />
                            </div>
                            <div className="flex flex-row justify-between mb-1 items-center gap-2">
                                <div className="flex flex-row gap-1">
                                    {!airspaceStatus && <input checked={friAvailable} name="friday" onChange={() => setFriAvailable(!friAvailable)} type="checkbox" className="cursor-pointer" />}
                                    <label className="text-sml cursor-pointer" htmlFor="friday" onClick={() => setFriAvailable(!friAvailable)}>Fri</label>
                                </div>
                                <TimeSelect  disable={airspaceStatus || !friAvailable}  
                                    timeSelect={!airspaceStatus && friAvailable && props.weeks[4].fromTime} 
                                    toTimeSelect={!airspaceStatus && friAvailable && props.weeks[4].toTime}
                                    fromChange={(value) => {
                                        setFromFriday(value)
                                    }} toChange={(value) => {
                                        setToFriday(value)
                                    }} />
                            </div>
                            <div className="flex flex-row justify-between mb-1 items-center gap-2">
                                <div className="flex flex-row gap-1">
                                    {!airspaceStatus && <input name="saturday" checked={satAvailable} onChange={() => setSatAvailable(!satAvailable)} type="checkbox" className="cursor-pointer" />}
                                    <label htmlFor="saturday" onClick={() => setSatAvailable(!satAvailable)} className="text-sml cursor-pointer">Sat</label>
                                </div>
                                <TimeSelect  disable={airspaceStatus || !satAvailable}  
                                    timeSelect={!airspaceStatus && satAvailable && props.weeks[5].fromTime} 
                                    toTimeSelect={!airspaceStatus && satAvailable && props.weeks[5].toTime}
                                    fromChange={(value) => {
                                        setFromSaturday(value)
                                    }} toChange={(value) => {
                                        setToSaturday(value)
                                    }}/>
                            </div>
                            <div className="flex flex-row justify-between mb-1 items-center gap-2">
                                <div className="flex flex-row gap-1">
                                    {!airspaceStatus && <input checked={sunAvailable} name="sunday" onChange={() => setSunAvailable(!sunAvailable)} type="checkbox" className="cursor-pointer" />}
                                    <label htmlFor="sunday" onClick={() => setSunAvailable(!sunAvailable)} className="text-sml cursor-pointer">Sun</label>
                                </div>
                                <TimeSelect disable={airspaceStatus || !sunAvailable}  
                                    timeSelect={!airspaceStatus && sunAvailable && props.weeks[6].fromTime} 
                                    toTimeSelect={!airspaceStatus && sunAvailable && props.weeks[6].toTime}
                                    fromChange={(value) => {
                                        setFromSunday(value)
                                    }} toChange={(value) => {
                                        setToSunday(value)
                                    }} />
                            </div>
                        </div>
                    }
                </div>
                {/* <hr /> */}
                {/* <div className="px-14 pb-5 pt-2 flex flex-row items-center justify-start gap-8">
                    <div style={{width: "138px"}} className="">
                        <p className="font-medium">Restrictions</p>
                        <p className="text-xs">Restriction on the AirSpace</p>
                    </div>
                    <div className="flex flex-row justify-center -ms-2 items-center gap-2">
                        <input type="number" ref={restrictionRef} name="hour" min="1" placeholder="20" style={{width: "62px", height: "27px"}} className="bg-light-blue ps-2 placeholder:text-sml focus:outline-blue-200 placeholder:text-light-brown rounded-sm" />
                        <label htmlFor="hour" className="text-dark-brown text-sml">metre landing radius</label>
                    </div>
                </div> */}
                {/* <hr /> */}
                {/* <div className="px-14 pb-5 pt-3 flex flex-row items-center justify-start gap-3">
                    <div style={{width: "147px"}} className="">
                        <p className="font-medium">Offers</p>
                        <p className="text-xs">Select offers on AirSpace</p>
                    </div>
                    <div className="ps-1">
                        <div className="flex flex-row justify-start items-center gap-2">
                            <input type="checkbox" onChange={rentHandler} checked={airspaceStatus === "Available" && rentChecked} disabled={airspaceStatus !== "Available"} value={rentAirspace} name="rent airspace" min="1" style={{height: "27px"}} className="bg-light-blue ps-2 cursor-pointer w-4 checked:bg-blue-500" />
                            <label htmlFor="hour" onClick={rentHandler} className="text-dark-brown text-sml cursor-pointer">Rent AirSpace</label>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-2">
                            <input type="checkbox" onChange={sellHandler} checked={sellChecked} value={sellAirspace} name="sell airspace" min="1" style={{height: "27px"}} className="bg-light-blue ps-2 cursor-pointer w-4 checked:bg-blue-500" />
                            <label htmlFor="hour" onClick={sellHandler} className="text-dark-brown text-sml cursor-pointer">Sell AirSpace</label>
                        </div>
                    </div>
                </div> */}
                <div className="flex flex-row justify-center items-center mt-8 gap-5">
                    <button onClick={props.onClose} disabled={isLoading} className={`${isLoading ? "cursor-wait" : "cursor-pointer"} rounded-md text-dark-blue`} style={{border: "1px solid #0653EA", width: "120px", height: "40px"}}>Cancel</button>
                    <button onClick={formSubmitHandler} disabled={isLoading} className={`${isLoading ? "cursor-wait" : "cursor-pointer"} bg-dark-blue rounded-md text-white`} style={{width: "120px", height: "40px"}}>{isLoading ? "Submiting..." : "Submit"}</button>
                </div>
            </form>
        </div>
    </Fragment>
}

export default EditAispaceModal;