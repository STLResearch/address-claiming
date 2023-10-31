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
                        title: "Oops!",
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

    
    useEffect(() => {
        if(token && user) {
            const map = new maplibregl.Map({
                container: 'map',
                attributionControl: false, 
                style: 'https://tiles.locationiq.com/v3/streets/vector.json?key='+locationiqKey,
                zoom: 12,
                center: [-122.42, 37.779]
            });

            var nav = new maplibregl.NavigationControl();
            map.addControl(nav, 'top-right');


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
    }, [token, user])

    useEffect(() => {
        if(flyToAddress) {
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

                const endPoint = []
        
                endPoint.push(resData[0].lon)
                endPoint.push(resData[0].lat)

                const map = new maplibregl.Map({
                    container: 'map',
                    attributionControl: false, 
                    style: 'https://tiles.locationiq.com/v3/streets/vector.json?key='+locationiqKey,
                    zoom: 18,
                    center: endPoint
                });

        
                if(!resData[0].geojson || resData[0].geojson.type !== "Polygon") {  
                    let el = document.createElement('div');
                    el.id = 'markerWithExternalCss';
                    
                    new maplibregl.Marker(el)
                        .setLngLat(endPoint)
                        .addTo(map);

                    return;    
                }
                
                map.on('load', function () {
                    map.addLayer({
                        'id': 'maine',
                        'type': 'fill',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'Feature',
                                'geometry': resData[0].geojson
                            }
                        },
                        'layout': {},
                        'paint': {
                            'fill-color': '#D20C0C',
                            'fill-opacity': 0.5
                            }
                        });
                    });     
            })
            .catch((err) => {
                console.log(err)
            });
                
        }
    }, [flyToAddress]);

    useEffect(() => {
        const getUserAirspace = async() => {
            if(user) {
                const signatureObj = {};

                // const retrievedObj = JSON.parse(localStorage.getItem("signature"));

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
        setMyFilteredAirspace(filteredAirspace[0])
        setFlyToAddress(filteredAirspace[0].address);

        setViewMyAirSpace(true);
    }
   
    const closeAirspaceDetailsHandler = () => {
        setViewMyAirSpace(false)
    }

    const airspaceHandler = () => {
        if(user.categoryId === 1 && user.KYCStatusId !== 2) {
            swal({
                title: "Sorry!",
                text: "Your KYB is yet to be completed. A member of our team will be in contact with you soon",
              })
            return;
        }

        verificationCheck(users);
    };
  


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
                <Navbar name={user.name} categoryId={user.categoryId} status={user.KYCStatusId}>
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-11 right-2 cursor-pointer" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.7118 11.7481C8.12238 13.822 4.33202 13.6588 1.93164 11.2584C-0.643879 8.6829 -0.643879 4.50716 1.93164 1.93164C4.50716 -0.64388 8.68289 -0.643879 11.2584 1.93164C13.6588 4.33202 13.822 8.12238 11.7481 10.7118L16.7854 15.7491C17.0715 16.0352 17.0715 16.4992 16.7854 16.7854C16.4992 17.0715 16.0352 17.0715 15.7491 16.7854L10.7118 11.7481ZM2.96795 10.2221C0.964766 8.21893 0.964766 4.97113 2.96795 2.96795C4.97113 0.964767 8.21892 0.964767 10.2221 2.96795C12.2238 4.96966 12.2253 8.21416 10.2265 10.2177C10.225 10.2192 10.2236 10.2206 10.2221 10.2221C10.2206 10.2236 10.2192 10.225 10.2177 10.2265C8.21416 12.2253 4.96966 12.2238 2.96795 10.2221Z" fill="#252530" fillOpacity="0.55"/>
                        </svg>
                        <input type="text" placeholder="Search Airspace" className="rounded-md my-7 ps-3 ms-5 focus:outline-blue-200" style={{width: "433px", height: "47px", border: "1px solid rgba(37, 37, 48, 0.55)"}} />
                    </div>
                </Navbar>
                <div className="relative mt-0" id="map" style={{width: "calc(100vw - 257px)", height: "100vh", marginTop: "0"}}>
                    <Airspaces 
                            showMyAirspace={showMyAirspace} 
                            airspace={airspace} 
                            allAirspace={allAirspace}
                            showAllAirspace={showAllAirspace}
                            myAirspace={myAirspace}
                            onAddAirspace={showAddAirspaceModalHandler}
                            users={users}
                            checkUser={airspaceHandler}
                            // checkUser={() => alert("clicked")}
                            >
                       
                        {!myAirspaces && <p className="mt-10">Loading...</p>}

                        {myAirspaces && myAirspaces.length < 0  &&
                            <p>you currently do not have any airspace</p>
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
                                     />
                        })}
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
