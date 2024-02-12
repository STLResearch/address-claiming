import { Fragment, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Script from "next/script";
import { DroneIcon, GiftIcon, WalletIcon, LocationPointIcon, ChevronRightIcon, InfoIcon, MagnifyingGlassIcon, ShareIcon, EarthIcon } from "@/Components/Icons";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import WorldMap from "@/Components/WorldMap";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'next/router';
import { Web3Auth } from '@web3auth/modal';
import { SolanaWallet } from '@web3auth/solana-provider';
import { Payload as SIWPayload, SIWWeb3 } from '@web3auth/sign-in-with-web3';
import base58 from 'bs58';
import useDatabase from "@/hooks/useDatabase";
import { getTokeBalance } from "../funds/utils";

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const Item = ({ children, title, icon, linkText, href, style }) => {
    return (
        <div className={`${style || ''} relative flex flex-col pt-[17px] pb-[21px] pr-[18px] pl-[25px] rounded-[30px] bg-white gap-[15px] md:w-[343px] w-full`} style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <div className="flex justify-between items-center">
                <p className="text-xl font-medium text-[#222222]">{title}</p>
                <div className="rounded-[50%] bg-[#CCE3FC] flex items-center justify-center p-[10px]">
                    <div className="h-6 w-6">
                        {icon}
                    </div>
                </div>
            </div>
            {children}
            <Link href={href}>
                <p className="font-medium text-base text-[#0653EA] cursor-pointer text-right">{linkText}</p>
            </Link>
        </div>
    )
}

const AvailableBalance = ({ balance = 0 }) => {
    return (
        <Item title={'Available Balance'} icon={<WalletIcon isActive />} linkText={'View funds'} href={'/homepage/funds'} style='h-fit'>
            <div className="flex items-center justify-between">
                <p className="absolute bottom-[12px] left-[26px] text-3xl text-[#4285F4] font-medium">{USDollar.format(balance)}</p>
            </div>
        </Item>
    )
}

const MyAirspaces = ({ airspaces = [] }) => {
    return (
        <Item title={<Fragment>My Airspaces <span className="text-[15px] font-normal">({airspaces.length})</span></Fragment>} icon={<DroneIcon isActive />} linkText={'View all airspaces'} href={'/homepage/portfolio'}>
            <div className="flex flex-col items-center gap-[29px]">
                <div className="w-[265.81px] h-[131.01px]">
                    <WorldMap coloredCountries={['Spain']} />
                </div>
                <div className="flex flex-col items-center gap-[7px] w-full">
                    {airspaces.length === 0 && <p className="text-[17px] text-[#222222] font-normal px-[55px] text-center">Claim your first piece of sky now!</p>}
                    {airspaces.length !== 0 && airspaces.slice(0, 3).map((airspace) => (
                        <div className="rounded-lg w-full py-[16px] px-[22px] flex items-center gap-[10px]" style={{ border: "1px solid #4285F4" }}>
                            <div className="w-[24px] h-[24px] flex justify-center items-center"><LocationPointIcon /></div>
                            <p className="flex-1">{(airspace.title || airspace.address).substring(0, 15)}</p>
                            <div className="w-[18px] h-[18px] flex items-center justify-center"><ChevronRightIcon /></div>
                        </div>
                    ))}
                </div>
            </div>
        </Item>
    )
}

const Path = () => {
    return (
        <div className="md:h-[7.95px] md:w-0 h-1 w-[7.85px] rotate-90" style={{ borderRight: "1px dashed #4285F4" }} />
    )
}

const ReferralProgramItem = ({ icon, title, text }) => {
    return (
        <div className="py-[15px] flex-1 text-center md:px-[38px] rounded-[30px] bg-white flex flex-col gap-[7.85px] items-center" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <div className="w-[33px] h-[33px] bg-[#E9F5FE] flex items-center justify-center" style={{ borderRadius: "50%" }}>
                <div className="w-[19px] h-[19px] flex items-center justify-center">{icon}</div>
            </div>
            <p className="text-[#4285F4] font-semibold text-[12px]">{title}</p>
            <p className="text-[#1E1E1E] font-normal text-[10px] text-center hidden md:block">{text}</p>
        </div>
    )
}

const ReferralProgram = () => {
    return (
        <Item title={'Referral Program'} icon={<GiftIcon isActive />} linkText={'View referral program'} href={'/homepage/referral'} style={'h-fit'}>
            <div className="flex md:flex-col items-center justify-center gap-[8.37px] md:px-[17px]">
                <ReferralProgramItem icon={<ShareIcon />} title={"Share"} text={"Send your invite link or code to your friends and explain them how cool is SkyTrade"} />
                <Path />
                <ReferralProgramItem icon={<EarthIcon isActive={true} />} title={"Register & Claim"} text={"Let them register and claim their airspaces using your referral link or code"} />
                <Path />
                <ReferralProgramItem icon={<GiftIcon isActive={true} />} title={"Earn"} text={<Fragment>You and your friends are rewarded with <span className="font-bold">50 credits</span> and <span className="font-bold">+10%</span> on top of the passive income generated by those you refer <span className="font-bold">FOREVER</span></Fragment>} />
            </div>
        </Item>
    )
}



const Dashboard = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const { user: selectorUser } = useAuth();
    const [user, setUser] = useState();
    const [token, setToken] = useState('');
    const [tokenBalance, setTokenBalance] = useState('');
    const [signature, setSignature] = useState();
    const [airspaces, setAirspaces] = useState([]);
    const { getPropertiesByUserId } = useDatabase();

    // GET USER AND TOKEN
    useEffect(() => {
        if (selectorUser) {
            const authUser = async () => {
                const chainConfig = {
                    chainNamespace: 'solana',
                    chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
                    rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
                    displayName: 'Solana Mainnet',
                    blockExplorer: 'https://explorer.solana.com',
                    ticker: 'SOL',
                    tickerName: 'Solana',
                };
                const web3auth = new Web3Auth({
                    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

                    web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
                    chainConfig: chainConfig,
                });
                await web3auth.initModal();
                // await web3auth.connect();
                let userInfo;
                try {
                    userInfo = await web3auth.getUserInfo();
                } catch (err) {
                    localStorage.removeItem('openlogin_store');
                    router.push('/auth/join');
                    return;
                }

                const fetchedToken = JSON.parse(
                    localStorage.getItem('openlogin_store')
                );

                if (!selectorUser) {
                    localStorage.removeItem('openlogin_store');
                    router.push('/auth/join');
                    return;
                }

                setToken(fetchedToken.sessionId);
                setUser(selectorUser);
            };
            authUser();
        }
    }, [selectorUser]);

    const loadUserTokenBalance = async () => {
        const tokenBalance = await getTokeBalance()
        setTokenBalance(tokenBalance)
    }

    // GET TOKEN BALANCE
    useEffect(() => {
        if (user) {
            loadUserTokenBalance()
        }
    }, [user]);

    // GET SIGNATURE
    useEffect(() => {
        if (user) {
            const getSignature = async () => {
                const signatureObj = {};

                const chainConfig = {
                    chainNamespace: 'solana',
                    chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
                    rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
                    displayName: 'Solana Mainnet',
                    blockExplorer: 'https://explorer.solana.com',
                    ticker: 'SOL',
                    tickerName: 'Solana',
                };

                const web3auth = new Web3Auth({
                    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
                    web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
                    chainConfig: chainConfig,
                });

                await web3auth.initModal();

                const web3authProvider = await web3auth.connect();

                const solanaWallet = new SolanaWallet(web3authProvider);

                // const userInfo = await web3auth.getUserInfo();

                const domain = window.location.host;
                const origin = window.location.origin;

                const payload = new SIWPayload();
                payload.domain = domain;
                payload.uri = origin;
                payload.address = user.blockchainAddress;
                payload.statement = 'Sign in to SkyTrade app.';
                payload.version = '1';
                payload.chainId = 1;

                const header = { t: 'sip99' };
                const network = 'solana';

                let message = new SIWWeb3({ header, payload, network });

                const messageText = message.prepareMessage();
                const msg = new TextEncoder().encode(messageText);
                const result = await solanaWallet.signMessage(msg);

                const signature = base58.encode(result);

                signatureObj.sign = signature;
                signatureObj.sign_nonce = message.payload.nonce;
                signatureObj.sign_issue_at = message.payload.issuedAt;
                signatureObj.sign_address = user.blockchainAddress;
                setSignature(signatureObj);
            };

            getSignature();
        }
    }, [user]);

    // GET AIRSPACE LENGTH
    useEffect(() => {
        if (!user) return;

        const getAirspaces = async () => {
            try {
                const response = await getPropertiesByUserId(user.blockchainAddress, user.id);
                setAirspaces(response);
            } catch (error) {
                console.log(error)
            }
        };

        getAirspaces();
    }, [user])

    if (!user || !token) {
        return <Spinner />;
    }

    return (
        <Fragment>
            {isLoading && createPortal(<Backdrop />, document?.getElementById('backdrop-root'))}
            {isLoading && createPortal(<Spinner />, document?.getElementById('backdrop-root'))}

            <div className="relative rounded bg-[#F0F0FA] h-screen w-screen flex items-center justify-center overflow-hidden">
                <Sidebar />
                <div className="w-full h-full flex flex-col">
                    <PageHeader pageTitle={'Dashboard'} />
                    <section className="hidden md:flex relative w-full h-full px-[53px] pt-[52px]">
                        <div className="flex flex-1 gap-[37px]">
                            <div className="basis-[58%] flex flex-col gap-[48px] h-full overflow-y-auto my-[-53px] py-[53px]">
                                <div className="flex flex-col gap-2">
                                    <h2 className="font-medium text-xl text-black">Welcome on SkyTrade!</h2>
                                    <p className="font-normal text-base text-[#87878D]">Claim your airspace on the dashboard to kickstart your passive income journey. Don't forget to share the love—refer friends using your code or link and watch your earnings grow. Welcome to the community, where the future is yours to seize! 🌟🚀</p>
                                </div>
                                <div className="flex flex-wrap gap-[22px]">
                                    <div className="flex flex-col gap-[22px]">
                                        <AvailableBalance balance={tokenBalance} />
                                        <MyAirspaces airspaces={airspaces} />
                                    </div>
                                    <ReferralProgram />
                                </div>
                            </div>
                            <Link href={'/homepage/airspace2'} className="flex-1 flex flex-col items-center justify-between bg-cover bg-no-repeat bg-center -mt-[53px] -mr-[53px] pt-[42px] px-[18px] pb-[40px]" style={{ backgroundImage: "url('/images/map-bg.png')" }}>
                                <div className="bg-[#FFFFFFCC] py-[43px] px-[29px] rounded-[30px] flex flex-col items-center gap-[15px] max-w-[362px]" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
                                    <div className="flex gap-[5px] items-center">
                                        <p className="text-xl font-medium text-[#222222]">Claim Airspace</p>
                                        <div className="w-5 h-5 items-center justify-center"><InfoIcon /></div>
                                    </div>
                                    <p className="text-[15px] font-normal text-[#222222]">Ready to claim your airspace? No registered airspace yet, but exciting times ahead!</p>
                                    <div className="relative px-[22px] py-[16px] bg-white rounded-lg w-full" style={{ border: "1px solid #87878D" }}>
                                        <input type="text" name="searchAirspaces" id="searchAirspaces" placeholder="Search Airspaces" className="outline-none w-full pr-[20px]" />
                                        <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
                                            <MagnifyingGlassIcon />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-white rounded-lg flex items-center justify-center bg-[#0653EA] py-[16px] px-[96px] font-normal text-[15px]">Claim Airspace</div>
                            </Link>
                        </div>
                    </section>
                    <section className="flex flex-col gap-[21px] items-center md:hidden relative w-full h-full mb-[78.22px] overflow-y-auto pb-[47px] px-[18px]">
                        <Link href={'/homepage/airspace2'} className="flex h-[668px] gap-[120px] flex-col items-center justify-between bg-cover bg-no-repeat bg-center py-[23px] px-[16px] -mx-[18px]" style={{ backgroundImage: "url('/images/map-bg.png')" }}>
                            <div className="flex flex-col rounded-[30px] gap-[5.71px] bg-white pt-[17.29px] pb-[17px] pl-[27px] pr-[16px]">
                                <h2 className="font-medium text-xl text-[#222222]">Welcome on SkyTrade!</h2>
                                <p className="font-normal text-base text-[#87878D]">Claim your airspace on the dashboard to kickstart your passive income journey. Don't forget to share the love—refer friends using your code or link and watch your earnings grow. Welcome to the community, where the future is yours to seize! 🌟🚀</p>
                            </div>
                            <div className="text-white rounded-lg flex items-center justify-center bg-[#0653EA] py-[16px] px-[96px] font-normal text-[15px]">Claim Airspace</div>
                        </Link>
                        <MyAirspaces airspaces={airspaces} />
                        <ReferralProgram />
                        <AvailableBalance balance={tokenBalance} />
                    </section>
                </div>
            </div>
        </ Fragment >
    )
}

export default Dashboard;

