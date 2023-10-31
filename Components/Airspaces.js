import Image from "next/image"
import { useDispatch, useSelector } from "react-redux";
import { useVerification } from "@/hooks/useVerification";

import { counterActions } from "@/store/store";

const Airspaces = (props) => {
    const dispatch = useDispatch();
    const { verificationCheck } = useVerification();

    return <>
        <div className="bg-white absolute top-5 z-10" style={{width: "340px", height: "80%", left: "20px", borderRadius: "5px"}}>
        <div className="flex flex-row">
            {/* <button onClick={props.showAllAirspace} className={`${props.airspace == "all" && "bg-dark-blue text-white"} font-bold hover:bg-dark-blue hover:text-white`} style={{width: "170px", height: "40px", borderRadius: "5px 0px 0px 0px"}}>Airspaces</button> */}
            <button onClick={props.showMyAirspace} className={`${props.airspace == "mine" && "bg-dark-blue text-white"} font-bold hover:bg-dark-blue hover:text-white`} style={{width: "100%", height: "40px", borderRadius: "5px 5px 0px 0px"}}>Airspaces</button>
        </div>
        <div className="flex flex-row justify-center" style={{width: "340px", height: "100%", background: "linear-gradient(180deg, #0653EA, white)"}}>
            {props.allAirspace && <div className="bg-white flex pb-10 overflow-y-auto flex-col items-center" style={{width: "99%", height: "100%", marginTop: "2px"}}>
                {props.children}
            </div>}

            {props.myAirspace && <div className="bg-white flex overflow-y-auto flex-col items-center" style={{width: "99%", height: "100%", marginTop: "2px"}}>
                        <button onClick={props.checkUser} className="text-sm bg-milk mx-auto mt-5 flex flex-row justify-center items-center gap-2 font-medium text-light-dark rounded transition-all duration-500 ease-in-out hover:bg-blue-200 py-2" style={{width: "205px"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M1.33301 8.00065C1.33301 4.31865 4.31767 1.33398 7.99967 1.33398C11.6817 1.33398 14.6663 4.31865 14.6663 8.00065C14.6663 11.6827 11.6817 14.6673 7.99967 14.6673C4.31767 14.6673 1.33301 11.6827 1.33301 8.00065ZM7.99967 2.66732C6.58519 2.66732 5.22863 3.22922 4.22844 4.22941C3.22824 5.22961 2.66634 6.58616 2.66634 8.00065C2.66634 9.41514 3.22824 10.7717 4.22844 11.7719C5.22863 12.7721 6.58519 13.334 7.99967 13.334C9.41416 13.334 10.7707 12.7721 11.7709 11.7719C12.7711 10.7717 13.333 9.41514 13.333 8.00065C13.333 6.58616 12.7711 5.22961 11.7709 4.22941C10.7707 3.22922 9.41416 2.66732 7.99967 2.66732Z" fill="#1E1E1E"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M8.66667 4.66667C8.66667 4.48986 8.59643 4.32029 8.4714 4.19526C8.34638 4.07024 8.17681 4 8 4C7.82319 4 7.65362 4.07024 7.5286 4.19526C7.40357 4.32029 7.33333 4.48986 7.33333 4.66667V7.33333H4.66667C4.48986 7.33333 4.32029 7.40357 4.19526 7.5286C4.07024 7.65362 4 7.82319 4 8C4 8.17681 4.07024 8.34638 4.19526 8.4714C4.32029 8.59643 4.48986 8.66667 4.66667 8.66667H7.33333V11.3333C7.33333 11.5101 7.40357 11.6797 7.5286 11.8047C7.65362 11.9298 7.82319 12 8 12C8.17681 12 8.34638 11.9298 8.4714 11.8047C8.59643 11.6797 8.66667 11.5101 8.66667 11.3333V8.66667H11.3333C11.5101 8.66667 11.6797 8.59643 11.8047 8.4714C11.9298 8.34638 12 8.17681 12 8C12 7.82319 11.9298 7.65362 11.8047 7.5286C11.6797 7.40357 11.5101 7.33333 11.3333 7.33333H8.66667V4.66667Z" fill="#1E1E1E"/>
                            </svg>
                            <p>Claim Airspace</p>
                        </button>

                        {props.children}
                    </div>                            
            }
        </div>
        <div className="bg-white rounded-b-md text-center flex flex-row items-center" style={{width: "100%", height: "30px"}}>
            {/* <button className="mx-auto" style={{borderRadius: "50%", background: "aliceblue", width: "40px", height: "40px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M27.5502 14.9501C28.0384 15.4383 28.0384 16.2297 27.5502 16.7179L20.8836 23.3845C20.3954 23.8727 19.6039 23.8727 19.1158 23.3845L12.4491 16.7179C11.961 16.2297 11.961 15.4383 12.4491 14.9501C12.9373 14.4619 13.7287 14.4619 14.2169 14.9501L19.9997 20.7329L25.7825 14.9501C26.2706 14.4619 27.0621 14.4619 27.5502 14.9501Z" fill="#0653EA"/>
                </svg>
            </button> */}
        </div>
    </div></>
}

export default Airspaces;