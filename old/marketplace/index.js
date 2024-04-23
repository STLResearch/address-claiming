import { Fragment, useState } from "react";
import Script from "next/script";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Link from "next/link";
import Head from "next/head";

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const Item = ({ title, text, imageUrl, link, style }) => {
    return (
        <Link href={link} className={`${style || ''} ${link ? 'cursor-pointer' : 'cursor-not-allowed'} bg-no-repeat bg-center bg-cover rounded-[20px] min-w-[168px] flex-1 py-[16px] px-[18px]`} style={{ backgroundImage: `url(${imageUrl})`, boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <h2 className="text-white font-medium text-xl">{title}</h2>
            {text && <p className="text-white font-normal text-[15px]">{text}</p>}
        </Link>
    )
}

const Marketplace = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Fragment>
            <Head>
                <title>SkyTrade - Marketplace</title>
            </Head>
            {isLoading && createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
            {isLoading && createPortal(<Spinner />, document.getElementById('backdrop-root'))}

            <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
                <Sidebar />
                <div className="w-full h-full flex flex-col">
                    <PageHeader pageTitle={'Marketplace'} />
                    <section className="relative w-full h-full overflow-y-scroll py-[23px] px-[14px] flex mb-[78.22px] md:mb-0 flex-col items-center">
                        <div className="py-[20.5px] text-white font-normal text-base bg-[#222222] rounded-[20px] h-[66px] max-w-[340px] w-full text-center" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>SkyMarket Hub</div>
                        <p className="mx-[15px] mt-[23px] mb-[27px] text-center text-[15px] font-normal text-[#222222]">Explore and Own Low-Altitude Airspaces, Your Gateway to Aerial Freedom.</p>
                        <div className="flex gap-[11px] w-full h-full flex-wrap">
                            <Item title={'Buy Airspace'} imageUrl={'/images/buy.jpg'} link={''} style={'bg-right'} />
                            <Item title={'Rent Airspace'} imageUrl={'/images/rent-airspace.jpg'} link={'/homepage/rent'} />
                            <Item title={'Funds'} imageUrl={'/images/funds.png'} link={'/homepage/funds'} text={USDollar.format(0)} />
                            <Item title={'Portfolio'} imageUrl={'/images/portfolio.jpg'} link={'/homepage/portfolio'} />
                        </div>
                    </section>
                </div>
            </div>
        </ Fragment>
    )
}

export default Marketplace;