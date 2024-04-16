import React, { useEffect, useState } from 'react';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import PortfolioItem from './PortfolioItem';
import axios from 'axios';
import { useSignature } from '@/hooks/useSignature';
import { useAuth } from '@/hooks/useAuth';
import useDatabase from '@/hooks/useDatabase';
import Spinner from '../Spinner';

const PortfolioList = ({ title, airspacesList, selectAirspace, address }) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [rentalPageNumber, setRentalPageNumber] = useState(1)
    const [unverifiedPageNumber, setUnverifiedPageNumber] = useState(1)
    const [rentedAirspaces, setRentedAirspaces] = useState([])
    const [verifiedAirspaces, setVerifiedAirspaces] = useState([])
    const [unverifiedAirspaces, setUnverifiedAirspaces] = useState([])
    const [allUnverifiedAirspaces, setAllUnverifiedAirspaces] = useState([])
    const [allRentedAirspaces, setAllRentedAirspaces] = useState([])
    const [allVerifiedAirspaces, setAllVerifiedAirspaces] = useState([])
    const [loading, setLoading] = useState(true)


    const [activeTab, setActiveTab] = useState("Verified Airspaces")
    const { signatureObject } = useSignature()
    const { user } = useAuth()
    const {getPropertiesByUserAddress, getUnverifiedAirspaces} = useDatabase()


    const handleNextPage = () =>{
        if (activeTab === "Verified Airspaces"){
            if (verifiedAirspaces.length < 10) return;
            setPageNumber(prevPageNumber => prevPageNumber + 1);
        }else if (activeTab === "Rented Airspaces"){
            if (rentedAirspaces.length < 10) return;
            setRentalPageNumber(prevPageNumber => prevPageNumber + 1);
        }else {
            if (unverifiedAirspaces?.length < 10) return;
            setUnverifiedPageNumber(prevPageNumber => prevPageNumber + 1);
        }
    };

    const handlePrevPage = () =>{
        if (activeTab === 'Verified Airspaces'){
            if (pageNumber === 1) return;
            setPageNumber(prevPageNumber => prevPageNumber - 1);
        } else if (activeTab === "Rented Airspaces"){
            if (rentalPageNumber === 1) return;
            setRentalPageNumber(prevPageNumber => prevPageNumber - 1);
        }else{
            if (unverifiedPageNumber === 1) return;
            setUnverifiedPageNumber(prevPageNumber => prevPageNumber - 1);
        }
    }


    const fetchAirspaces = async ()=>{
        if (user?.blockchainAddress) {
            setLoading(true)

                const verifiedAirspaces =await getPropertiesByUserAddress(user?.blockchainAddress, "LandToken", 10)
                setVerifiedAirspaces(verifiedAirspaces)
                setAllVerifiedAirspaces(verifiedAirspaces)




              const rentedAirspaces =await getPropertiesByUserAddress(user?.blockchainAddress, "rentalToken", 10)
              setRentedAirspaces(rentedAirspaces)
              setAllRentedAirspaces(rentedAirspaces)




                const unverified =await getUnverifiedAirspaces(user?.blockchainAddress, 10, unverifiedPageNumber)
              setUnverifiedAirspaces(unverified?.items)
              setAllUnverifiedAirspaces(unverified?.items)


            setLoading(false)
        } 
    }

    const paginateAirspaces = async ()=>{
        if (user?.blockchainAddress) {
            setLoading(true)
            if (activeTab === "Verified Airspaces"){
                if (pageNumber === 1){
                        const verified = await getPropertiesByUserAddress(user?.blockchainAddress, "landToken", 10);
                        setVerifiedAirspaces(verified);
                } else if (pageNumber > 1){
                        const verifiedAirspaces = await getPropertiesByUserAddress(user?.blockchainAddress, 'landToken', 10, verifiedAirspaces[verifiedAirspaces.length - 1].id);
                        setVerifiedAirspaces(verifiedAirspaces);
                }
            }
            else if (activeTab === "Rented Airspaces"){
                if (rentalPageNumber === 1){
                        // Fetch data from API
                        const rented = await getPropertiesByUserAddress(user?.blockchainAddress, "rentalToken", 10);
                        setRentedAirspaces(rented);
           
                } else if (rentalPageNumber > 1){
                        const rentedAirspaces = await getPropertiesByUserAddress(user?.blockchainAddress, 'rentalToken', 10, rentedAirspaces[rentedAirspaces.length - 1].id);
                        setRentedAirspaces(rentedAirspaces);
                }    
            }

            else if (activeTab === "Pending Verification") {
                if (unverifiedPageNumber === 1) {
                        const unverified = await getUnverifiedAirspaces(user?.blockchainAddress, 10, unverifiedPageNumber);
                        
                        setUnverifiedAirspaces(unverified?.items);
                    }

                    else if (unverifiedPageNumber > 1) {
                        const newUnverifiedAirspaces = await getUnverifiedAirspaces(user?.blockchainAddress, 10, unverifiedPageNumber);
                            setUnverifiedAirspaces(newUnverifiedAirspaces?.items);
                    }
            } 
            
            
            
            setLoading(false)
        } 
    }


useEffect(()=>{
    fetchAirspaces()
}, [user])

console.log({unverifiedAirspaces})


useEffect(()=>{
    paginateAirspaces()
}, [pageNumber, rentalPageNumber, unverifiedPageNumber])




    return (
        <div className="py-[43px] px-[29px] rounded-[30px] bg-white flex flex-col gap-[43px] min-w-[516px] flex-1" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <h2 className="font-medium text-xl text-[#222222] text-center">{title}</h2>
            <div className="flex items-center gap-16">

                <div className={`${activeTab === "Verified Airspaces" ? "border-b-4  border-[#6CA1F7]" : ""} px-8 py-2 cursor-pointer transition ease-linear delay-75`} onClick={()=> setActiveTab("Verified Airspaces")}>Verified Airspaces</div>
                <div className={`${activeTab === "Rented Airspaces" ? "border-b-4  border-[#6CA1F7]" : ""} px-8 py-2 cursor-pointer transition ease-linear delay-75`} onClick={()=> setActiveTab("Rented Airspaces")}>Rented Airspaces</div>
                <div className={`${activeTab === "Pending Verification" ? "border-b-4  border-[#6CA1F7]" : ""} px-8 py-2 cursor-pointer transition ease-linear delay-75`} onClick={()=> setActiveTab("Pending Verification")}>Pending Verification</div>
                
            </div>

            {loading ? <div>   <Spinner/></div> : <>
            {activeTab === "Rented Airspaces" && <div className="flex flex-col gap-[15px] min-h-[20rem]">
                {rentedAirspaces.map(({address,expirationDate,name, type}, index) => (<PortfolioItem airspaceName={address} key={index} tags={[true, false,false,  false]} type={type} selectAirspace={() => selectAirspace(index)} />))}
            </div>}

            {activeTab === "Verified Airspaces" && <div className="flex flex-col gap-[15px] min-h-[20rem]">
                {verifiedAirspaces.map(({address,expirationDate,name, type}, index) => (<PortfolioItem airspaceName={address} key={index} tags={[true, false,false,  false]} type={type} selectAirspace={() => selectAirspace(index)} />))}
            </div>}

            {activeTab === "Pending Verification" && <div className="flex flex-col gap-[15px] min-h-[20rem]">
                {unverifiedAirspaces?.map(({address,expirationDate,name, type}, index) => (<PortfolioItem airspaceName={address} key={index} tags={[true, false,false,  false]} type={type} selectAirspace={() => selectAirspace(index)} />))}
            </div>}
            
            <div className="flex flex-col w-full text-gray-600">
                <div className="flex self-end items-center gap-2 w-[5rem]">
                    <div onClick={handlePrevPage} className={`${activeTab === 'Verified Airspaces' && pageNumber === 1 ? "cursor-not-allowed" : activeTab === 'Rented Airspaces' && rentalPageNumber === 1 ? "cursor-not-allowed" : activeTab === 'Pending Verification' && unverifiedPageNumber === 1 ? "cursor-not-allowed" : "cursor-pointer"} p-1 border rounded-lg border-gray-200`}><RxCaretLeft/></div>
                    <div>{activeTab === "Verified Airspaces" ? pageNumber : activeTab === "Rented Airspaces" ? rentalPageNumber : unverifiedPageNumber}</div>
                    <div  onClick={handleNextPage} className={`${activeTab === 'Verified Airspaces' && verifiedAirspaces?.length < 10 ? "cursor-not-allowed" : activeTab === 'Rented Airspaces' && rentedAirspaces.length < 10 ? "cursor-not-allowed" : activeTab === 'Pending Verification' && unverifiedAirspaces?.length < 10 ? "cursor-not-allowed" : "cursor-pointer"} p-1 cursor-pointer border rounded-lg border-gray-200`}><RxCaretRight /></div>
                </div>
            </div>
            </>}

            
        </div>
    )
}

export default PortfolioList