import { useRef, useState } from "react";

const AddPilotModal = (props) => {
    const [pilotImage, setPilotImage] = useState();
    const [pilotLicense, setPilotLicense] = useState();
    
    const pilotImageInputRef = useRef();
    const pilotLicenseInputRef = useRef();

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handlePilotImage = (e) => {
        e.preventDefault();
        setPilotImage(e.dataTransfer.files)
    };

    const handlePilotLicense = (e) => {
        e.preventDefault();
        setPilotLicense(e.dataTransfer.files);
    }


    return <div className="bg-white rounded px-12 fixed z-20 pb-10 overflow-y-auto" style={{width: "886px", height: "90vh", maxHeight: "860px", 
            top: "5vh",
            left: "calc(50% - 443px)", 
        }}>
            <div className="flex flex-row items-center mt-20 gap-4 justify-center">
                <h2 className="font-bold">Add Pilot</h2>
            </div>
            <form className="mt-7">
                <div className="flex flex-row items-center justify-between">
                    <div className="mt-7">
                        <label htmlFor="name" className="text-light-brown font-medium">Name*</label> <br />
                        <input type="text" name="name" id="name" placeholder="Full Name" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                    <div className="mt-7">
                        <label htmlFor="nickname" className="text-light-brown font-medium">FAA Tracking Number*</label> <br />
                        <input type="text" name="FAA Number" id="Number" placeholder="FAA Number" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="mt-7">
                        <label htmlFor="License Number" className="text-light-brown font-medium">Pilot License Number*</label> <br />
                        <input type="text" name="License Number" id="License Number" placeholder="License Number" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                    <div className="mt-7">
                        <label htmlFor="country" className="text-light-brown font-medium">Country Of Residence*</label> <br />
                        <input type="text" name="country" id="country" placeholder="Country" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="mt-7">
                        <label htmlFor="serial number" className="text-light-brown font-medium">Flight Time*</label> <br />
                        <input type="text" name="serial number" id="serial number" placeholder="Hours flown" className="rounded ps-5 mt-2.5 focus:outline-blue-200" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}} />
                    </div>
                    <div className="mt-7">
                        <label htmlFor="uav" className="text-light-brown font-medium">UAVs</label> <br />
                        <select className="rounded ps-5 mt-2.5 focus:outline-blue-200 text-dark-brown" style={{width: "383px", height: "37px", border: "0.3px solid rgba(6, 83, 234, 0.4)"}}>
                            <option selected disabled>Select UAVs</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <div className="mt-8">
                        <p className="text-light-brown font-medium mb-2">Upload Pilot Image</p>
                        <div className="rounded-md" style={{width: "383px", height: "217px", border: "0.35px dashed #0653EA"}}>
                            {!pilotImage ? 
                            <div onDrop={handlePilotImage} onDragOver={handleDragOver} className="flex flex-col items-center pt-14">
                                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                    <path d="M28.7698 15.5742C35.0698 16.1167 37.6423 19.3542 37.6423 26.4417V26.6692C37.6423 34.4917 34.5098 37.6242 26.6873 37.6242H15.2948C7.47234 37.6242 4.33984 34.4917 4.33984 26.6692V26.4417C4.33984 19.4067 6.87734 16.1692 13.0723 15.5917" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M21 26.2509V6.33594" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M26.8627 10.2375L21.0002 4.375L15.1377 10.2375" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p className="text-light-brown font-bold">Drag image here to upload</p>
                                <p className="text-light-brown text-xs">Alternatively, you can select file by </p>
                                <input type="file" onChange={(e) => setPilotImage(e.target.files)} hidden ref={pilotImageInputRef} />
                                <button className="text-dark-blue underline text-sml"  onClick={(e) => {
                                    e.preventDefault()
                                    pilotImageInputRef.current.click()}}>Clicking here</button>
                            </div> :
                            <div className='flex flex-col items-center pt-20'>
                                {Array.from(pilotImage).map((image, idx) => <p key={idx}>{image.name}</p>)}
                                <button onClick={() => {setPilotImage(null)}} className="bg-bleach-red mt-5 text-light-red-100 rounded-md" style={{width: "101px", height: "39px"}}>Remove</button>
                            </div>
                            }
                        </div>
                    </div>
                    <div className="mt-8">
                        <p className="text-light-brown font-medium mb-2">Upload Pilot License</p>
                        <div className="rounded-md" style={{width: "383px", height: "217px", border: "0.35px dashed #0653EA"}}>
                            {!pilotLicense ? 
                            <div onDrop={handlePilotLicense} onDragOver={handleDragOver} className="flex flex-col items-center pt-14">
                                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                    <path d="M28.7698 15.5742C35.0698 16.1167 37.6423 19.3542 37.6423 26.4417V26.6692C37.6423 34.4917 34.5098 37.6242 26.6873 37.6242H15.2948C7.47234 37.6242 4.33984 34.4917 4.33984 26.6692V26.4417C4.33984 19.4067 6.87734 16.1692 13.0723 15.5917" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M21 26.2509V6.33594" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M26.8627 10.2375L21.0002 4.375L15.1377 10.2375" stroke="#0653EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p className="text-light-brown font-bold">Drag image here to upload</p>
                                <p className="text-light-brown text-xs">Alternatively, you can select file by </p>
                                <input type="file" onChange={(e) => setPilotLicense(e.target.files)} hidden ref={pilotLicenseInputRef} />
                                <button className="text-dark-blue underline text-sml"  onClick={(e) => {
                                    e.preventDefault()
                                    pilotLicenseInputRef.current.click()}}>Clicking here</button>
                            </div> :
                            <div className='flex flex-col items-center pt-20'>
                                {Array.from(pilotLicense).map((image, idx) => <p key={idx}>{image.name}</p>)}
                                <button onClick={() => {setPilotLicense(null)}} className="bg-bleach-red mt-5 text-light-red-100 rounded-md" style={{width: "101px", height: "39px"}}>Remove</button>
                            </div>
                            }
                        </div>
                    </div>
                </div>    
                <div className="flex flex-row justify-center items-center mt-12 gap-5">
                    <button onClick={props.onClose} className="rounded-md text-dark-blue text-sml transition-all duration-500 ease-in-out hover:bg-bleach-blue" style={{border: "1px solid #0653EA", width: "120px", height: "40px"}}>Cancel</button>
                    <button className="bg-dark-blue rounded-md text-white text-sml transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width: "120px", height: "40px"}}>Add Pilot</button>
                </div>
            </form>
        </div>
}

export default AddPilotModal;