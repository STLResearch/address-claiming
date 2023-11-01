import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import Script from "next/script";

import Backdrop from "@/Components/Backdrop";
import Spinner from "@/Components/Spinner";
import { Fragment } from "react";
import logo from "../../../../public/images/logo.jpg"

const IndividualSignup = () => {
    const newsletterRef = useRef();
    const nameRef = useRef();
    const phoneNumberRef = useRef();
    const router = useRouter();

    const [nameValid, setNameValid] = useState(true);
    const [phoneNumberValid, setPhoneNumberValid] = useState(true);
    const [newsletter, setnewsletter] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoad, setPageLoad] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if(!category.categoryId) {
                router.replace("/auth/join");
                return;
            }
        }

        setPageLoad(false);
    }, []);

    const category = useSelector(state => state.value.category);
    const web3 = useSelector(state => state.value.web3);
    const token = web3.token;


    const newsletterHandler = () => {
        setnewsletter(prev => !prev)
    }

    const returnHandler = (e) => {
        e.preventDefault();
        router.push("/auth/join")
    }

    const formSubmitHandler = (e) => {
        e.preventDefault();

        const name = nameRef.current.value;
        const phoneNumber = phoneNumberRef.current.value;

        if(!name) {
            setNameValid(false);
            swal({
                title: "oops!",
                text: "Kindly complete all required fields",
                timer: 2000
              });
            return;
        }

        if(!phoneNumber || phoneNumber.charAt(0) !== "+") {
            setPhoneNumberValid(false);
            swal({
                title: "Oops!",
                text: "Invalid phone number. Ensure to include country code starting with +",
                // timer: 3000
              });
            return;
        }


        const userInfo = {
            ...category,
            categoryId: +category.categoryId,
            name,
            phoneNumber: phoneNumber,
            newsletter
        }


        setIsLoading(true);


        fetch(`/api/proxy?${Date.now()}`, {
            method: "POST",
            body: JSON.stringify(userInfo),
            headers: {
                "Content-Type": "application/json",
                uri: "/users/create",
                proxy_to_method: "POST",
            }
        }).then(res => {
                if(!res.ok || res.statusCode === 500) {
                    return res.json()
                    .then(errorData => {
                        swal({
                            title: "Sorry!",
                            text: `${errorData.errorMessage}`,
                            });
                        throw new Error(errorData.errorMessage);
                    });
                }
                return res.json()
                .then((response) => {
                    if(response.statusCode === 500) {
                        throw new Error("something went wrong");
                    };

                    setError(false);
                    swal({
                        title: "Submitted",
                        text: "User registered successfully. You will now be signed in",
                        icon: "success",
                        button: "Ok"
                    }).then(() => {
                        localStorage.setItem("openlogin_store", JSON.stringify({
                            sessionId: token.sessionId
                        }));
                        // setIsLoading(false);
                        nameRef.current.value = ""
                        phoneNumberRef.current.value = ""
                        router.replace("/homepage/dashboard");
                    })
                })
        })
        .catch(error => {
            console.log(error);
            setError(error);
            setIsLoading(false);
        });
    }

    if(pageLoad) {
        return <Spinner />
    }

    return <Fragment>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C0J4J56QW5" />
        <Script id="google-analytics">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', 'G-C0J4J56QW5');
            `}
        </Script>
        
        {isLoading && createPortal(<Backdrop />, document.getElementById("backdrop-root"))}
        {isLoading && createPortal(<Spinner />, document.getElementById("backdrop-root"))}
        <form onSubmit={formSubmitHandler} className="bg-white mx-auto px-auto font-sans relative" style={{width: "680px", height: "697px", padding: "93px 142px"}}>
            <button onClick={returnHandler} className="flex flex-row items-center gap-2 absolute top-8 left-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M0.999999 4L4.33333 7M0.999999 4L4.33333 1M0.999999 4L13 4" stroke="#252530" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Back</p>
            </button>
            {/* {error && <p className="text-sm mx-auto text-red-600">{error}</p>} */}
            <Image src={logo} alt="Company's logo" width={172} height={61} />
            <p className=" text-dark text-2xl font-medium w-64" style={{marginTop: "28px"}}>Individual Sign Up</p>
            <div className="mt-3.5 relative">
                <label className="text-sm font-normal text-light-brown">Name <span className="text-red-600">*</span></label> <br />
                <input type="text" ref={nameRef} onChange={() => setNameValid(true)} className="bg-light-grey rounded-md focus:outline-blue-200 placeholder:text-light-brown placeholder:font-medium font-sans" placeholder="Name" style={{width: "396px",  height: "43px", paddingLeft: "14px", border: "0.5px solid rgba(0, 0, 0, 0.50)",}} />
                {!nameValid && <p className="absolute top-1 right-0 text-sm text-red-600">name cannot be empty</p>}
            </div>
            
           
            <div className="my-3.5 relative" style={{width: "396px",  height: "43px"}}>
                <label className="text-sm font-normal" style={{color: "rgba(0, 0, 0, 0.50)"}} >Phone Number<span className="text-red-600">*</span></label> <br />
                <input ref={phoneNumberRef} onChange={() => setPhoneNumberValid(true)} type="text" min="0" placeholder="Enter your Phone number" className="bg-light-grey rounded-md font-sans placeholder:text-light-brown placeholder:font-medium focus:outline-blue-200" style={{width: "396px", height: "43px", border: "0.5px solid rgba(0, 0, 0, 0.50)", paddingLeft: "14px",}} />
                {!phoneNumberValid && <p className="absolute top-1 right-0 text-sm text-red-600">invalid phone number</p>}
            </div>
    
            {/* <div className="mt-10">
                <label className="text-sm font-normal" style={{color: "rgba(0, 0, 0, 0.50)"}} >Address*<span className="text-red-600">*</span></label> <br />
                <input type="email" placeholder="Address" className="bg-light-grey rounded-md focus:outline-blue-200 placeholder:text-light-brown placeholder:font-medium font-sans" style={{width: "396px",  height: "43px", border: "0.5px solid rgba(0, 0, 0, 0.50)", paddingLeft: "14px",}} />
            </div> */}
            {/* <div className="flex flex-row gap-3" style={{width: "396px",  height: "43px"}}>
                <div className="mt-3.5 relative">
                    <label className="text-sm font-normal" style={{color: "rgba(0, 0, 0, 0.50)"}} >Password<span className="text-red-600">*</span></label> <br />
                    <input type="password" placeholder="Password" className="bg-light-grey rounded-md font-sans placeholder:text-light-brown placeholder:font-medium focus:outline-blue-200" style={{width: "192px",  height: "43px", border: "0.5px solid rgba(0, 0, 0, 0.50)", paddingLeft: "14px",}} />
                    <Image src="/images/view-password.png" alt="" width={14} height={12} className="absolute top-10 right-3 hover:cursor-pointer" />
                </div>
                <div className="mt-3.5 relative">
                    <label className="text-sm font-normal" style={{color: "rgba(0, 0, 0, 0.50)"}} >Confirm Password<span className="text-red-600">*</span></label> <br />
                    <input type="password" placeholder="Confirm Password" className="bg-light-grey rounded-md font-sans placeholder:text-light-brown placeholder:font-medium focus:outline-blue-200" style={{width: "192px",  height: "43px", border: "0.5px solid rgba(0, 0, 0, 0.50)", paddingLeft: "14px",}} />
                    <Image src="/images/view-password.png" alt="" width={14} height={12} className="absolute top-10 right-3 hover:cursor-pointer" />
                </div>
            </div> */}
            <div className="mt-12 flex flex-row items-center">
                <input type="checkbox" onChange={newsletterHandler} checked={newsletter} ref={newsletterRef} className="me-1 bg-light-grey rounded-md cursor-pointer" />
                <label onClick={newsletterHandler} className="text-sm font-normal cursor-pointer text-light-brown">Send me news letters and keep me updated on daily news</label>
            </div>
            {/* <div className="mt-3.5 flex flex-row items-center">
                <input type="checkbox" onClick={robotHandler} checked={robot} ref={robotRef} className="me-1 bg-light-grey rounded-md cursor-pointer" />
                <label onClick={robotHandler} className="text-sm font-normal text-light-brown cursor-pointer">I am not a robot</label>
            </div> */}
            <div className="mt-3.5 text-sm" style={{color: "rgba(0, 0, 0, 0.50)", fontWeight: "400"}}>
                    By clicking Create Account, you acknowledge you have read and agreed 
                    to our <a href="/" style={{color: "#0653EA", textDecoration: "underline"}}>Terms of Use</a> and <a href="/" style={{color: "#0653EA", textDecoration: "underline"}}>Privacy Policy</a>.
            </div>
            <button className="bg-dark-blue text-white rounded-md mt-4  transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width:"396px", height: "46px",}}>Create Account</button>
            {/* <div className="relative text-center" style={{marginTop: "20px"}}> 
                <div style={{width:"396px", height: "0.4px", background: "#B1B1B1",}}></div>
                <p className="absolute -top-2" style={{width:"18px", fontSize: "10px", padding: "auto", height: "15px", color: "#B1B1B1", left: "47.5%", background: "white"}}>or</p>
            </div> */}
            {/* <div className="flex flex-row gap-5 mt-5">
                <button className="flex flex-row items-center justify-center rounded-md transition-all duration-500 ease-in-out hover:bg-bleach-blue" style={{width: "188px", height: "43px", border: "0.5px solid rgba(0, 0, 0, 0.50)"}}>
                    <Image src="/images/google-logo.png" alt="google icon" width={33} height={33} />
                    <p>Google</p>
                </button>
                <button className="flex flex-row items-center justify-center rounded-md transition-all duration-500 ease-in-out hover:bg-bleach-blue" style={{width: "188px", height: "43px", border: "0.5px solid rgba(0, 0, 0, 0.50)"}}>
                    <Image src="/images/Facebook-logo.png" alt="facebook icon" width={33} height={33} />
                    <p>Facebook</p>
                </button>
            </div> */}
        </form>
    </Fragment>
}

export default IndividualSignup;