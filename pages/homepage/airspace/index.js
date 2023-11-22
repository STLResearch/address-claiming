import { Fragment, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import maplibregl from 'maplibre-gl';
import { Web3Auth } from "@web3auth/modal";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import base58 from "bs58";
import Script from "next/script";
import Image from "next/image";

import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import Backdrop from "@/Components/Backdrop";
import MyAirspaceOverview from "@/Components/MyAirspaces/MyAirspaceOverview";
import Airspaces from "@/Components/Airspaces";
import AddAirspace from "@/Components/Modals/AddAirspace";
import AdditionalAispaceInformation from "@/Components/Modals/AdditionalAirspaceInformation";
import { counterActions } from "@/store/store";
import Spinner from "@/Components/Spinner";
import MyAirspaceTab from "@/Components/MyAirspaceTab";
import EditAispaceModal from "@/Components/Modals/EditAirspaceModal";
import { useVerification } from "@/hooks/useVerification";
import CollapseAirspace from "@/Components/CollapseAirspace";


const Airspace = (props) => {
    const { users, error } = props;

    if(error) {
        swal({
            title: "Oops!",
            text: "Something went wrong. Kindly try again",
          });
    }

    const { verificationCheck } = useVerification();

    const router = useRouter();
    const dispatch = useDispatch();
    const locationiqKey = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;

    const [allAirspace, setAllAirSpace] = useState(false);
    const [myAirspace, setMyAirSpace] = useState(true);
    const [showAddReviewModal, setshowAddReviewModal] = useState(false);
    const [showAddAirspaceModal, setShowAddAirspaceModal] = useState(false);
    const [airspace, setAirspace] = useState("mine");
    const [myFilteredAirspace, setMyFilteredAirspace] = useState();
    const [flyToAddress, setFlyToAddress] = useState("");
    const [myAirspaces, setMyAirspaces] = useState();
    const [editAirspace, setEditAirspace] = useState();
    const [viewMyAirspace, setViewMyAirSpace] = useState(false);
    const [address, setAddress] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [showOptions, setShowOptions] = useState(true);
    const [longitude, setLongitude] = useState();
    const [latitude, setLatitude] = useState();
    const [addressData, setAddressData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [transition, setTransition] = useState(false);

    const [user, setUser] = useState();
    const [token, setToken] = useState("");


    useEffect(() => {
        if(users) {
            const authUser = async() => {
                const chainConfig = {
                    chainNamespace: "solana",
                    chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                    rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
                    displayName: "Solana Mainnet",
                    blockExplorer: "https://explorer.solana.com",
                    ticker: "SOL",
                    tickerName: "Solana",
                };

                const web3auth = new Web3Auth({
                        // For Production
                        clientId: process.env.NEXT_PUBLIC_PROD_CLIENT_ID,
                
                        // For Development
                        // clientId: process.env.NEXT_PUBLIC_DEV_CLIENT_ID,
                        web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
                        chainConfig: chainConfig,
                    });
            
                await web3auth.initModal();

                // await web3auth.connect();
                
                let userInfo;

                try{
                    userInfo = await web3auth.getUserInfo();
                } catch(err) {
                    // localStorage.removeItem("openlogin_store")
                    swal({
                        title: "Oops!",
                        text: "Something went wrong. Kindly try again",
                      })
                      .then(() => router.push("/auth/join"));
                    return;
                }

                const fetchedToken = JSON.parse(localStorage.getItem("openlogin_store"));
            
                const singleUser = users.filter(user => user.email === userInfo.email);

                if(singleUser.length < 1){
                    localStorage.removeItem("openlogin_store");
                    router.push("/auth/join");
                    return;
                };

                setToken(fetchedToken.sessionId);  
                setUser(singleUser[0]);
            } 

            authUser();
        }
    }, []);

    
    useEffect(() => {
        if(token && user) {
            const map = new maplibregl.Map({
                container: 'map',
                attributionControl: false, 
                style: 'https://tiles.locationiq.com/v3/streets/vector.json?key='+locationiqKey,
                zoom: 12,
                center: [-122.42, 37.779]
            });


            map.on('load', function () {
                map.addLayer({
                    'id': 'maine',
                    'type': 'fill',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Polygon',
                                'coordinates': []
                            }
                        }
                    },
                    'layout': {},
                    'paint': {
                        'fill-color': '#D20C0C',
                        }
                    });
                });  
        }
    }, [token, user]);

    useEffect(() => {
        if(flyToAddress) {
            setIsLoading(true);
            fetch(`https://us1.locationiq.com/v1/search?key=${locationiqKey}&q=${flyToAddress}&format=json&polygon_geojson=1`)
            .then(res => {
                if(!res.ok) {
                    return res.json()
                    .then(errorData => {
                        throw new Error(errorData.error);
                    });
                }
                return res.json()
            })
            .then(resData => {
                if(resData.error) {
                    console.log(resData.error);
                    return;
                }
                console.log("this is the full address info", resData);
                const endPoint = []
        
                endPoint.push(resData[0].lon);
                endPoint.push(resData[0].lat);

                setLongitude(resData[0].lon);
                setLatitude(resData[0].lat);
                setAddressData(resData[0]);
                
                setIsLoading(false);

                const map = new maplibregl.Map({
                    container: 'map',
                    attributionControl: false, 
                    style: 'https://tiles.locationiq.com/v3/streets/vector.json?key='+locationiqKey,
                    zoom: 16,
                    center: endPoint
                });

                let nav = new maplibregl.NavigationControl();
                map.addControl(nav, 'top-right');
                
                let el = document.createElement('div');
                el.id = 'markerWithExternalCss';
                
                new maplibregl.Marker(el)
                    .setLngLat(endPoint)
                    .addTo(map);


                // if(!resData[0].geojson || resData[0].geojson.type !== "Polygon") {  
                //     let el = document.createElement('div');
                //     el.id = 'markerWithExternalCss';
                    
                //     new maplibregl.Marker(el)
                //         .setLngLat(endPoint)
                //         .addTo(map);
                    
                //     return;    
                // }

                
                // map.on('load', function () {
                //     map.addLayer({
                //         'id': 'maine',
                //         'type': 'fill',
                //         'source': {
                //             'type': 'geojson',
                //             'data': {
                //                 'type': 'Feature',
                //                 'geometry': resData[0].geojson
                //             }
                //         },
                //         'layout': {},
                //         'paint': {
                //             'fill-color': '#D20C0C',
                //             'fill-opacity': 0.5
                //             }
                //         });
                //     });     
                    
            })
            .catch((err) => {
                console.log(err)
                const error = err.toString().split(":");
                // console.log(error)
                setIsLoading(false);
                swal({
                        title: "Oops!",
                        text: error[1],
                    })
            });
                
        }
    }, [flyToAddress]);

    useEffect(() => {
        // setConfirmMap(true);
        // setAddressValid(false);
        // setError(false);
        if(address) {    
            setLongitude("");
            setLatitude("");    

            const addressHandler = setTimeout(() => {
                fetch(`https://api.locationiq.com/v1/autocomplete?key=${locationiqKey}&q=${address}`)
                .then(res => {
                    // console.log("This is the result from locationIq API call", res)
                    if(!res.ok) {
                        return res.json()
                        .then(errorData => {
                            throw new Error(errorData.error);
                        });
                    }
                    return res.json()
                })
                .then(resData => {
                    setAddresses(resData);
                })
                .catch((err) => {
                    console.log(err)
                    setAddresses([]);
                })
            }, 500)
            return () => {
                    clearTimeout(addressHandler);
                }
            }
    }, [address]);

    useEffect(() => {
        const getUserAirspace = async() => {
            if(user) {
                const signatureObj = {};

                // const retrievedObj = JSON.parse(localStorage.getItem("signature"));

                const chainConfig = {
                    chainNamespace: "solana",
                    chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                    rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
                    displayName: "Solana Mainnet",
                    blockExplorer: "https://explorer.solana.com",
                    ticker: "SOL",
                    tickerName: "Solana",
                };

                const web3auth = new Web3Auth({
                        // For Production
                        clientId: process.env.NEXT_PUBLIC_PROD_CLIENT_ID,
                
                        // For Development
                        // clientId: process.env.NEXT_PUBLIC_DEV_CLIENT_ID,
                        web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
                        chainConfig: chainConfig,
                    });
        
                await web3auth.initModal();

                const web3authProvider = await web3auth.connect();

                const solanaWallet = new SolanaWallet(web3authProvider);

            

                // const userInfo = await web3auth.getUserInfo();
            
                // const domain = window.location.host;
                const domain = 'localhost:3000';
                // const origin = window.location.origin;
                const origin = 'http://localhost:3000';



                const payload = new SIWPayload();
                payload.domain = domain;
                payload.uri = origin;
                payload.address = user.blockchainAddress
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
                signatureObj.sign_address = user.blockchainAddress


                fetch(`/api/proxy?${Date.now()}`, {
                    headers: {
                        "Content-Type": "application/json",
                        uri: `/properties/user-properties/${user.id}`,
                        // proxy_to_method: "GET",
                        sign: signatureObj.sign,
                        time:  signatureObj.sign_issue_at,
                        nonce: signatureObj.sign_nonce,
                        address: signatureObj.sign_address,
                    }
                }).then((res) => {
                    if(!res.ok) {
                        return res.json()
                        .then((err) => {
                            throw new Error(err.message)
                        })
                    }
                    return res.json()
                    .then((data) =>{
                        setMyAirspaces(data);
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
            }    
        }

        getUserAirspace();
    }, [user]);

    const newAirspace = useSelector(state => {
        return state.value.newAirspace;
    });

    const confirmOnMap = useSelector(state => {
        return state.value.confirmOnMap;
    });

    const additionalInfo = useSelector(state => state.value.airspaceAdditionalInfo);

    const closeAddReviewModalHandler = (e) => {
        e.preventDefault();
        setshowAddReviewModal(false);
    }

    const showAddAirspaceModalHandler = (e) => {
        setShowAddAirspaceModal(true);
    } 

    const backdropCloseHandler = () => {
        setShowAddAirspaceModal(false);
        setshowAddReviewModal(false);


        dispatch(counterActions.closeNewAirspaceModal());
        dispatch(counterActions.closeConfirmOnMapModal());
    }

    const editAirspaceHandler = () => {
        setEditAirspace(true);
    }

    const showAllAirspace = () => {
        setAllAirSpace(true);
        setMyAirSpace(false);
        setAirspace("all")
    }

    const showMyAirspace = () => {
        setMyAirSpace(true)
        setAllAirSpace(false)
        setAirspace("mine");
    }

    const showMyAirspaceHandler = (id) => {
        const filteredAirspace = myAirspaces.filter(airspace => airspace.id === id)
        setMyFilteredAirspace(filteredAirspace[0]);
        setFlyToAddress(filteredAirspace[0].address);

        setViewMyAirSpace(true);
    }
   
    const closeAirspaceDetailsHandler = () => {
        setViewMyAirSpace(false)
    }

    const addressChangeHandler = (e) => {
        if(!showOptions) {
            setShowOptions(true);
        }

        setAddress(e.target.value);
    }

    

    const airspaceHandler = () => {
        // if(user.categoryId === 1 && user.KYCStatusId !== 2) {
        //     swal({
        //         title: "Sorry!",
        //         text: "Your KYB is yet to be completed. A member of our team will be in contact with you soon",
        //       })
        //     return;
        // }

        // verificationCheck(users);

        dispatch(counterActions.confirmOnMapModal());
    };

    const buttonSelectHandler = (e) => {
        e.preventDefault(), 
        setAddress(e.target.value), 
        setFlyToAddress(e.target.value);
        setShowOptions(false);
    }

    const confirmAddressHandler = (e) => {
        // e.preventDefault();
        setIsLoading(true);

        if(user.categoryId === 1 && user.KYCStatusId !== 2) {
            swal({
                title: "Sorry!",
                text: "Your KYB is yet to be completed. A member of our team will be in contact with you soon",
              })
            
            setIsLoading(false);
            return;
        }

        const vertexes = []

        if(addressData.geojson && addressData.geojson.type === "Polygon") {
            for(const address of addressData.geojson.coordinates) {
                for(const val of address) {
                    const addValue = {}
                    const long = parseFloat(val[0].toFixed(2))
                    const lat = parseFloat(val[1].toFixed(2))
                    addValue.longitude = +long
                    addValue.latitude = +lat
                    vertexes.push(addValue)
                }
            }
        }

        const long = parseFloat(longitude).toFixed(2);
        const lat = parseFloat(latitude).toFixed(2);
        

        const addressValue = {
            address: address,
            longitude: +long,
            latitude: +lat,
            vertexes: vertexes
        }

        dispatch(counterActions.airspaceData(addressValue));
      
        
        verificationCheck(users);

        setIsLoading(false);
    };
  


    if(!user || !token) {
        return <Spinner />
    };

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

        {/* {showAddReviewModal &&
            createPortal(<AddReviewModal onClose={closeAddReviewModalHandler} />, document.getElementById("modal-root"))
            } */}
        {additionalInfo && 
            <AdditionalAispaceInformation user={user} />
            }
        {confirmOnMap && 
            createPortal(<AddAirspace onClose={backdropCloseHandler} />, document.getElementById("modal-root"))
            }
        
        {editAirspace && createPortal(<EditAispaceModal 
                            variable={myFilteredAirspace.isFixedTransitFee}
                            title={myFilteredAirspace.title}
                            fee={myFilteredAirspace.transitFee}
                            deck={myFilteredAirspace.hasLandingDeck}
                            station={myFilteredAirspace.hasChargingStation}
                            storage={myFilteredAirspace.hasStorageHub}
                            status={myFilteredAirspace.noFlyZone}
                            weeks={myFilteredAirspace.weekDayRanges}
                            timeZone={myFilteredAirspace.timezone}
                            user={user}
                            id={myFilteredAirspace.id}
                            onClose={(e) => {
                                e.preventDefault()
                                setEditAirspace(false)
                            }} />, document.getElementById("modal-root"))}

        {(showAddReviewModal || showAddAirspaceModal || newAirspace || additionalInfo || confirmOnMap || editAirspace) && createPortal(<Backdrop onClick={backdropCloseHandler} />, document.getElementById("backdrop-root"))}
        <div className="flex flex-row mx-auto">
            <Sidebar user={user} users={users} />
            <div className="overflow-y-auto overflow-x-hidden" style={{width: "calc(100vw - 257px)", height: "100vh"}}>
                <Navbar name={user.name} onClose={() => setShowOptions(false)} categoryId={user.categoryId} status={user.KYCStatusId}>
                    <div className="relative">
                        <svg onClick={() => {
                            setFlyToAddress(address);
                            setShowOptions(false);
                        }} xmlns="http://www.w3.org/2000/svg" className={`absolute bottom-11 right-2 ${isLoading ? "cursor-wait" : "cursor-pointer"}`} width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.7118 11.7481C8.12238 13.822 4.33202 13.6588 1.93164 11.2584C-0.643879 8.6829 -0.643879 4.50716 1.93164 1.93164C4.50716 -0.64388 8.68289 -0.643879 11.2584 1.93164C13.6588 4.33202 13.822 8.12238 11.7481 10.7118L16.7854 15.7491C17.0715 16.0352 17.0715 16.4992 16.7854 16.7854C16.4992 17.0715 16.0352 17.0715 15.7491 16.7854L10.7118 11.7481ZM2.96795 10.2221C0.964766 8.21893 0.964766 4.97113 2.96795 2.96795C4.97113 0.964767 8.21892 0.964767 10.2221 2.96795C12.2238 4.96966 12.2253 8.21416 10.2265 10.2177C10.225 10.2192 10.2236 10.2206 10.2221 10.2221C10.2206 10.2236 10.2192 10.225 10.2177 10.2265C8.21416 12.2253 4.96966 12.2238 2.96795 10.2221Z" fill="#252530" fillOpacity="0.55"/>
                        </svg>
                        <input type="text" value={address} onChange={addressChangeHandler} placeholder="Search here to claim airspace" className="rounded-md text-ellipsis my-7 ps-3 pe-8 ms-5 focus:outline-blue-200" style={{width: "340px", height: "47px", border: "1px solid rgba(37, 37, 48, 0.55)"}} />
                        
                        {(addresses.length > 0 && address.length > 0) &&
                            <div style={{width: "340px", height: "259px", border: "0.35px solid #0653EA"}} className={`${(!showOptions || addresses.length < 1) && "hidden"} bg-white z-50 overflow-y-auto rounded px-3 py-1 absolute ms-5 top-20`}>
                                <p className="text-xs text-red-500">If any of the addresses listed below matches your address, click on it to select</p>
                                {addresses.map(address => {
                                    return <button  key={address.osm_id + Math.random()}
                                                        value={address.display_name} 
                                                        onClick={buttonSelectHandler}
                                                        className="py-2 text-left" 
                                                        style={{borderBottom: "0.2px solid #0653EA", width: "100%"}}>
                                                        {address.display_name}
                                    </button>
                                })

                                }
                            </div>
                            }
                    </div>
                </Navbar>
                <div className="relative mt-0" id="map" style={{width: "calc(100vw - 257px)", height: "100vh", marginTop: "0"}}>
                    <CollapseAirspace transition={transition} collapse={() => setTransition(!transition)} />
                    <Airspaces 
                            showMyAirspace={showMyAirspace} 
                            airspace={airspace} 
                            allAirspace={allAirspace}
                            showAllAirspace={showAllAirspace}
                            myAirspace={myAirspace}
                            onAddAirspace={showAddAirspaceModalHandler}
                            users={users}
                            // checkUser={airspaceHandler}
                            // checkUser={() => alert("clicked")}
                            
                            transition={transition}
                            >
                        <div>
                            {(latitude && longitude && address.length > 0) && 
                                <p className="mt-3">Search Result</p>
                            }
                            {(latitude && longitude && address.length > 0) && 
                                <div className="bg-white mb-5 mt-3 p-3" style={{width: "299px", borderRadius: "3px", border: "1px solid blue"}}>  
                                    <div className="flex flex-row gap-5">
                                        <Image src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${longitude},${latitude},12,0/70x70?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`} alt="a static map" width={70} height={70} style={{objectFit: 'cover'}} />
                                        <p>{address}</p>
                                    </div>
                                    <div className="flex flex-row justify-end"> 
                                        <button onClick={confirmAddressHandler} disabled={isLoading} className="bg-dark-blue rounded-md mt-2 text-white disabled:cursor-wait" style={{width: "129px", height: "29px"}}>Claim Airspace</button>
                                    </div>
                                </div>
                            }
                            {!myAirspaces && <p className="mt-10">Loading...</p>}

                            {(myAirspaces && myAirspaces.length > 0 && latitude && longitude && address.length > 0) && 
                                <p className=" mt-5 pt-5">My Airspaces</p>
                            }
                            {(myAirspaces && myAirspaces.length > 0) && myAirspaces.map(airspace => {
                                return  <MyAirspaceTab 
                                            key={airspace.id}
                                            title={airspace.title}
                                            name={user.name}
                                            address={airspace.address}
                                            identification={airspace.identification}
                                            status={airspace.noFlyZone}
                                            viewMyAirspace={showMyAirspaceHandler.bind(null, airspace.id)}
                                            amount={airspace.transitFee}
                                            propertyStatus={airspace.propertyStatus.type}
                                        >

                                        </MyAirspaceTab>
                            })}
                        </div>
                    </Airspaces>
                
                    {viewMyAirspace && <MyAirspaceOverview 
                                                viewMyAirspace={showMyAirspaceHandler}
                                                //  myAirspaceReview={myAirspaceReviewHandler} 
                                                //  aboutMyAirspace={aboutMyAirspaceHandler} 
                                                 closeDetails={closeAirspaceDetailsHandler}
                                                 address={myFilteredAirspace.address}
                                                 title={myFilteredAirspace.title}
                                                 name={user.name}
                                                 email={user.email}
                                                 amount={myFilteredAirspace.transitFee}
                                                 landingDeck={myFilteredAirspace.hasLandingDeck}
                                                 chargingStation={myFilteredAirspace.hasChargingStation}
                                                 storageHub={myFilteredAirspace.hasStorageHub}
                                                 noFlyZone={myFilteredAirspace.noFlyZone}
                                                 editAirspace={editAirspaceHandler}
                                                 latitude={myFilteredAirspace.latitude}
                                                 longitute={myFilteredAirspace.longitude}
                                                 propertyStatus={myFilteredAirspace.propertyStatus.type}
                                                 />}

                    {/* {aboutMyAirspace && <AboutMyAirspace 
                                                viewMyAirspace={myAirspaceOverviewHandler}
                                                myAirspaceReview={myAirspaceReviewHandler} 
                                                aboutMyAirspace={aboutMyAirspaceHandler} 
                                                closeDetails={closeAirspaceDetailsHandler}
                                            />}
                                            
                    {myAirspaceReviews && <MyAirspaceReviews 
                                                viewMyAirspace={myAirspaceOverviewHandler}
                                                myAirspaceReview={myAirspaceReviewHandler} 
                                                aboutMyAirspace={aboutMyAirspaceHandler} 
                                                closeDetails={closeAirspaceDetailsHandler}
                                            />}

                    {airSpaceReviews && <AirspaceReviews 
                                                onClick={showAddReviewModalHandler} 
                                                viewAirspace={airspaceOverviewHandler} 
                                                viewAirspaceReview={airspaceReviewHandler} 
                                                aboutAirspace={aboutAirspaceHandler}
                                                closeDetails={closeAirspaceDetailsHandler} 
                                                />}

                    {viewAirspace && <AllAirspaceOverview 
                                                viewAirspace={airspaceOverviewHandler} 
                                                viewAirspaceReview={airspaceReviewHandler} 
                                                aboutAirspace={aboutAirspaceHandler} 
                                                closeDetails={closeAirspaceDetailsHandler} 
                                                />}
                    {aboutAirspace && <AboutAirspace 
                                                viewAirspace={airspaceOverviewHandler} 
                                                viewAirspaceReview={airspaceReviewHandler} 
                                                aboutAirspace={aboutAirspaceHandler}
                                                closeDetails={closeAirspaceDetailsHandler} 
                                                />}
                    {allAirspace && airSpaces.map(airspace => {
                        return <AirspaceTab 
                                        key={airspace.id}
                                        id={airspace.id} 
                                        viewAirspace={showAirspaceHandler} 
                                        title={airspace.title} 
                                        status={airspace.status}
                                    />
                    })}   */}
                </div>
            </div>
        </div>
    </Fragment>
}

export default Airspace;


export async function getServerSideProps() {
    try{
        // const response = await fetch("http://localhost:3000/api/proxy", {
        const response = await fetch(`http://localhost:3000/api/proxy?${Date.now()}`, {
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
