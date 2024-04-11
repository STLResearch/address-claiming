import { Fragment, useEffect, useState } from "react";
import Script from "next/script";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Link from "next/link";
import Head from "next/head";
import { Web3Auth } from "@web3auth/modal";
import { SolanaWallet } from "@web3auth/solana-provider";
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';
import Image from 'next/image'
import map from '../../../public/map.png'
import { publicKey } from '@metaplex-foundation/umi';
import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import base58 from "bs58";
import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    VersionedTransaction,
  } from "@solana/web3.js";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { createPortal } from "react-dom";
import { Backdrop } from "@mui/material";
import Spinner from "@/Components/Spinner";
import { useAuth } from "@/hooks/useAuth";
// add proxy 47,
const AuctionCard = ({
    key1,
    assetId,
    owner,
    highestBid,
    totalBids,
  }) => {
    const [toggleBidModal, setToggleBidModal] = useState(false);
    const dummyName = [
      '9431 Bank Drive Brooklyn, NY 11216',
      '97 Carson St. Brooklyn, NY 11204',
      '7 Bradford Drive  Bronx, NY 10453',
      '7342 Westminster Ave.  Bronx, NY 10463',
      ' 957 Liberty Ave.  Buffalo, NY 14221',
    ];
  
    return (
      <>
        {toggleBidModal && (
          <BidModal
            data={{ assetId, owner, highestBid, totalBids }}
            onClose={() => setToggleBidModal(false)}
          />
        )}
        <div className="flex flex-col rounded-[10px] shadow-md h-[410px] w-[290px] hover:bg-gray-100 transition ease-in-out duration-300">
          <div className="h-[50%]">
            <Image src={'/map.png'} width={290} height={174} alt="map" />
          </div>
          <div className="flex flex-col px-4 gap-4">
            <div className="font-semibold">{dummyName[key1]}</div>
            <div className="flex justify-between w-full text-sm">
              <div className="flex flex-col">
                <div className="text-grayText">Asset ID</div>
                <div className="  text-sm w-24 overflow-hidden">{assetId}...</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-grayText">Total Bids</div>
                <div>{totalBids}</div>
              </div>
            </div>
  
            <div className="flex justify-between w-full text-sm">
              <div className="flex flex-col">
                <div className="text-grayText">Owner</div>
                <div className="  text-sm w-24 overflow-hidden">{owner} </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-grayText">Highest Bid</div>
                <div>${highestBid}</div>
              </div>
            </div>
            <div>
              <Button onClick={() => setToggleBidModal(true)} label="Place Bid" />
            </div>
          </div>
        </div>
      </>
    );
  };
  
 function CreateAuctionModal({
    assetButton,
    setToggleCreateAuctionModal,
  }) {
    return (
      <div className=" fixed right-20 top-20  h-[80%] w-[50%] overflow-y-scroll bg-white border-4 border-gray-300 animate__animated animate__zoomInDown">
        <button
          className="bg-blue-400 rounded-xl text-white"
          onClick={() => {
            setToggleCreateAuctionModal(false);
          }}
        >
          Close
        </button>
        <div className="flex flex-wrap justify-start items-start mt-20 overflow-y-scroll ">
          {assetButton}
        </div>
      </div>
    );
  }
const BidModal = ({ data, onClose, onSubmit }) => {
    const [bid, setBid] = useState('');
    const [amount, setAmount] = useState('0');
    const [solanaWallet,setSolanaWallet] = useState();
    
  const { user: selectorUser } = useAuth();
  const [user1, setUser1] = useState();
  const router = useRouter();
  useEffect(() => {
    if (selectorUser) {
      const authUser = async () => {
        const chainConfig = {
          chainNamespace: "solana",
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: "Solana Mainnet",
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana",
        };

        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

          web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
          chainConfig: chainConfig,
        });

        await web3auth.initModal();

        // await web3auth.connect();

        let userInfo;

        try {
          userInfo = await web3auth.getUserInfo();
        } catch (err) {
          localStorage.removeItem("openlogin_store");
          swal({
            title: "oops!",
            text: "Something went wrong. Kindly try again",
          }).then(() => router.push("/auth/join"));
          return;
        }

        const fetchedToken = JSON.parse(
          localStorage.getItem("openlogin_store")
        );

        if (!selectorUser) {
          localStorage.removeItem("openlogin_store");
          router.push("/auth/join");
          return;
        }

        
        setUser1(selectorUser);
      };

      authUser();
    }
  }, []);
  useEffect(()=>{
    let getWallet=async()=>{
        const chainConfig = {
            chainNamespace: "solana",
            chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
            rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
            displayName: "Solana Testnet",
            blockExplorer: "https://explorer.solana.com",
            ticker: "SOL",
            tickerName: "Solana",
          };
          const web3auth = new Web3Auth({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    
            web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
            chainConfig: chainConfig,
          });
          await web3auth.initModal();
          // await web3auth.connect();
          const web3authProvider = await web3auth.connect();
    
          const solanaWallet = new SolanaWallet(web3authProvider); 
          
          setSolanaWallet(solanaWallet)
          
    }
    getWallet()
},[])
    const handleSubmit = async () => {
      let ownerAddress = await solanaWallet.requestAccounts();
     
      console.log(ownerAddress[0]);
      let reqBody = {
        assetId: data.assetId,
        bidder: ownerAddress[0],
        bidOffer: amount,
        bidType: 'Auction',
      }; const signatureObj = {};
      try {
        const domain = window.location.host;
            const origin = window.location.origin;

            const payload = new SIWPayload();
            payload.domain = domain;
            payload.uri = origin;
            payload.address = user1.blockchainAddress;
            payload.statement = "Sign in to SkyTrade app.";
            payload.version = "1";
            payload.chainId = 1;

            const header = { t: "sip99" };
            const network = "solana";

            let message = new SIWWeb3({ header, payload, network });

            const messageText = message.prepareMessage();
            const msg = new TextEncoder().encode(messageText);
            const result = await solanaWallet.signMessage(msg);

            const signature = base58.encode(result);

            signatureObj.sign = signature;
            signatureObj.sign_nonce = message.payload.nonce;
            signatureObj.sign_issue_at = message.payload.issuedAt;
            signatureObj.sign_address = user1.blockchainAddress;


            let ans = await fetch(`/api/proxy?${Date.now()}`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
  
                uri: `/nft/bid`,
                sign: signatureObj.sign,
                time: signatureObj.sign_issue_at,
                nonce: signatureObj.sign_nonce,
                address: signatureObj.sign_address,
              },
              body: JSON.stringify(reqBody),
            });
            ans = await ans.json();
            console.log('ans',ans)

        //let ans = await axios.post('/api/placeBid', { body: { reqBody } });
        //console.log(ans);
        
          let resTx = ans.tx;
          console.log('tx', resTx);
          let bfferedTx = Buffer.from(resTx, 'base64');
          let uintArrTx = new Uint8Array(bfferedTx);
          let Vtx = VersionedTransaction.deserialize(uintArrTx);
          let sig = await solanaWallet.signTransaction(Vtx);
          console.log('raw sig', sig);
          let serializedSig = sig.serialize();
          let bufferedSeriSx = Buffer.from(serializedSig);
          let finalTx = bufferedSeriSx.toString('base64');
          console.log('final sig', finalTx);
          let reqBody2 = {
            sig: finalTx,
            assetId: data.assetId,
          };

          let ans2 = await fetch(`/api/proxy?${Date.now()}`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",

              uri: `/nft/tx/submit`,
              sign: signatureObj.sign,
              time: signatureObj.sign_issue_at,
              nonce: signatureObj.sign_nonce,
              address: signatureObj.sign_address,
            },
            body: JSON.stringify(reqBody2),
          });
          ans2 = await ans2.json();
          console.log('ans2',ans2)

          //let res = await axios.post('/api/placeBid/submitBid', { body: reqBody2 });
          //console.log('res2=', res);
          /*  const signatureBuffer = Buffer.from(finalTx, 'base64');
          const txHash = signatureBuffer.toString('hex');
          console.log('sig hash', txHash); */
        
      } catch (error) {
        console.log(error);
      }
    }; // State to store the input value
  
    const handleChange = (event) => {
      const value = event.target.value;
      // Validate input to accept only positive numbers
      if (/^\d*\.?\d*$/.test(value)) {
        setAmount(value === '' ? '' : parseFloat(value).toString());
      }
    };
    useEffect(()=>{
        let getWallet=async()=>{
            const chainConfig = {
                chainNamespace: "solana",
                chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
                rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
                displayName: "Solana Testnet",
                blockExplorer: "https://explorer.solana.com",
                ticker: "SOL",
                tickerName: "Solana",
              };
              const web3auth = new Web3Auth({
                clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        
                web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
                chainConfig: chainConfig,
              });
              await web3auth.initModal();
              // await web3auth.connect();
              const web3authProvider = await web3auth.connect();
        
              const solanaWallet = new SolanaWallet(web3authProvider); 
              const accounts = await solanaWallet.requestAccounts();
              setSolanaWallet(solanaWallet)
              console.log('ypp',accounts)
        }
        getWallet()
    },[])
  
    return (
      <div className="fixed inset-0 flex justify-center items-center z-30 bg-gray-900 bg-opacity-50 animate__animated animate__zoomInDown">
        <div className="bg-white px-8 pt-4 pb-8 rounded-[20px] w-full max-w-[36rem] relative flex flex-col gap-4">
          <div onClick={onClose} className="absolute top-2 right-2 cursor-pointer">
            <button className="w-6 h-6" >xx</button>
          </div>
          <div className="text-center font-semibold text-lg">{data.name}</div>
          <div className="flex w-full items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div>Owner:</div>
                <div className="text-grayText text-sm w-36 overflow-hidden">{data.owner}</div>
              </div>
              <div className="flex items-center gap-2">
                <div>Asset ID:</div>
                <div className="text-grayText text-sm w-36 overflow-hidden">{data.assetId}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div>Highest Bid</div>
              <div className="font-semibold text-xl">${data.highestBid}</div>
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="bid">Your Bid</label>
            <div className="w-full flex px-4 border-gray-300 rounded-[10px] border ">
              <div className="py-2 pr-2 text-grayText">$</div>
              <input
                type="text"
                id="bid"
                className="rounded-[10px] py-2 focus:outline-none"
                value={amount}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <Button type="secondary" label="Cancel" onClick={onClose} />
            <Button label="Submit" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    );
  };
  
  const Button= ({ label, type, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`border border-primary text-primary bg-blue-400 hover:text-white hover:bg-primary w-full px-4 py-2 rounded-[10px] transition ease-in-out duration-300 active:scale-x-95 min-w-[6rem]`}
      >
        {label}
      </button>
    );
  };
  const AssetCard = ({
    assetId,
    owner,
    setIsLoading,
  }) => {
   
    const [solanaWallet,setSolanaWallet] = useState();
    const {user:selectorUser}=useAuth()
    const [user1, setUser1] = useState();
    useEffect(() => {
      if (selectorUser) {
        const authUser = async () => {
          const chainConfig = {
            chainNamespace: "solana",
            chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
            rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
            displayName: "Solana Mainnet",
            blockExplorer: "https://explorer.solana.com",
            ticker: "SOL",
            tickerName: "Solana",
          };
  
          const web3auth = new Web3Auth({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  
            web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
            chainConfig: chainConfig,
          });
  
          await web3auth.initModal();
  
          // await web3auth.connect();
  
          let userInfo;
  
          try {
            userInfo = await web3auth.getUserInfo();
          } catch (err) {
            localStorage.removeItem("openlogin_store");
            swal({
              title: "oops!",
              text: "Something went wrong. Kindly try again",
            }).then(() => router.push("/auth/join"));
            return;
          }
  
          const fetchedToken = JSON.parse(
            localStorage.getItem("openlogin_store")
          );
  
          if (!selectorUser) {
            localStorage.removeItem("openlogin_store");
            router.push("/auth/join");
            return;
          }
  
          
          setUser1(selectorUser);
        };
  
        authUser();
      }
    }, []);
let router=useRouter()
    const sucess = () => toast.success('nft added to auction', {});
    const error1 = () => toast.error('plzz try again');
    const handleOnClick = async () => {
      setIsLoading(true);
      let date1 = new Date().setHours(new Date().getHours() + 4);
      let endDate = new Date(date1).toISOString();
      console.log(endDate);
  
      let reqBody = {
        assetId: assetId,
        listingType: 'Auction',
        isActive: true,
        owner: owner,
        listingPrice: 0,
        endDate: endDate,
      };
      const signatureObj = {};
      try {
        const domain = window.location.host;
            const origin = window.location.origin;

            const payload = new SIWPayload();
            payload.domain = domain;
            payload.uri = origin;
            payload.address = user1.blockchainAddress;
            payload.statement = "Sign in to SkyTrade app.";
            payload.version = "1";
            payload.chainId = 1;

            const header = { t: "sip99" };
            const network = "solana";

            let message = new SIWWeb3({ header, payload, network });

            const messageText = message.prepareMessage();
            const msg = new TextEncoder().encode(messageText);
            const result = await solanaWallet.signMessage(msg);

            const signature = base58.encode(result);

            signatureObj.sign = signature;
            signatureObj.sign_nonce = message.payload.nonce;
            signatureObj.sign_issue_at = message.payload.issuedAt;
            signatureObj.sign_address = user1.blockchainAddress;


            let ans = await fetch(`/api/proxy?${Date.now()}`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
  
                uri: `/nft`,
                sign: signatureObj.sign,
                time: signatureObj.sign_issue_at,
                nonce: signatureObj.sign_nonce,
                address: signatureObj.sign_address,
              },
              body: JSON.stringify(reqBody),
            });
            ans = await ans.json();
            console.log('ans',ans)
        //let ans = await axios.post('/api/postCnftAuction', { body: reqBody });
        setIsLoading(false);
        console.log(ans.tx)
        let txs = ans.tx;
        let bfferedTx1 = Buffer.from(txs[0], 'base64');
        let uintArrTx1 = new Uint8Array(bfferedTx1);
        let Vtx1 = VersionedTransaction.deserialize(uintArrTx1);
        let bfferedTx2 = Buffer.from(txs[1], 'base64');
        let uintArrTx2 = new Uint8Array(bfferedTx2);
        let Vtx2 = VersionedTransaction.deserialize(uintArrTx2);
        let sig = await solanaWallet.signAllTransactions([Vtx1, Vtx2]);
        console.log('raw sig', sig);
        let serializedSig1 = sig[0].serialize();
        let bufferedSeriSx1 = Buffer.from(serializedSig1);
        let finalTx1 = bufferedSeriSx1.toString('base64');
        console.log('final sig', finalTx1);
        let serializedSig2 = sig[1].serialize();
        let bufferedSeriSx2 = Buffer.from(serializedSig2);
        let finalTx2 = bufferedSeriSx2.toString('base64');
        console.log('final sig', finalTx2);
  
        let reqBody2 = {
          sig: [finalTx1, finalTx2],
          assetId: assetId
        };
        console.log('allsig',reqBody2)
        let ans2 = await fetch(`/api/proxy?${Date.now()}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

            uri: `/nft/txs/submit`,
            sign: signatureObj.sign,
            time: signatureObj.sign_issue_at,
            nonce: signatureObj.sign_nonce,
            address: signatureObj.sign_address,
          },
          body: JSON.stringify(reqBody2),
        });
        ans2 = await ans2.json();
        console.log('ans2',ans2)

        //let res2 = await axios.post('/api/sellApi', { body: reqBody2 });
        //console.log('res2=', res);
        if (ans.data.status == 500) {
          throw new Error(ans.data.text);
        }
        
        sucess();
      } catch (error) {
        console.log('error', error);
        error1();
      }
  
      console.log('click');
    };
    useEffect(()=>{
        let getWallet=async()=>{
            const chainConfig = {
                chainNamespace: "solana",
                chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
                rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
                displayName: "Solana Testnet",
                blockExplorer: "https://explorer.solana.com",
                ticker: "SOL",
                tickerName: "Solana",
              };
              const web3auth = new Web3Auth({
                clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        
                web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
                chainConfig: chainConfig,
              });
              await web3auth.initModal();
              // await web3auth.connect();
              const web3authProvider = await web3auth.connect();
        
              const solanaWallet = new SolanaWallet(web3authProvider); 
              
              setSolanaWallet(solanaWallet)
              
        }
        getWallet()
    },[])
    return (
      <>
        <div className="flex flex-col m-1 rounded-[10px] shadow-md h-[410px] w-[290px] hover:bg-gray-100 transition ease-in-out duration-300">
          <div className="h-[50%]">
            
             <Image src={map} width={290} height={174} alt="map" /> 
          </div>
          <div className="flex flex-col px-4 gap-4">
            <div className="font-semibold">Asset</div>
            <div className="flex justify-between w-full text-sm">
              <div className="flex flex-col">
                <div className="text-grayText">Asset ID</div>
                <div className="text-sm w-4/6 overflow-hidden">{assetId}</div>
              </div>
            </div>
  
            <div className="flex justify-between w-full text-sm">
              <div className="flex flex-col">
                <div className="text-grayText">Owner</div>
                <div className="text-sm w-4/6 overflow-hidden">{owner}</div>
              </div>
            </div>
            <div>
              <Button onClick={handleOnClick} label="put asset to Auction" />
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </>
    );
  };
  

  
let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});


const Item = ({ title, text, imageUrl, link, style }) => {
    return (
        <Link href={link} className={`${style || ''} ${link ? 'cursor-pointer' : 'cursor-not-allowed'} bg-no-repeat bg-center bg-cover rounded-[20px] min-w-[168px] flex-1 py-[16px] px-[18px]`} style={{ backgroundImage: `url(${imageUrl})`, boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <h2 className="text-white font-medium text-xl">{title}</h2>
            {text && <p className="text-white font-normal text-[15px]">{text}</p>}
        </Link>
    )
}

const Marketplace = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [assetButton, setAssetButton] = useState();
    const [activeTab, setActiveTab] = useState('Auctions');
    const [sideBarActive, setSideBarActive] = useState(false);
    const [toggleBidModal, setToggleBidModal] = useState(false);
    const [toggleCreateAuctionModal, setToggleCreateAuctionModal] = useState(false);
    const [auctions, setAuctions] = useState();
    const [solanaWallet,setSolanaWallet] = useState();
    const {user:selectorUser}=useAuth()
    const [user1, setUser1] = useState();  
    let router=useRouter()
      const handleAuctionAdd = async () => {
      setIsLoading(true);
      setToggleCreateAuctionModal(true);
      try {
        let ownerAddress = await solanaWallet.requestAccounts();
        let rpc = process.env.NEXT_PUBLIC_RPCENDPOINT;
        console.log('rpc',rpc)
        const umi=createUmi(rpc).use(mplBubblegum())
        umi.use(dasApi())
        console.log('owner address',ownerAddress)
        const rpcAssetList = await umi.rpc.getAssetsByOwner({ owner: ownerAddress[0] });
        
       /*  let assets = await axios.get('/api/getAssetsByOwner', {
          headers: { owner: ownerAddress[0] },
        }); */
        let assets=rpcAssetList.items.map((item) => item.id);
        console.log('asset ids', assets)
        console.log(ownerAddress[0]);
        //console.log('yo', assets.data.assetIds);
        let assetButtons = assets.map((item, idx) => {
          return (
            <AssetCard key={idx} assetId={item} owner={ownerAddress[0]} setIsLoading={setIsLoading} />
          );
        });
        setAssetButton(assetButtons);
      } catch (error) {
        console.log('error to get asset',error)
      }
      setIsLoading(false);
    };
    useEffect(() => {
      
        const authUser = async () => {
          const chainConfig = {
            chainNamespace: "solana",
            chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
            rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
            displayName: "Solana Mainnet",
            blockExplorer: "https://explorer.solana.com",
            ticker: "SOL",
            tickerName: "Solana",
          };
  
          const web3auth = new Web3Auth({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  
            web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
            chainConfig: chainConfig,
          });
  
          await web3auth.initModal();
  
          // await web3auth.connect();
  
          let userInfo;
  
          try {
            userInfo = await web3auth.getUserInfo();
          } catch (err) {
            
          }
  
          const fetchedToken = JSON.parse(
            localStorage.getItem("openlogin_store")
          );
  
          if (!selectorUser) {
            localStorage.removeItem("openlogin_store");
            router.push("/auth/join");
            return;
          }
  
          
          setUser1(selectorUser);
        };
  
        authUser();
      
    }, [user1]);

    useEffect(()=>{
      console.log('user',user1)
       if(user1){ let getWallet=async()=>{
            const chainConfig = {
                chainNamespace: "solana",
                chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
                rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
                displayName: "Solana Testnet",
                blockExplorer: "https://explorer.solana.com",
                ticker: "SOL",
                tickerName: "Solana",
              };
              const web3auth = new Web3Auth({
                clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        
                web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
                chainConfig: chainConfig,
              });
              await web3auth.initModal();
              // await web3auth.connect();
              const web3authProvider = await web3auth.connect();
        
              const solanaWallet = new SolanaWallet(web3authProvider); 
              const accounts = await solanaWallet.requestAccounts();
              setSolanaWallet(solanaWallet)
              console.log('ypp',accounts)
        }
        const getAuctions = async () => {
          const signatureObj = {};

            try {
              const domain = window.location.host;
              const origin = window.location.origin;
  
              const payload = new SIWPayload();
              payload.domain = domain;
              payload.uri = origin;
              payload.address = user1.blockchainAddress;
              payload.statement = "Sign in to SkyTrade app.";
              payload.version = "1";
              payload.chainId = 1;
  
              const header = { t: "sip99" };
              const network = "solana";
  
              let message = new SIWWeb3({ header, payload, network });
  
              const messageText = message.prepareMessage();
              const msg = new TextEncoder().encode(messageText);
              const result = await solanaWallet.signMessage(msg);
  
              const signature = base58.encode(result);
  
              signatureObj.sign = signature;
              signatureObj.sign_nonce = message.payload.nonce;
              signatureObj.sign_issue_at = message.payload.issuedAt;
              signatureObj.sign_address = user1.blockchainAddress;
              let ans = await fetch(`/api/proxy?${Date.now()}`, {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
    
                  uri: `/nft`,
                  sign: signatureObj.sign,
                  time: signatureObj.sign_issue_at,
                  nonce: signatureObj.sign_nonce,
                  address: signatureObj.sign_address,
                }                
              });
              ans = await ans.json();
              console.log('get cnfts',ans)
              //let ans = await axios.get('/api/postCnftAuction');
              //console.log('ans', ans);
              
                let resdata = ans.data;
                console.log('resdata', resdata);
                let ans2 = resdata.map((item, idx) => {
                  
                    return (
                      <AuctionCard
                        key={idx}
                        key1={idx}
                        assetId={item.assetId}
                        owner={item.owner}
                        highestBid={item.highestBid}
                        totalBids={item.totalBid}
                      />
                    );
                  
                });
                setAuctions(ans2);
              
            } catch (error) {
              console.log(error);
            }
          };
          
        getWallet()}
    },[user1,selectorUser])
    useEffect(()=>{
      console.log('user',user1)
      console.log(solanaWallet) 
      if(user1){ 
        const getAuctions = async () => {
          const signatureObj = {};

            try {
              const domain = window.location.host;
              const origin = window.location.origin;
  
              const payload = new SIWPayload();
              payload.domain = domain;
              payload.uri = origin;
              payload.address = user1.blockchainAddress;
              payload.statement = "Sign in to SkyTrade app.";
              payload.version = "1";
              payload.chainId = 1;
  
              const header = { t: "sip99" };
              const network = "solana";
  
              let message = new SIWWeb3({ header, payload, network });
  
              const messageText = message.prepareMessage();
              const msg = new TextEncoder().encode(messageText);
              const result = await solanaWallet.signMessage(msg);
  
              const signature = base58.encode(result);
  
              signatureObj.sign = signature;
              signatureObj.sign_nonce = message.payload.nonce;
              signatureObj.sign_issue_at = message.payload.issuedAt;
              signatureObj.sign_address = user1.blockchainAddress;
              let ans = await fetch(`/api/proxy?${Date.now()}`, {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
    
                  uri: `/nft`,
                  sign: signatureObj.sign,
                  time: signatureObj.sign_issue_at,
                  nonce: signatureObj.sign_nonce,
                  address: signatureObj.sign_address,
                }                
              });
              ans = await ans.json();
              console.log('get cnfts',ans)
              //let ans = await axios.get('/api/postCnftAuction');
              //console.log('ans', ans);
              
                let resdata = ans.data;
                console.log('resdata', resdata);
                let ans2 = resdata.map((item, idx) => {
                  
                    return (
                      <AuctionCard
                        key={idx}
                        key1={idx}
                        assetId={item.assetId}
                        owner={item.owner}
                        highestBid={item.highestBid}
                        totalBids={item.totalBid}
                      />
                    );
                  
                });
                setAuctions(ans2);
              
            } catch (error) {
              console.log(error);
            }
          };
          getAuctions();
        }
    },[user1,selectorUser])
    return (
        <Fragment>
            <Head>
                <title>SkyTrade - Marketplace</title>
            </Head>
            {isLoading && createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
            {isLoading && createPortal(<Spinner />, document.getElementById('backdrop-root'))}

            <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
                <Sidebar />
                <div className="w-full h-full flex flex-col">
                    <PageHeader pageTitle={'Marketplace'} />
                    <div className="flex w-full pr-8">
        <div className="min-h-screen ml-[5rem] self-end bg-white w-full flex justify-start items-center flex-col mt-20 px-[10rem] pb-8">
          <div className="pt-4 flex items-center justify-between w-full border-b">
            <div className="flex items-center gap-4 ">
              <div
                className={`${activeTab === 'Auctions' ? 'border-b-4  border-[#6CA1F7]' : 'text-gray-400'} font-medium px-8 py-2 cursor-pointer transition ease-linear delay-75`}
                onClick={() => setActiveTab('Auctions')}
              >
                Auctions
              </div>
            </div>
            <div className="">
              <Button onClick={handleAuctionAdd} label="Create Auction" />
            </div>
            {toggleCreateAuctionModal && (
              <CreateAuctionModal
                assetButton={assetButton}
                setToggleCreateAuctionModal={setToggleCreateAuctionModal}
              />
            )}
          </div>

          {activeTab === 'Auctions' && auctions && (
            <div className="grid grid-cols-1 lg:grid-cols-3 pt-8 w-full gap-8">{auctions}</div>
          )}

          {activeTab === 'Auctions' && !auctions && (
            <div className="pt-8 w-full gap-8 text-center italic text-grayText">
              No Auctions Available
            </div>
          )}
        </div>
      </div>
                </div>
            </div>
        </ Fragment>
    )
}

export default Marketplace;