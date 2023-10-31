import Image from "next/image";
import { useRouter } from "next/router";

const Navbar = (props) => {
    const router = useRouter();

    return  <header style={{width: "calc(100vw - 257px)", height: "91px"}} className="bg-white p-0">
    <nav className={`container mx-auto my-0 flex flex-row ${props.children ? "justify-between" : "justify-end"} items-center`}>
        {/* <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-11 right-2 cursor-pointer" width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.7118 11.7481C8.12238 13.822 4.33202 13.6588 1.93164 11.2584C-0.643879 8.6829 -0.643879 4.50716 1.93164 1.93164C4.50716 -0.64388 8.68289 -0.643879 11.2584 1.93164C13.6588 4.33202 13.822 8.12238 11.7481 10.7118L16.7854 15.7491C17.0715 16.0352 17.0715 16.4992 16.7854 16.7854C16.4992 17.0715 16.0352 17.0715 15.7491 16.7854L10.7118 11.7481ZM2.96795 10.2221C0.964766 8.21893 0.964766 4.97113 2.96795 2.96795C4.97113 0.964767 8.21892 0.964767 10.2221 2.96795C12.2238 4.96966 12.2253 8.21416 10.2265 10.2177C10.225 10.2192 10.2236 10.2206 10.2221 10.2221C10.2206 10.2236 10.2192 10.225 10.2177 10.2265C8.21416 12.2253 4.96966 12.2238 2.96795 10.2221Z" fill="#252530" fillOpacity="0.55"/>
            </svg>
            <input type="text" className="rounded-md my-7 ps-3 ms-5 focus:outline-blue-200" style={{width: "433px", height: "47px", border: "1px solid rgba(37, 37, 48, 0.55)"}} />
        </div> */}
        {props.children}
        <div className={`flex flex-row justify-center items-center me-5 ${!props.children && "mt-7"} cursor-pointer`}>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style={{background: "#EFEFF9", borderRadius: "50%", padding: '1px 5px'}} viewBox="0 0 16 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.58319 1C8.58319 0.447715 8.13548 0 7.58319 0C7.03091 0 6.58319 0.447715 6.58319 1V1.75H6.02577C3.8007 1.75 1.9591 3.48001 1.82021 5.70074L1.5992 9.2342C1.51494 10.5814 1.06266 11.8797 0.291595 12.9876C-0.405087 13.9886 0.215133 15.3712 1.42606 15.5165L4.83319 15.9254V17C4.83319 18.5188 6.06441 19.75 7.58319 19.75C9.10197 19.75 10.3332 18.5188 10.3332 17V15.9254L13.7403 15.5165C14.9512 15.3712 15.5715 13.9886 14.8748 12.9876C14.1037 11.8797 13.6514 10.5814 13.5672 9.2342L13.3462 5.70074C13.2073 3.48001 11.3657 1.75 9.1406 1.75H8.58319V1ZM6.02577 3.25C4.59277 3.25 3.40673 4.36417 3.31728 5.79438L3.09628 9.32784C2.99488 10.949 2.45063 12.5112 1.52278 13.8444C1.47243 13.9168 1.51725 14.0167 1.60478 14.0272L5.34244 14.4757C6.83093 14.6543 8.33544 14.6543 9.82393 14.4757L13.5616 14.0272C13.6491 14.0167 13.6939 13.9168 13.6436 13.8444C12.7157 12.5112 12.1715 10.949 12.0701 9.32784L11.8491 5.79438C11.7596 4.36417 10.5736 3.25 9.1406 3.25H6.02577ZM7.58319 18.25C6.89283 18.25 6.33319 17.6904 6.33319 17V16.25H8.83319V17C8.83319 17.6904 8.27355 18.25 7.58319 18.25Z" fill="#252530" fillOpacity="0.55"/>
            </svg> */}
            <Image src="/images/user-icon.png" alt="icon" className="ms-6" width={30} height={30} />
            <div onClick={() => router.push("/homepage/settings")} className="me-5 ms-2">
                <p className="font-base font-medium">{props.name}</p>
                {props.categoryId === 0 &&
                    <div className={`me-1.5 flex flex-row items-center p-2 justify-center font-semibold gap-1 ${props.status === 2 ? "bg-bleach-green" : props.status === 1 ? "bg-light-yellow" : "bg-bleach-red"}`} style={{width: "70px", height: "12px", borderRadius:"3px", }}>
                        {/* <p className="text-xxs text-light-green">verified</p> */}
                        <p className={`text-xxs text-center ${props.status === 2 ? "text-light-green" : props.status === 1 ? "text-dark-yellow" : "text-light-red-100"}`}>
                            {props.status === 0 ? "NotAttempted" : props.status === 1 ? "Pending" : 
                                        props.status === 2 ? "Approved" : "rejected"}</p>
                    </div>
                }
                {props.categoryId === 1 &&
                    <div className={`me-1.5 flex flex-row items-center p-2 justify-center font-semibold gap-1 ${props.status === 2 ? "bg-bleach-green" : "bg-light-yellow"}`} style={{width: "70px", height: "12px", borderRadius:"3px", }}>
                        {/* <p className="text-xxs text-light-green">verified</p> */}
                        <p className={`text-xxs text-center ${props.status === 2 ? "text-light-green" : "text-dark-yellow"}`}>{props.status !== 2 ? "Pending" : "Approved"}</p>
                    </div>
                }
                {/* <div className="flex flex-row items-center">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                            <path d="M5.95691 0.261597C5.75333 -0.0871984 5.24667 -0.0871997 5.04309 0.261597L3.60935 2.718C3.50878 2.89031 3.33495 3.00789 3.13682 3.03764L0.449897 3.44109C-0.0013905 3.50885 -0.15969 4.07531 0.191767 4.36479L2.19341 6.01343C2.3787 6.16604 2.46582 6.40676 2.42081 6.64175L1.89721 9.37536C1.81444 9.80749 2.27075 10.1432 2.66227 9.93829L5.19235 8.61389C5.38492 8.51309 5.61508 8.51309 5.80765 8.61389L8.33773 9.93829C8.72925 10.1432 9.18556 9.80749 9.10279 9.37536L8.57919 6.64175C8.53418 6.40676 8.6213 6.16604 8.80659 6.01343L10.8082 4.36479C11.1597 4.07532 11.0014 3.50886 10.5501 3.44109L7.86318 3.03764C7.66505 3.00789 7.49122 2.89031 7.39065 2.718L5.95691 0.261597Z" fill="#FFD037"/>
                        </svg>
                    </div>
                    <p className="text-sm"><span className="font-bold">4.8</span> Rating</p>
                </div> */}
            </div>
        </div>
    </nav>  
</header>
}

export default Navbar;