import { useDispatch, useSelector } from "react-redux";
import { counterActions } from "@/store/store";
import { Web3Auth } from "@web3auth/modal";

export const useVerification = () => {
    const dispatch = useDispatch();
    const verificationCheck = async (users) => {
        const chainConfig = {
            chainNamespace: "solana",
            chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
            rpcTarget: "https://api.testnet.solana.com",
            displayName: "Solana Mainnet",
            blockExplorer: "https://explorer.solana.com",
            ticker: "SOL",
            tickerName: "Solana",
        };

        const web3auth = new Web3Auth({
                // For Production
                // clientId: "",
                clientId: process.env.NEXT_PUBLIC_PROD_CLIENT_ID,
        
                // For Development
                // clientId: process.env.NEXT_PUBLIC_DEV_CLIENT_ID,
                web3AuthNetwork: "cyan",
                chainConfig: chainConfig,
            });
    
        await web3auth.initModal();

        // await web3auth.connect();
        
        let userInfo;

        try{
            userInfo = await web3auth.getUserInfo();
        } catch(err) {
            localStorage.removeItem("openlogin_store")
            swal({
                title: "oops!",
                text: "Couldn't get user info. Kindly try again",
              });
            return;
        }
    
        const currentUser = users.filter(user => user.email === userInfo.email);

        const currentUserId =  currentUser[0]?.id;
        let userDetails = await fetch(`/api/proxy?${Date.now()}`, {
            // method: "GET",
            headers: {
                "Content-Type": "application/json",
                uri: `/users/find-one/${currentUserId}`,
                // proxy_to_method: "GET",
            }
        })
        const resp = await userDetails.json();
        if(resp.KYCStatusId == 2){
            dispatch(counterActions.confirmOnMapModal());
        }
        else if(resp.categoryId === 0 && resp.KYCStatusId == 1) {
            alert("KYC is yet to be approved. It might take some time");
        }
        else if(resp.categoryId === 0 && (resp.KYCStatusId == 0 || resp.KYCStatusId == 3)) {
            // console.log("Please do KYC");
            const client = new Persona.Client({
                templateId: 'itmpl_mp1885pUwnRvVwEoKxwyUiZz',
                referenceId: currentUserId,
                environmentId: 'env_m7beq2gaxaLfWVkYPaGdMHS3',
                onReady: () => client.open(),
                onComplete: ({ inquiryId, status, fields }) => {
                // console.log(`Completed inquiry ${inquiryId} with status ${status}`);
                }
            });
        }
    }
    return {verificationCheck}
}