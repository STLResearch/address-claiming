import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Script from "next/script";
import { LocationPointIcon, ChevronRightIcon, CloseIcon, ArrowLeftIcon } from "@/Components/Icons";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import useDatabase from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import RentalAirspaceModal from "@/Components/Modals/RentalAirspaceModal";

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const Modal = ({ airspace: { title, address, id, expirationDate, currentPrice }, onCloseModal, isOffer }) => {
    return (
        <Fragment>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-[30px] md:rounded-[30px] px-[29px] w-full h-full md:h-auto md:w-[689px] z-50 flex flex-col gap-[15px]">
                <div className="relative flex items-center gap-[20px] md:p-0 py-[20px] px-[29px] -mx-[29px] -mt-[30px] md:my-0 md:mx-0 md:shadow-none" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
                    <div className="w-[16px] h-[12px] md:hidden" onClick={onCloseModal}><ArrowLeftIcon /></div>
                    <h2 className="text-[#222222] text-center font-medium text-xl">{title || address}</h2>
                    <div onClick={onCloseModal} className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"><CloseIcon /></div>
                </div>
                <div className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg" style={{ border: "1px solid #4285F4" }}>
                    <div className="w-6 h-6"><LocationPointIcon /></div>
                    <p className="font-normal text-[#222222] text-[14px] flex-1">{address}</p>
                </div>
                {Object.entries({ 'ID': id, 'Expiration Date': expirationDate, 'Current Price': currentPrice }).map(([key, value]) => {
                    if (!value) return;
                    return (
                        <div className="flex gap-[15px]">
                            <p className="text-[14px] font-normal text-[#222222]">{key}:</p>
                            <p className="text-[14px] font-normal text-[#87878D]">{value}</p>
                        </div>
                    )
                })}
                {isOffer ?
                    <div className="flex gap-[20px] md:mt-[15px] mt-auto py-[16px] md:py-0 -mx-[30px] md:mx-0 md:mb-0 -mb-[30px] px-[14px] md:px-0 md:shadow-none" style={{ boxShadow: '0px 0px 4.199999809265137px 0px #00000040' }}>
                        <div className="flex flex-col">
                            <p className="font-normal text-[12px] text-[#838187]">Offer received</p>
                            <p className="font-bold text-2xl text-[#222222]">{USDollar.format(99.87)}</p>
                        </div>
                        <div onClick={onCloseModal} className="flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center" style={{ border: '1px solid #0653EA' }}>Decline</div>
                        <div className="flex-1 text-white rounded-[5px] bg-[#0653EA] text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center" style={{ border: '1px solid #0653EA' }}>Approve</div>
                    </div>
                    :
                    <div className="flex gap-[20px] md:mt-[15px] mt-auto -mx-[30px] md:mx-0 md:mb-0 -mb-[30px] px-[14px] md:px-0 py-[16px] md:py-0">
                        <button onClick={onCloseModal} className="flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center" style={{ border: '1px solid #0653EA' }}>Cancel</button>
                        <button className="flex-1 text-white rounded-[5px] bg-[#0653EA] text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center" style={{ border: '1px solid #0653EA' }}>Edit</button>
                    </div>
                }
            </div>
        </Fragment>
    )
}

const PortfolioItem = ({ airspace, selectAirspace }) => {
    console.log({airspace})
    return (
        <div onClick={selectAirspace} className="flex p-[11px] items-center justify-between gap-[10px] rounded-lg bg-white cursor-pointer" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <div className="flex items-center gap-[10px] flex-1">
                <div className="w-6 h-6"><LocationPointIcon /></div>
                <p className="font-normal text-[#222222] text-[14px] flex-1">{airspace?.address}</p>
            </div>
            <div className="flex gap-[10px] items-center">
                {airspace.type === 'land' && <div className="bg-[#DBDBDB] text-[#222222] text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">{"On Rent"}</div>}
                {airspace.type === 'rental' && <div className="bg-[#4285F4] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">My rental</div>}



                {/* Logic for the badges not clear, will revisit  -#Ikenna */}
                {/* {!!tags[0] && <div className="bg-[#DBDBDB] text-[#222222] text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">{type === "land" ? "On Claim": "On Rent"}</div>} */}
                {/* {!!tags[1] && <div className="bg-[#E7E6E6] text-[#222222] text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">On Sale</div>} */}
                {/* {!!tags[2] && <div className="bg-[#222222] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">No Fly Zone</div>} */}
                {/* {!!tags[3] && <div className="bg-[#E04F64] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">Review Offer</div>} */}
                <div className="w-[7px] h-[14px]"><ChevronRightIcon /></div>
            </div>
        </div>
    )
}

const PortfolioItemMobile = ({ airspaceName, tags, type, selectAirspace }) => {
    return (
        <div onClick={selectAirspace} className="flex p-[11px] items-center justify-between gap-[10px] cursor-pointer px-[20px]" style={{ borderBottom: "1px solid #DBDBDB" }}>
            <div className="flex items-center gap-[10px] flex-1">
                <div className="w-6 h-6"><LocationPointIcon /></div>
                <p className="font-normal text-[#222222] text-[14px] flex-1">{airspaceName}</p>
            </div>
            <div className="flex gap-[10px] items-center">
                {!!tags[0] && <div className="bg-[#DBDBDB] text-[#222222] text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">{type === "land" ? "On Claim": "On Rent"}</div>}
                {!!tags[1] && <div className="bg-[#E7E6E6] text-[#222222] text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">On Sale</div>}
                {!!tags[2] && <div className="bg-[#222222] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">No Fly Zone</div>}
                {!!tags[3] && <div className="bg-[#E04F64] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">Review Offer</div>}
                <div className="w-[7px] h-[14px]"><ChevronRightIcon /></div>
            </div>
        </div>
    )
}
const PortfolioList = ({ title, airspacesList, selectAirspace }) => {
    return (
        <div className="py-[43px] px-[29px] rounded-[30px] bg-white flex flex-col gap-[43px] min-w-[516px] flex-1" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <h2 className="font-medium text-xl text-[#222222] text-center">{title}</h2>
            <div className="flex flex-col gap-[15px]">
                    {airspacesList.map((airspace, index) => (<PortfolioItem airspace={airspace} selectAirspace={() => selectAirspace(index)} />))}
                </div>
        </div>
    )
}

const PortfolioListMobile = ({ airspacesList, selectAirspace }) => {
    return (
        <div className="flex flex-col gap-[11px] w-full">
            {airspacesList.map(({ title, address, noFlyZone, type }, index) => (<PortfolioItemMobile airspaceName={title || address} tags={[false, false, noFlyZone, false]} type={type} selectAirspace={() => selectAirspace(index)} />))}
        </div>
    )
}

const PortfolioSectionMobile = ({ title, airspacesList, onGoBack }) => {
    return (
        <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen z-[60] bg-white">
            <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between py-[25.5px] text-[#222222] bg-white px-[21px]" style={{ boxShadow: '0px 2px 12px 0px #00000014' }}>
                    <div className="w-[16px] h-[12px]" onClick={onGoBack}><ArrowLeftIcon /></div>
                    <p className="text-xl font-normal md:font-medium mx-auto md:m-0">{title}</p>
                </div>
                <div className="relative w-full flex flex-wrap gap-6 py-[20px]">
                    {airspacesList.map(({ name }, index) => (<PortfolioItem airspaceName={name || address} tags={[1, 1, 1, 1]} selectAirspace={() => selectAirspace(index)} />))}
                </div>
            </div>
        </div>
    )
}


const Portfolio = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAirspace, setSelectedAirspace] = useState(null);
    const { getPropertiesByUserAddress } = useDatabase();
    const [myAirspaces, setMyAirspaces] = useState([])
    const { user } = useAuth()



    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const rentedAirspacePromise = getPropertiesByUserAddress(user.blockchainAddress, 'rentalToken');
                const claimedAirspacePromise = getPropertiesByUserAddress(user.blockchainAddress, 'landToken');

                const [rentedAirspaceResp, claimedAirspaceResp] = await Promise.all([
                    rentedAirspacePromise,
                    claimedAirspacePromise
                ]);

                setMyAirspaces(
                    [...rentedAirspaceResp?.items, ...claimedAirspaceResp?.items].map(item => ({
                        address: item.address,
                        name: item.id,
                        type: item.type,
                        expirationDate: item.type === "land" ? "" : new Date(item.metadata.endTime).toString()
                    }))
                )
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user?.blockchainAddress]);


    const onCloseModal = () => {
        setSelectedAirspace(null);
    }

    const selectAirspace = (x) => { setSelectedAirspace(x) }




    return (
        <Fragment>
            <Head>
                <title>SkyTrade - Portfolio</title>
            </Head>
            {isLoading && createPortal(<Backdrop />, document?.getElementById('backdrop-root'))}
            {isLoading && createPortal(<Spinner />, document?.getElementById('backdrop-root'))}
            {selectedAirspace !== null && <Backdrop onClick={onCloseModal} />}

            <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
                <Sidebar />
                <div className="w-full h-full flex flex-col">
                    {selectedAirspace !== null && myAirspaces[selectedAirspace].type==="land" && <Modal airspace={myAirspaces[selectedAirspace]} onCloseModal={onCloseModal} />}
                    {selectedAirspace !== null && myAirspaces[selectedAirspace].type==="rental" && <RentalAirspaceModal airspace={myAirspaces[selectedAirspace]} onCloseModal={onCloseModal} />}
                    <PageHeader pageTitle={'Portfolio'} username={'John Doe'} />
                    <section className="relative w-full h-full md:flex flex-wrap gap-6 py-[43px] px-[45px] hidden overflow-y-auto">
                        <PortfolioList airspacesList={myAirspaces} title={'My Airspaces'} selectAirspace={selectAirspace} />
                    </section>
                    <section className="relative w-full h-full flex flex-wrap gap-6 py-[20px] md:hidden overflow-y-auto mb-[79px]">
                        <PortfolioListMobile airspacesList={myAirspaces} title={'My Airspaces'} selectAirspace={selectAirspace} />
                    </section>
                    {/** TODO: <PortfolioSectionMobile title={'Hola'} airspacesList={myAirspacesToSellAndRent} />*/}
                </div>
            </div>
        </ Fragment>
    )
}

export default Portfolio;