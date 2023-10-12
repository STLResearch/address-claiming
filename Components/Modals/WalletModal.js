import Image from "next/image";

const WalletModal = (props) => {
    return <div className="bg-white rounded px-12 fixed z-20 overflow-y-auto pb-10" style={{width: "500px", height: "90vh", maxHeight: "529px",
            top: "5vh",  // This is for live environment
            left: "calc(50% - 250px)", 
        }}>
            <div className="mt-24 flex flex-col items-center">
                <div className="flex flex-row justify-center items-center mb-6" style={{width: "49px", height: "49px", background: "rgba(0, 0, 0, 0.15)", borderRadius: "50%", border: "1px dotted #0653EA"}}>
                    <div className="flex flex-row justify-center items-center" style={{width: "41px", height: "41px", background: "white", borderRadius: "50%"}}> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M10.7516 16.8594V18.8894C10.7516 20.6094 9.15158 21.9994 7.18158 21.9994C5.21158 21.9994 3.60156 20.6094 3.60156 18.8894V16.8594C3.60156 18.5794 5.20158 19.7994 7.18158 19.7994C9.15158 19.7994 10.7516 18.5694 10.7516 16.8594Z" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10.7498 14.1097C10.7498 14.6097 10.6098 15.0697 10.3698 15.4697C9.77981 16.4397 8.5698 17.0497 7.1698 17.0497C5.7698 17.0497 4.55979 16.4297 3.96979 15.4697C3.72979 15.0697 3.58984 14.6097 3.58984 14.1097C3.58984 13.2497 3.98982 12.4797 4.62982 11.9197C5.27982 11.3497 6.16979 11.0098 7.15979 11.0098C8.14979 11.0098 9.03982 11.3597 9.68982 11.9197C10.3498 12.4697 10.7498 13.2497 10.7498 14.1097Z" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10.7516 14.11V16.86C10.7516 18.58 9.15158 19.8 7.18158 19.8C5.21158 19.8 3.60156 18.57 3.60156 16.86V14.11C3.60156 12.39 5.20158 11 7.18158 11C8.17158 11 9.06161 11.35 9.71161 11.91C10.3516 12.47 10.7516 13.25 10.7516 14.11Z" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22.0002 10.9692V13.0292C22.0002 13.5792 21.5602 14.0292 21.0002 14.0492H19.0402C17.9602 14.0492 16.9702 13.2592 16.8802 12.1792C16.8202 11.5492 17.0602 10.9592 17.4802 10.5492C17.8502 10.1692 18.3602 9.94922 18.9202 9.94922H21.0002C21.5602 9.96922 22.0002 10.4192 22.0002 10.9692Z" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 10.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H13.5" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                <p className="text-xl">Choose {props.method} option</p>
                <p className="text-sm text-center" style={{width: "272px"}}>Select a method of {props.method} from the following options provided below</p>
            </div>
            <div className="flex flex-col items-center mt-14 gap-2.5">
                <button onClick={props.navigate} className="rounded transition-all duration-500 ease-in-out hover:bg-bleach-blue" style={{width: "328px", height: "50px", border: "0.2px solid #0653EA"}}>
                    <p className="text-sml font-semibold">Direct {props.form} a crypto wallet</p>
                    <p className="text-sm">e.g. Blockchain, Binance, Coinbase  </p>
                </button>
                <button className="rounded flex flex-col items-center justify-center transition-all duration-500 ease-in-out hover:bg-bleach-blue" style={{width: "328px", height: "50px", border: "0.2px solid #0653EA"}}>
                    <Image src="/images/Ramp.png" alt="Ramp logo" height={18} width={77} />
                    <p className="text-sm">e.g Stripe, Paypal, Visa card, Master card...</p>
                </button>
                <button className="rounded flex flex-col items-center justify-center transition-all duration-500 ease-in-out hover:bg-bleach-blue" style={{width: "328px", height: "50px", border: "0.2px solid #0653EA"}}>
                    <Image src="/images/Transak.png" alt="Ramp logo" height={18} width={77} />
                    <p className="text-sm">e.g Stripe, Paypal, Visa card, Master card...</p>
                </button>
            </div>
    </div>
}

export default WalletModal;