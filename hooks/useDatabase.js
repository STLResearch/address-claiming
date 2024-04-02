import axios from "axios";
import { useSignature } from "./useSignature"

const useDatabase = () => {
    const { signatureObject } = useSignature()

    const getReferralCodeById = async (blockchainAddress, id) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/referral-code/referral-code/${id}`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when getting referral code by id.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const getReferralByCode = async (referralCode) => {
        try {
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/public/referral-code/${referralCode}`,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when getting referral by code.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }

    }
    const retrieveReferralData = async (blockchainAddress) => {
        const { sign, sign_nonce, sign_issue_at, sign_address } =
        await signatureObject(blockchainAddress);
        try {
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/users/retrieve-referral-data`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when getting referral Data.");
            }


            return response.json();
        } catch (error) {
            console.log(error);
        }

    }

    const updateReferral = async (blockchainAddress, code) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'PATCH',
                body: JSON.stringify({ code }),
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/referral-code`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when updating referral.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const createUser = async (user) => {
        try {
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                    uri: '/public/users/create',
                    proxy_to_method: 'POST',
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when creating user.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const getUser = async (blockchainAddress) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/users/session`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when getting user.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const updateUser = async (blockchainAddress, user) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'PATCH',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/users/update`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when updating user.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const deleteUser = async (blockchainAddress) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/users/delete`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when deleting.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const createProperty = async (blockchainAddress, property) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'POST',
                body: JSON.stringify(property),
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/properties/claim`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when creating property.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const deleteProperty = async (blockchainAddress, propertyId) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'DELETE',
                body: JSON.stringify({ propertyId }),
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/properties/delete`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when deleting property.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const getPropertyById = async (blockchainAddress, propertyId) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/properties/find-one/${propertyId}`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when getting property by id.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const updateProperty = async (blockchainAddress, kproperty) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'PATCH',
                body: JSON.stringify({ property }),
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/properties/update`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when updating property.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const getPropertiesByUserAddress = async (callerAddress, type, limit, afterAssetId)=>{

    try {
        const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(callerAddress);
        const response = await axios.get(
          `/api/private/airspace-rental/retrieve-tokens?callerAddress=${callerAddress}&type=${type}&limit=${limit}&afterAssetId=${afterAssetId || ""}`,
          {
            headers: {
                'Content-Type': 'application/json',
                sign,
                time: sign_issue_at,
                nonce: sign_nonce,
                address: sign_address,
            },
            
          }
        );

        console.log({response})
        return response.data;
      } catch (error) {
        console.error(error);
        return [];
      }
}


const getUnverifiedAirspaces = async (callerAddress, limit, page)=>{

    try {
        const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(callerAddress);
        const response = await axios.get(
          `/api/private/airspace-rental/retrieve-unverified-airspace?callerAddress=${callerAddress}&limit=${limit}&page=${page || "1"}`,
          {
            headers: {
                'Content-Type': 'application/json',
                sign,
                time: sign_issue_at,
                nonce: sign_nonce,
                address: sign_address,
            },
            
          }
        );

        console.log({response})
        return response.data;
      } catch (error) {
        console.error(error);
        return [];
      }
}

    const getRents = async (blockchainAddress) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/rents`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when getting rents.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const getRentById = async (blockchainAddress, rentId) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/rents/find-one/${rentId}`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when getting rent by id.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const updateRent = async (blockchainAddress, rent) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'PATCH',
                body: JSON.stringify({ rent }),
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/rents/update`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when updating rent.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const createRent = async (blockchainAddress, rent) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'POST',
                body: JSON.stringify({ rent }),
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/rents/create`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when creating rent.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    const deleteRent = async (blockchainAddress, rentId) => {
        try {
            const { sign, sign_nonce, sign_issue_at, sign_address } =
                await signatureObject(blockchainAddress);
            const response = await fetch(`/api/proxy?${Date.now()}`, {
                method: 'DELETE',
                body: JSON.stringify({ rentId }),
                headers: {
                    'Content-Type': 'application/json',
                    URI: `/private/rents/delete`,
                    sign,
                    time: sign_issue_at,
                    nonce: sign_nonce,
                    address: sign_address,
                },
            })

            if (!response.ok || response.statusCode === 500) {
                throw new Error("Error when deleting rent.");
            }

            return response.json();
        } catch (error) {
            console.log(error);
        }
    }

    return { getReferralCodeById,retrieveReferralData,getReferralByCode,getUnverifiedAirspaces, updateReferral, createUser, getUser, updateUser, deleteUser, createProperty, deleteProperty, getPropertyById, updateProperty, getPropertiesByUserAddress, getRents, getRentById, updateRent, createRent, deleteRent }
}

export default useDatabase;
