import { Fragment, useState, useEffect } from "react";
import { Web3Auth } from '@web3auth/modal';
import { useAuth } from '@/hooks/useAuth';
import { createPortal } from "react-dom";
import Script from "next/script";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import { ShieldIcon } from "@/Components/Icons";
import { useSignature } from "@/hooks/useSignature";
import useDatabase from "@/hooks/useDatabase";

const Portfolio = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [personalInformation, setPersonalInformation] = useState({ name: '', email: '', phoneNumber: '', newsletter: false, KYCStatusId: 0 })

    const { user: selectorUser, updateProfile } = useAuth();
    const [user, setUser] = useState()
    const [token, setToken] = useState('')
    const { signatureObject } = useSignature();
    const { updateUser } = useDatabase()

    useEffect(() => {
        if (selectorUser) {
            const authUser = async () => {
                const chainConfig = {
                    chainNamespace: 'solana',
                    chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
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

    useEffect(() => {
        if (!user) return;
        const { name, email, phoneNumber, newsletter, KYCStatusId } = user;
        setPersonalInformation({ name, email, phoneNumber, newsletter, KYCStatusId })
    }, [user]);

    const updateDataHandler = async (e) => {
        e.preventDefault();

        const { name, email, phoneNumber, newsletter } = personalInformation;
        // TODO: check if data has changed
        // TODO: check if data is valid

        setIsLoading(true);

        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(user.blockchainAddress);

            const res = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    userId: user.id,
                    name,
                    phoneNumber,
                    email,
                    // TODO: newsletter
                }),
                headers: {
                    'Content-Type': 'application/json',
                    uri: '/private/users/update',
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            });

            if (!res.ok || res.statusCode === 500) {
                const errorData = await res.json();
                throw new Error(errorData.errorMessage);
            }

            const userJsonResponse = await res.json();

            if (userJsonResponse.statusCode === 500) {
                throw new Error('something went wrong');
            }

            setIsLoading(false);


            const updatedUser = {
                ...user,
                name,
                phoneNumber,
                newsletter
            };

            updateProfile(updatedUser);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const onVerifyMyAccount = () => {
        console.log('Verify my account');
    }

    return (
        <Fragment>
            {isLoading && createPortal(<Backdrop />, document?.getElementById('backdrop-root'))}
            {isLoading && createPortal(<Spinner />, document?.getElementById('backdrop-root'))}

            <div className="relative rounded bg-[#F0F0FA] h-screen w-screen flex items-center justify-center overflow-hidden">
                <Sidebar />
                <div className="w-full h-full flex flex-col">
                    <PageHeader pageTitle={'Account'} />
                    <section className="relative w-full h-full flex flex-col py-[29px] px-[21px] md:pl-[54.82px] md:pr-[47px] gap-[29px] md:mb-0 mb-[78.22px] overflow-y-auto">
                        <div className="flex flex-col gap-[15px]">
                            <h2 className="text-[#222222] font-normal text-xl">My Profile</h2>
                            <p className="text-[#87878D] font-normal text-base">Update your account settings</p>
                        </div>
                        <div className="flex flex-col py-[17px] px-[25px] rounded-[30px] gap-[15px] bg-white" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-medium text-[#222222]">Account verification</h2>
                                {personalInformation.KYCStatusId !== 0 && <div className="flex justify-center items-center bg-[#1FD387] rounded-[50%] w-[42px] h-[42px]">
                                    <div className="w-[14px] h-[17.73px]"><ShieldIcon /></div>
                                </div>}
                            </div>
                            <p className="font-normal text-base text-[#87878D] pr-[42px]">{personalInformation.KYCStatusId !== 0 ? 'Thank you, your account is successfully verified. We verify the identity of our customers to assess potential risks, prevent fraud, and comply with legal and regulatory requirements. Note that we store your data securely with advanced encryption and strict authentication measures to ensure utmost privacy and protection.' : 'Your account is not verified. We verify the identity of our customers to assess potential risks, prevent fraud, and comply with legal and regulatory requirements. Note that we store your data securely with advanced encryption and strict authentication measures to ensure utmost privacy and protection.'}</p>
                            {!(personalInformation.KYCStatusId !== 0) && <p className="font-medium text-base text-[#0653EA] text-right flex-1 cursor-pointer" onClick={onVerifyMyAccount}>Verify my account</p>}
                        </div>
                        <div className="flex flex-col py-[17px] px-[25px] rounded-[30px] gap-[15px] bg-white" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
                            <h2 className="text-xl font-medium text-[#222222]">Personal Information</h2>
                            <div className="flex flex-wrap gap-[10px]">
                                <div className="flex flex-col gap-[5px] basis-full">
                                    <label className="font-normal text-[14px] text-[#838187]" htmlFor="name">Name</label>
                                    <input value={personalInformation.name} onChange={(e) => setPersonalInformation(prev => ({ ...prev, name: e.target.value }))} className="py-[16px] px-[22px] rounded-lg text-[14px] font-normal text-[#222222] outline-none" style={{ border: "1px solid #87878D" }} type="text" name="name" id="name" />
                                </div>
                                <div className="flex flex-col gap-[5px] basis-full md:basis-1/3 flex-1">
                                    <label className="font-normal text-[14px] text-[#838187]" htmlFor="name">Email</label>
                                    <input value={personalInformation.email} onChange={(e) => setPersonalInformation(prev => ({ ...prev, email: e.target.value }))} className="py-[16px] px-[22px] rounded-lg text-[14px] font-normal text-[#222222] outline-none" style={{ border: "1px solid #87878D" }} type="text" name="email" id="email" />
                                </div>
                                <div className="flex flex-col gap-[5px] basis-full md:basis-1/3 flex-1">
                                    <label className="font-normal text-[14px] text-[#838187]" htmlFor="phone">Phone</label>
                                    <input value={personalInformation.phoneNumber} onChange={(e) => setPersonalInformation(prev => ({ ...prev, phoneNumber: e.target.value }))} className="py-[16px] px-[22px] rounded-lg text-[14px] font-normal text-[#222222] outline-none" style={{ border: "1px solid #87878D" }} type="text" name="phone" id="phone" />
                                </div>
                                <div className="flex flex-col gap-[10px] basis-full">
                                    <label className="font-normal text-[14px] text-[#838187]" htmlFor="phone">Newsletter</label>
                                    <div className="flex items-center gap-[11px]">
                                        <input checked={personalInformation.newsletter} onClick={(e) => setPersonalInformation(prev => ({ ...prev, newsletter: !prev.newsletter }))} className="w-[18px] h-[18px] rounded-sm" style={{ border: "2px solid #49454F " }} type="checkbox" name="phone" id="phone" />
                                        <p className="text-[#87878D] text-[14px] font-normal">Send me newsletter to keep me updated</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end flex-1">
                                    <p className="font-medium text-base text-[#0653EA] cursor-pointer" onClick={updateDataHandler}>Save changes</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </ Fragment>
    )
}

export default Portfolio;