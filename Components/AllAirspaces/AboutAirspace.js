const AboutAirspace = (props) => {
    return <div className="absolute rounded-md bg-white top-5 py-5 px-1" style={{width: "339px", height: "379px", left: "380px"}}>
        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M11.0303 8.53033C11.3232 8.23744 11.3232 7.76256 11.0303 7.46967C10.7374 7.17678 10.2626 7.17678 9.96967 7.46967L5.96967 11.4697C5.82322 11.6161 5.75 11.8081 5.75 12C5.75 12.1017 5.77024 12.1987 5.80691 12.2871C5.84351 12.3755 5.89776 12.4584 5.96967 12.5303L9.96967 16.5303C10.2626 16.8232 10.7374 16.8232 11.0303 16.5303C11.3232 16.2374 11.3232 15.7626 11.0303 15.4697L8.31066 12.75H18C18.4142 12.75 18.75 12.4142 18.75 12C18.75 11.5858 18.4142 11.25 18 11.25H8.31066L11.0303 8.53033Z" fill="#252530"/>
                    </svg>
                </button>
                <h2 className="font-bold">AirSpace Title</h2>
            </div>
            <button onClick={props.closeDetails}>
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path d="M12.7578 12.7285L21.2431 21.2138" stroke="#252530" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.7569 21.2138L21.2422 12.7285" stroke="#252530" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </div>
        <div className="flex flex-row justify-center gap-7 mt-8 pb-2.5 items-center">
            <button className="relative" onClick={props.viewAirspace}>
                <p className="font-bold ">Overview</p>
            </button>
            {/* <button className="relative" onClick={props.viewAirspaceReview}>
                <p className="font-bold">Reviews</p>
            </button> */}
            <button className="relative" onClick={props.aboutAirspace}>
                <p className="font-bold text-dark-blue">About</p>
                <div style={{height: "4px", width: "30px", bottom: "-10px", left: "7%"}} className="bg-dark-blue absolute rounded-t-md"></div>
            </button>
        </div>
        <div className="flex flex-row justify-center items-center py-7">
            <p className="text-dark-blue"><span className="font-bold">$3.00</span>/hr</p>
        </div>
        <div style={{width: "299px", border: "1px solid blue"}} className="p-2.5 rounded mx-5 mb-4">
            <h3 className="font-bold text-brown">Facilities</h3>
            <p className="text-xs" style={{fontSize: "11px", color: "rgba(63, 61, 86, 0.75)"}}><span className="font-bold">Landing Deck: </span>Place to land your UAV safely</p>
            <p className="text-xs" style={{fontSize: "11px", color: "rgba(63, 61, 86, 0.75)"}}><span className="font-bold">Charging Station: </span>We offer a place to charge your UAV</p>
            <p className="text-xs" style={{fontSize: "11px", color: "rgba(63, 61, 86, 0.75)"}}><span className="font-bold">Storage Hub: </span>Warehousing for UAV packages</p>
        </div>
        <div className="flex flex-row items-center gap-7 justify-center">
            <div className="flex flex-col justify-center items-center">
                <button style={{width: "35px", height: "35px", borderRadius: "50%"}} className="bg-dark-blue p-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10.433 14.2754C10.1464 14.2754 9.8597 14.2154 9.62637 14.1021L6.12637 12.3487C5.92637 12.2487 5.53303 12.2554 5.3397 12.3687L3.76637 13.2687C3.08637 13.6554 2.38637 13.7087 1.8597 13.3954C1.32637 13.0887 1.02637 12.4621 1.02637 11.6754V5.19539C1.02637 4.58872 1.42637 3.90206 1.95303 3.60206L4.8397 1.94872C5.32637 1.66872 6.06637 1.64872 6.56637 1.90206L10.0664 3.65539C10.2664 3.75539 10.653 3.74206 10.853 3.63539L12.4197 2.74206C13.0997 2.35539 13.7997 2.30206 14.3264 2.61539C14.8597 2.92206 15.1597 3.54872 15.1597 4.33539V10.8221C15.1597 11.4287 14.7597 12.1154 14.233 12.4154L11.3464 14.0687C11.093 14.2021 10.7597 14.2754 10.433 14.2754ZM5.7597 11.2821C6.04637 11.2821 6.33303 11.3421 6.56637 11.4554L10.0664 13.2087C10.2664 13.3087 10.653 13.2954 10.853 13.1887L13.7397 11.5354C13.953 11.4154 14.1597 11.0554 14.1597 10.8154V4.32872C14.1597 3.90872 14.0397 3.59539 13.8197 3.47539C13.6064 3.35539 13.273 3.40206 12.913 3.60872L11.3464 4.50206C10.8597 4.78206 10.1197 4.80206 9.6197 4.54872L6.1197 2.79539C5.9197 2.69539 5.53303 2.70872 5.33303 2.81539L2.44637 4.46872C2.23303 4.58872 2.02637 4.94872 2.02637 5.19539V11.6821C2.02637 12.1021 2.14637 12.4154 2.3597 12.5354C2.57303 12.6621 2.90637 12.6087 3.27303 12.4021L4.8397 11.5087C5.0997 11.3554 5.43303 11.2821 5.7597 11.2821Z" fill="white"/>
                        <path d="M5.70606 11.8327C5.43272 11.8327 5.20605 11.606 5.20605 11.3327V2.66602C5.20605 2.39268 5.43272 2.16602 5.70606 2.16602C5.97939 2.16602 6.20606 2.39268 6.20606 2.66602V11.3327C6.20606 11.606 5.97939 11.8327 5.70606 11.8327Z" fill="white"/>
                        <path d="M10.4873 13.8321C10.214 13.8321 9.9873 13.6054 9.9873 13.3321V4.41211C9.9873 4.13878 10.214 3.91211 10.4873 3.91211C10.7606 3.91211 10.9873 4.13878 10.9873 4.41211V13.3321C10.9873 13.6054 10.7606 13.8321 10.4873 13.8321Z" fill="white"/>
                    </svg>
                </button>
                <p className="text-center text-dark-blue text-sm">3D Map</p>
            </div>
            <div className="flex flex-col justify-center items-center">
                <button style={{width: "35px", height: "35px", borderRadius: "50%", border: "1px solid blue"}} className="bg-white p-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M7.5 14.2188C3.79375 14.2188 0.78125 11.2063 0.78125 7.5C0.78125 3.79375 3.79375 0.78125 7.5 0.78125C11.2063 0.78125 14.2188 3.79375 14.2188 7.5C14.2188 11.2063 11.2063 14.2188 7.5 14.2188ZM7.5 1.71875C4.3125 1.71875 1.71875 4.3125 1.71875 7.5C1.71875 10.6875 4.3125 13.2813 7.5 13.2813C10.6875 13.2813 13.2813 10.6875 13.2813 7.5C13.2813 4.3125 10.6875 1.71875 7.5 1.71875Z" fill="#0653EA"/>
                        <path d="M9.81914 9.95586C9.73789 9.95586 9.65664 9.93711 9.58164 9.88711L7.64414 8.73086C7.16289 8.44336 6.80664 7.81211 6.80664 7.25586V4.69336C6.80664 4.43711 7.01914 4.22461 7.27539 4.22461C7.53164 4.22461 7.74414 4.43711 7.74414 4.69336V7.25586C7.74414 7.48086 7.93164 7.81211 8.12539 7.92461L10.0629 9.08086C10.2879 9.21211 10.3566 9.49961 10.2254 9.72461C10.1316 9.87461 9.97539 9.95586 9.81914 9.95586Z" fill="#0653EA"/>
                    </svg>
                </button>
                <p className="text-center text-dark-blue text-sm">Rent</p>
            </div>
            <div className="flex flex-col justify-center items-center">
                <button style={{width: "35px", height: "35px", borderRadius: "50%", border: "1px solid blue"}} className="bg-white p-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M11.3688 11.0938H4.7125C4.09375 11.0938 3.5 10.8313 3.08125 10.375C2.6625 9.91875 2.45 9.30625 2.5 8.6875L3.01875 2.4625C3.0375 2.26875 2.96875 2.08125 2.8375 1.9375C2.70625 1.79375 2.525 1.71875 2.33125 1.71875H1.25C0.99375 1.71875 0.78125 1.50625 0.78125 1.25C0.78125 0.99375 0.99375 0.78125 1.25 0.78125H2.3375C2.79375 0.78125 3.225 0.974998 3.53125 1.30625C3.7 1.49375 3.825 1.7125 3.89375 1.95625H11.7C12.3313 1.95625 12.9125 2.20625 13.3375 2.65625C13.7562 3.1125 13.9688 3.70625 13.9188 4.3375L13.5812 9.025C13.5125 10.1688 12.5125 11.0938 11.3688 11.0938ZM3.925 2.8875L3.4375 8.76249C3.40625 9.12499 3.525 9.46874 3.76875 9.73749C4.0125 10.0062 4.35 10.15 4.7125 10.15H11.3688C12.0188 10.15 12.6062 9.6 12.6562 8.95L12.9937 4.2625C13.0187 3.89375 12.9 3.54376 12.6562 3.28751C12.4125 3.02501 12.075 2.88124 11.7062 2.88124H3.925V2.8875Z" fill="#0653EA"/>
                        <path d="M10.1562 14.2188C9.46875 14.2188 8.90625 13.6562 8.90625 12.9688C8.90625 12.2812 9.46875 11.7188 10.1562 11.7188C10.8438 11.7188 11.4062 12.2812 11.4062 12.9688C11.4062 13.6562 10.8438 14.2188 10.1562 14.2188ZM10.1562 12.6562C9.98125 12.6562 9.84375 12.7938 9.84375 12.9688C9.84375 13.1437 9.98125 13.2812 10.1562 13.2812C10.3312 13.2812 10.4688 13.1437 10.4688 12.9688C10.4688 12.7938 10.3312 12.6562 10.1562 12.6562Z" fill="#0653EA"/>
                        <path d="M5.15625 14.2188C4.46875 14.2188 3.90625 13.6562 3.90625 12.9688C3.90625 12.2812 4.46875 11.7188 5.15625 11.7188C5.84375 11.7188 6.40625 12.2812 6.40625 12.9688C6.40625 13.6562 5.84375 14.2188 5.15625 14.2188ZM5.15625 12.6562C4.98125 12.6562 4.84375 12.7938 4.84375 12.9688C4.84375 13.1437 4.98125 13.2812 5.15625 13.2812C5.33125 13.2812 5.46875 13.1437 5.46875 12.9688C5.46875 12.7938 5.33125 12.6562 5.15625 12.6562Z" fill="#0653EA"/>
                        <path d="M13.125 5.46875H5.625C5.36875 5.46875 5.15625 5.25625 5.15625 5C5.15625 4.74375 5.36875 4.53125 5.625 4.53125H13.125C13.3813 4.53125 13.5938 4.74375 13.5938 5C13.5938 5.25625 13.3813 5.46875 13.125 5.46875Z" fill="#0653EA"/>
                    </svg>
                </button>
                <p className="text-center text-dark-blue text-sm">Sell</p>
            </div>
        </div>
    </div>
}

export default AboutAirspace;