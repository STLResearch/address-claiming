import { Fragment, useEffect, useState } from "react";
import Script from 'next/script';
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import { EarthIcon, GiftIcon, ShareIcon, FacebookIcon, LinkedInIcon, GoogleIcon, XIcon, FriendsIcon, PropertyIcon } from "@/Components/Icons";
import { useMobile } from "@/hooks/useMobile";
import useDatabase from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";

const Item = ({ icon, title, text }) => {
    return (
        <div className="py-5 px-[15px] rounded-[30px] bg-white flex flex-col gap-[15px] items-center md:min-w-[225px] md:h-[223px] w-full" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <div className="w-[63px] h-[63px] bg-[#E9F5FE] flex items-center justify-center" style={{ borderRadius: "50%" }}>
                <div className="w-9 h-9 flex items-center justify-center">{icon}</div>
            </div>
            <p className="text-[#4285F4] font-semibold text-[18px]">{title}</p>
            <p className="text-[#222222] font-normal text-[14px] text-center">{text}</p>
        </div>
    )
}

const Path = () => {
    return (
        <div className="md:w-full h-1 w-[15px] rotate-90 md:rotate-0" style={{ borderTop: "2px dashed #4285F4" }} />
    )
}

const AlertMessage = () => {
    return (
        <div className="absolute hidden md:block top-5 right-0 text-[14px] py-[14px] px-[26px] bg-white text-[#0000FF]" style={{ borderLeft: "6px solid #0000FF", boxShadow: "0px 0px 40px 0px #0813391A" }}>
            <span className="font-bold">Refer now!</span> First 500 users score a one-time bonus. Act fast!
        </div>
    )
}

const TheProgram = ({ activeSection, section, isMobile }) => {
    if (activeSection !== section && isMobile) return;

    return (
        <Fragment>
            <div className="px-[40px] flex flex-col gap-[15px]">
                <p className="text-[#222222] text-xl font-normal">Share and Earn! 🚀✨</p>
                <p className="text-[#87878D] text-[15px] font-normal">Invite your friends and neighbours to SkyTrade. If they register and claim airspaces, you receive:</p>
                <p className="text-[#4285F4] text-[15px] font-normal"><span className="font-bold text-[20px]">+50 credits to you</span> for each successful referral registration and <span className="font-bold text-[20px]">+50 credits</span> to the successfully referred person<br />
                    <span className="font-bold text-[20px]">+10%</span> on top of the passive income generated by those you refer <span className="font-bold text-[20px]">FOREVER</span></p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-9 px-[35px] md:px-[51px]">
                <Item icon={<ShareIcon />} title={"Share"} text={"Send your invite link or code to your friends and explain them how cool is SkyTrade"} />
                <Path />
                <Item icon={<EarthIcon isActive={true} />} title={"Register & Claim"} text={"Let them register and claim their airspaces using your referral link or code"} />
                <Path />
                <Item icon={<GiftIcon isActive={true} />} title={"Earn"} text={"You and your friends are rewarded with 50 credits and more"} />
            </div>
        </Fragment>
    )
}

const Share = ({ activeSection, section, isMobile, referralCode, blockchainAddress, user }) => {
    if (activeSection !== section && isMobile) return;
    const [isCopied, setIsCopied] = useState({ code: false, link: false });
    const [temporalReferralCode, setTemporalReferralCode] = useState(referralCode);
    const { updateReferral } = useDatabase();
    const { updateProfile } = useAuth();

    useEffect(() => {
        if (!isCopied.code) return;
        let timeoutId;
        (() => {
            timeoutId = setTimeout(() => {
                setIsCopied(prev => ({ ...prev, code: false }))
            }, 2000);
        })();

        return () => timeoutId && clearTimeout(timeoutId);
    }, [isCopied.code]);

    useEffect(() => {
        if (!isCopied.link) return;
        let timeoutId;
        (() => {
            timeoutId = setTimeout(() => {
                setIsCopied(prev => ({ ...prev, link: false }))
            }, 2000);
        })();

        return () => timeoutId && clearTimeout(timeoutId);
    }, [isCopied.link]);

    useEffect(() => {
        setTemporalReferralCode(referralCode)
    }, [referralCode])

    const handleCopy = (e, text, isCode) => {
        e.preventDefault();
        navigator.clipboard.writeText(text);
        setIsCopied(prev => ({ code: isCode ? true : prev.code, link: !isCode ? true : prev.link }));
    }

    const handleOnChange = (e) => {
        setTemporalReferralCode(e.target.value)
    }

    const handleUpdateReferralCode = async () => {
        try {
            const { ownedReferralCode: { id } } = user;
            await updateReferral(blockchainAddress, temporalReferralCode);
            updateProfile({ ownedReferralCode: { id: id, code: temporalReferralCode, codeChanged: true } })
        } catch (error) {
            console.log(error);
            setTemporalReferralCode(referralCode);
        }
    }

    const shareOnGoogle = (textToShare) => {
        window.open(`https://plus.google.com/share?url=${encodeURIComponent(textToShare)}`, '_blank');
    };

    const shareOnFacebook = (textToShare) => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(textToShare)}`, '_blank');
    };

    const shareOnTwitter = (textToShare) => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`, '_blank');
    };

    const shareOnLinkedIn = (textToShare) => {
        window.open(`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(textToShare)}`, '_blank');
    };

    const canCopy = referralCode === temporalReferralCode;
    const canChangeCode = !canCopy && temporalReferralCode.length === 6;

    return (
        <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-[15px] px-[51px]">
                <p className="text-[#222222] text-xl font-normal">Share the referral link or code</p>
                <p className="text-[#87878D] text-[15px] font-normal">You can also share your referral link or code by copying and sending it or sharing it on your social media. You can define your code once by entering your prefered value and press enter.</p>
                <div className="flex flex-wrap gap-[21px]">
                    <div className="flex gap-[9px] flex-wrap justify-between">
                        <div className="relative w-full md:w-[300px]">
                            <input value={temporalReferralCode} disabled={user?.ownedReferralCode.codeChanged} onChange={handleOnChange} maxLength={6} className="bg-[#DFF1FF] text-[#222222] text-[14px] rounded-lg w-full py-[14px] pl-[22px] focus:outline-none pr-[95px]" type="text" name="myReferralCode" id="myReferralCode" />
                            {canCopy && <p onClick={(e) => handleCopy(e, referralCode, true)} className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[#0653EA] text-[14px] cursor-pointer">{isCopied.code ? 'Copied ✓' : 'Copy code'}</p>}
                            {canChangeCode && <p onClick={handleUpdateReferralCode} className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[#0653EA] text-[14px] cursor-pointer">{'Update code'}</p>}
                        </div>
                        <div onClick={() => shareOnFacebook(referralCode)} className="py-[14px] px-[13.9px] rounded-lg bg-[#DFF1FF] flex items-center justify-center cursor-pointer">
                            <div className="w-5 h-5 flex items-center justify-center"><FacebookIcon /></div>
                        </div>
                        <div onClick={() => shareOnLinkedIn(referralCode)} className="py-[14px] px-[13.9px] rounded-lg bg-[#DFF1FF] flex items-center justify-center cursor-pointer">
                            <div className="w-5 h-5 flex items-center justify-center"><LinkedInIcon /></div>
                        </div>
                        <div onClick={() => shareOnGoogle(referralCode)} className="py-[14px] px-[13.9px] rounded-lg bg-[#DFF1FF] flex items-center justify-center cursor-pointer">
                            <div className="w-5 h-5 flex items-center justify-center"><GoogleIcon /></div>
                        </div>
                        <div onClick={() => shareOnTwitter(referralCode)} className="py-[14px] px-[13.9px] rounded-lg bg-[#DFF1FF] flex items-center justify-center cursor-pointer">
                            <div className="w-5 h-5 flex items-center justify-center"><XIcon /></div>
                        </div>
                    </div>
                    <div className="flex gap-[9px] flex-wrap justify-between">
                        <div className="relative w-full md:w-[300px]">
                            <input value={`localhost:3000/r/${referralCode}`} disabled className="bg-[#DFF1FF] text-[#222222] text-[14px] rounded-lg w-full py-[14px] px-[22px] focus:outline-none" type="text" name="myReferralCode" id="myReferralCode" />
                            <p onClick={(e) => handleCopy(e, `localhost:3000/r/${referralCode}`, false)} className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[#0653EA] text-[14px] cursor-pointer">{isCopied.link ? 'Copied ✓' : 'Copy link'}</p>
                        </div>
                        <div onClick={() => shareOnFacebook(`localhost:3000/r/${referralCode}`)} className="py-[14px] px-[13.9px] rounded-lg bg-[#DFF1FF] flex items-center justify-center cursor-pointer">
                            <div className="w-5 h-5 flex items-center justify-center"><FacebookIcon /></div>
                        </div>
                        <div onClick={() => shareOnLinkedIn(`localhost:3000/r/${referralCode}`)} className="py-[14px] px-[13.9px] rounded-lg bg-[#DFF1FF] flex items-center justify-center cursor-pointer">
                            <div className="w-5 h-5 flex items-center justify-center"><LinkedInIcon /></div>
                        </div>
                        <div onClick={() => shareOnGoogle(`localhost:3000/r/${referralCode}`)} className="py-[14px] px-[13.9px] rounded-lg bg-[#DFF1FF] flex items-center justify-center cursor-pointer">
                            <div className="w-5 h-5 flex items-center justify-center"><GoogleIcon /></div>
                        </div>
                        <div onClick={() => shareOnTwitter(`localhost:3000/r/${referralCode}`)} className="py-[14px] px-[13.9px] rounded-lg bg-[#DFF1FF] flex items-center justify-center cursor-pointer">
                            <div className="w-5 h-5 flex items-center justify-center"><XIcon /></div>
                        </div>
                    </div>
                </div>
            </div>
            <InviteYourFriends />
        </div>
    )
}

const YourReferralsItem = ({ icon, number, text }) => {
    return (
        <div className="flex items-center gap-[17px]">
            <div className="w-[34px] h-[34px]">{icon}</div>
            <p className="text-[40px] text-[#4285F4] font-semibold min-w-[25.84px] text-center">{number}</p>
            <p className="text-[15px] text-[#868686] font-normal">{text}</p>
        </div>
    )
}

const YourReferrals = ({ activeSection, section, isMobile, registeredFriends, registeredAirspaces, validatedProperties }) => {
    if (activeSection !== section && isMobile) return;

    return (
        <div className="flex flex-col gap-[15px] px-[51px]">
            <p className="text-[#222222] text-xl font-normal">Your referrals</p>
            <p className="text-[#87878D] text-[15px] font-normal">Stay in the loop on your referral influence and monitor the number of your friends who used your referral link or code and became part of the SkyTrade revolution.</p>
            <YourReferralsItem icon={<FriendsIcon />} number={registeredFriends} text={'Registered friends'} />
            <div className="w-[39px]" style={{ border: '1px solid #D9D9D9' }} />
            <YourReferralsItem icon={<EarthIcon isActive={true} />} number={registeredAirspaces} text={'Registered airspaces'} />
            <div className="w-[39px]" style={{ border: '1px solid #D9D9D9' }} />
            <YourReferralsItem icon={<PropertyIcon />} number={validatedProperties} text={'Validated properties'} />
        </div>
    )
}

const InviteYourFriends = () => {
    return (
        <div className="flex flex-col gap-[15px] px-[51px]">
            <p className="text-[#222222] text-xl font-normal">Invite your friends</p>
            <p className="text-[#87878D] text-[15px] font-normal">Insert your friend's email address and send them invitations to join us.</p>
            <div className="relative max-w-[522px]">
                <input className="w-full rounded-lg py-[16px] pr-[5px] pl-[22px] outline-none" style={{ border: '1px solid #87878D' }} type="email" name="friendEmail" id="friendEmail" placeholder="email address" />
                <div className="absolute right-[5px] top-1/2 -translate-y-1/2 w-[38px] h-[41px] bg-[#0653EA] flex items-center justify-center cursor-pointer rounded-lg">
                    <div className="w-[15px] h-[15px]">
                        <ShareIcon color={'white'} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Switcher = ({ sections, activeSection, setActiveSection }) => {
    return (
        <div className="md:hidden flex items-center gap-[14px] mx-auto">
            {sections.map((text, index) => (
                <div key={text} onClick={() => setActiveSection(index)} className={`${index === activeSection ? 'bg-[#222222] text-white' : 'bg-[#2222221A] text-[#222222]'} cursor-pointer text-[15px] font-normal p-[10px] rounded-[30px]`}>{text}</div>
            ))}
        </div>
    )
}

const Referral = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const [data, setData] = useState({ referralCode: '', registeredFriends: 0, registeredAirspaces: 0, validatedProperties: 0 })
    const { isMobile } = useMobile();
    const { user } = useAuth()
    const { getPropertiesByUserId, } = useDatabase();
    const sections = ['The Program', 'Share', 'My Referrals'];

    useEffect(() => {
        if (!user) return;

        const { id, blockchainAddress, ownedReferralCode: { code } } = user;

        (async () => {
            try {
                const response = await getPropertiesByUserId(blockchainAddress, id);
                console.log('marcin', user, response)
                setData(prev => ({ ...prev, validatedProperties: response.filter(i => i.isActive).length, registeredAirspaces: response.length }));
            } catch (error) {
                console.log(error);
            }
        })();

        setData(prev => ({ ...prev, referralCode: code }))
    }, [user])

    return (
        <Fragment>
            {isLoading && createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
            {isLoading && createPortal(<Spinner />, document.getElementById('backdrop-root'))}

            <div className="relative rounded bg-[#F0F0FA] h-screen w-screen flex items-center justify-center overflow-hidden">
                <Sidebar />
                <div className="w-full h-full flex flex-col">
                    <PageHeader pageTitle={'Referral Program'} />
                    <section className="relative w-full h-full py-6 md:py-[37px] flex flex-col gap-8 mb-[78.22px] md:mb-0 overflow-y-scroll">
                        <Switcher sections={sections} activeSection={activeSection} setActiveSection={setActiveSection} />
                        <AlertMessage />
                        <TheProgram activeSection={activeSection} isMobile={isMobile} section={0} />
                        <Share activeSection={activeSection} isMobile={isMobile} section={1} referralCode={data.referralCode} blockchainAddress={user?.blockchainAddress} user={user} />
                        <YourReferrals activeSection={activeSection} isMobile={isMobile} section={2} registeredFriends={data.registeredFriends} registeredAirspaces={data.registeredAirspaces} validatedProperties={data.validatedProperties} />
                    </section>
                </div>
            </div>
        </ Fragment>
    );
}

export default Referral;
