import { useRef, useState } from "react";

const AddUavModal = (props) => {
    const [file, setFile] = useState();
    const fileInputRef = useRef();

    const handleDragOver = (e) => {
        e.preventDefault();

    }

    const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files)
    }


    return <div className="bg-white rounded px-12 pb-10 fixed z-20 overflow-y-auto" style={{width: "886px", height: "90vh", maxHeight: "1001px",
                top: "5vh",  // This is for live environment
                left: "calc(50% - 443px)", 
        }}>
            <div className="flex flex-row items-center mt-20 gap-4 justify-center">
                <h2 className="font-bold">Add UAV</h2>
            </div>
            <form className="mt-7">
                <div className=" flex flex-row justify-between rounded py-2 px-5" style={{height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}}>
                    <p>DOES YOUR DRONE BROADCAST <span><a href="" className="text-dark-blue font-semibold underline">FAA REMOTE ID</a></span> INFORMATION?*</p>
                    <div className="flex flex-row items-center gap-8">    
                        <div className="flex flex-row items-center gap-2">
                            <label>Yes</label>
                            <input type="radio" id="yes" name="broadcast" className="cursor-pointer" />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <label>No</label>
                            <input type="radio" id="no" name="broadcast" className="cursor-pointer" />
                        </div>
                    </div>
                </div>
                <p className="mt-2.5 text-light-brown text-sm font-semibold">Not sure? Contact your UAS manufacturer or see if your drone is listed <span> <a href="https://uasdoc.faa.gov/listDocs" className="text-dark-blue underline">here</a> </span> </p>
                <div className="flex flex-row items-center justify-between">
                    <div className="mt-7">
                        <label htmlFor="nickname" className="text-light-brown font-medium">UAV Nickname*</label> <br />
                        <input type="text" name="nickname" id="nickname" placeholder="Air Drone" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                    <div className=" flex flex-row justify-between ps-4 pe-2 items-center rounded" style={{height: "37px", width: " 383px", border: "0.3px solid rgba(6, 83, 234, 0.4)", marginTop: "61px"}}>
                        <p>UAV Type</p>
                        <select className="rounded-sm bg-sky-blue-100 border-collapse outline-none outline-0" style={{width: "250px", height: "29px"}}>
                            <option selected disabled>Select a device type</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="mt-7">
                        <label htmlFor="manufacturer" className="text-light-brown font-medium">UAV Manufacturer*</label> <br />
                        <input type="text" name="manufacturer" id="manufacturer" placeholder="DJI" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                    <div className="mt-7">
                        <label htmlFor="model" className="text-light-brown font-medium">UAV Model*</label> <br />
                        <input type="text" name="model" id="model" placeholder="CX0007TY" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                </div>
                <div className="flex flex-row items-center gap-16">
                    <div className="mt-7">
                        <label htmlFor="serial number" className="text-light-brown font-medium">Serial Number*</label> <br />
                        <input type="text" name="serial number" id="serial number" placeholder="S475635RDT54" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                    <div className="mt-20 flex flex-row-reverse items-center gap-2 justify-start">
                        <label htmlFor="battery range" className="font-medium text-sml text-dark-brown cursor-pointer">SERIAL NUMBER NOT APLICABLE</label> <br />
                        <input type="checkbox" className="ps-2 cursor-pointer" />
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="mt-7">
                        <label htmlFor="range" className="text-light-brown font-medium">Range*</label> <br />
                        <input type="text" name="range" id="range" placeholder="27 KM" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                    <div className="mt-7">
                        <label htmlFor="battery range" className="text-light-brown font-medium">Battery Range*</label> <br />
                        <input type="text" name="battery range" id="battery range" placeholder="45 mins" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                </div>
                <div className="mt-8">
                    <p className="text-light-brown font-medium mb-2">Upload an Image</p>
                    <div className="rounded-md" style={{width: "383px", height: "217px", border: "0.35px dashed #0653EA"}}>
                        {!file ? 
                        <div onDrop={handleDrop} onDragOver={handleDragOver} className="flex flex-col items-center pt-14">
                            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                <path d="M28.7698 15.5742C35.0698 16.1167 37.6423 19.3542 37.6423 26.4417V26.6692C37.6423 34.4917 34.5098 37.6242 26.6873 37.6242H15.2948C7.47234 37.6242 4.33984 34.4917 4.33984 26.6692V26.4417C4.33984 19.4067 6.87734 16.1692 13.0723 15.5917" stroke="#0653EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 26.2509V6.33594" stroke="#0653EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M26.8627 10.2375L21.0002 4.375L15.1377 10.2375" stroke="#0653EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p className="text-light-brown font-bold">Drag image here to upload</p>
                            <p className="text-light-brown text-xs">Alternatively, you can select file by </p>
                            <input type="file" onChange={(e) => setFile(e.target.files)} hidden ref={fileInputRef} />
                            <button className="text-dark-blue underline text-sml"  onClick={(e) => {
                                e.preventDefault()
                                fileInputRef.current.click()}}>Clicking here</button>
                        </div> :
                        <div className='flex flex-col items-center pt-20'>
                            {Array.from(file).map((file, idx) => <p key={idx}>{file.name}</p>)}
                            <button onClick={() => {setFile(null)}} className="bg-bleach-red mt-5 text-light-red-100 rounded-md" style={{width: "101px", height: "39px"}}>Remove</button>
                        </div>
                        }
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center mt-12 gap-5">
                    <button className="rounded-md text-dark-blue text-sml transition-all duration-500 ease-in-out hover:bg-bleach-blue" style={{border: "1px solid #0653EA", width: "120px", height: "40px"}} onClick={props.onClose}>Cancel</button>
                    <button className="bg-dark-blue rounded-md text-white text-sml transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width: "120px", height: "40px"}}>Add UAV</button>
                </div>
            </form>
        </div>
}

export default AddUavModal;