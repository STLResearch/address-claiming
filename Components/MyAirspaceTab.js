import Image from "next/image";
import { useEffect, useState } from "react";

const MyAirspaceTab = (props) => {
   


    return <button onClick={props.viewMyAirspace} className="bg-white mt-5 pb-2 transition-all duration-500 ease-in-out hover:bg-blue-100" style={{width: "299px", borderRadius: "3px", border: "1px solid blue"}}>
        <div className="flex flex-row items-center justify-between pb-5" style={{borderBottom: "1px solid blue"}}>
            <div className="flex flex-row mt-5 ms-2 items-center gap-2 text-sm font-medium font-sans">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.1875 6.75C6.1875 5.1967 7.4467 3.9375 9 3.9375C10.5533 3.9375 11.8125 5.1967 11.8125 6.75C11.8125 8.3033 10.5533 9.5625 9 9.5625C7.4467 9.5625 6.1875 8.3033 6.1875 6.75ZM9 5.0625C8.06802 5.0625 7.3125 5.81802 7.3125 6.75C7.3125 7.68198 8.06802 8.4375 9 8.4375C9.93198 8.4375 10.6875 7.68198 10.6875 6.75C10.6875 5.81802 9.93198 5.0625 9 5.0625Z" fill="black"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.09231 6.09543C4.29763 3.60452 6.37917 1.6875 8.87852 1.6875H9.12149C11.6208 1.6875 13.7024 3.60452 13.9077 6.09543C14.0178 7.43063 13.6053 8.75644 12.7573 9.79359L10.0612 13.0908C9.51271 13.7616 8.48729 13.7616 7.93884 13.0908L5.24274 9.79359C4.39468 8.75644 3.98225 7.43063 4.09231 6.09543ZM8.87852 2.8125C6.96465 2.8125 5.37073 4.28045 5.21351 6.18785C5.12739 7.23257 5.4501 8.26994 6.11366 9.08146L8.80976 12.3787C8.90808 12.499 9.09192 12.499 9.19025 12.3787L11.8863 9.08146C12.5499 8.26994 12.8726 7.23257 12.7865 6.18785C12.6293 4.28045 11.0354 2.8125 9.12149 2.8125H8.87852Z" fill="black"/>
                    <path d="M5.75312 12.2516C5.89205 11.9737 5.77942 11.6358 5.50156 11.4969C5.2237 11.358 4.88582 11.4706 4.74689 11.7484L3.24689 14.7484C3.1597 14.9228 3.16902 15.1299 3.27151 15.2957C3.374 15.4616 3.55505 15.5625 3.75 15.5625H14.25C14.445 15.5625 14.626 15.4616 14.7285 15.2957C14.831 15.1299 14.8403 14.9228 14.7531 14.7484L13.2531 11.7484C13.1142 11.4706 12.7763 11.358 12.4984 11.4969C12.2206 11.6358 12.108 11.9737 12.2469 12.2516L13.3399 14.4375H4.66014L5.75312 12.2516Z" fill="black"/>
                </svg>   
                <p>{props.title}</p> 
            </div> 
            {props.propertyStatus !== "NotVerified" &&
                <div className="mt-5 me-1.5 flex flex-row items-center justify-center font-semibold p-2 gap-1" style={{height: "21px", borderRadius:"3px", background: `${!props.status ? "#BED9C7" : "#FFC7C2"}`, }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                        <circle cx="3" cy="3" r="3" fill={`${!props.status ? "#1A572E" : "#C80000"} `}/>
                    </svg>
                    <p style={{color: `${!props.status ? "#1A572E" : "#C80000"}`}} className="text-sm">{props.status ? "No-Fly Zone " : "Available"}</p>
                </div>
            }
            {props.propertyStatus === "NotVerified" && 
                <div className="mt-5 me-1.5 flex flex-row items-center justify-center font-semibold p-1 gap-1" style={{borderRadius:"3px", background: "#FFD037"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                        <circle cx="3" cy="3" r="3" fill=" #7a6626" />
                    </svg>
                    <p style={{color: "#7a6626"}} className="text-xs">Pending review</p>
                </div>
            }
        </div>
        {/* <div className="flex flex-row items-center mt-2 text-xs ms-2">
            <p className="text-red-600">4.5</p>
            <div className="flex flex-row items-center">
                <Image src="/images/Star.png" alt="star icon" width={12} height={12} />
                <Image src="/images/Star.png" alt="star icon" width={12} height={12} />
                <Image src="/images/Star.png" alt="star icon" width={12} height={12} />
                <Image src="/images/Star.png" alt="star icon" width={12} height={12} />
                <Image src="/images/Star-half.png" alt="star icon" width={12} height={12} />
            </div>
            <p>(6)</p>
        </div> */}
        <div className="text-xs text-light-brown text-start ms-2">
            <p><span className="font-semibold">Resident Name: </span>{props.name}</p>
            <p><span className="font-semibold">Address: </span>{props.address}</p>
            {/* <p><span className="font-semibold">(e) Resident Identification: </span>{props.identification}</p> */}
        </div>
    </button>
}

export default MyAirspaceTab;