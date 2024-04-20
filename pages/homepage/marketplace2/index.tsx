import React, { Fragment, useEffect, useState } from "react";

import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { CHAIN_NAMESPACES, OPENLOGIN_NETWORK } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import { SolanaWallet } from "@web3auth/solana-provider";
import base58 from "bs58";
import Head from "next/head";
import { createPortal } from "react-dom";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "../../../Components/Backdrop";
import { AssetCard } from "../../../Components/marketplace/AssetCard";
import { AuctionCard } from "../../../Components/marketplace/AuctionCard";
import { Button } from "../../../Components/marketplace/Button";
import CreateAuctionModal from "../../../Components/marketplace/CreateAuctionModal";
import PageHeader from "../../../Components/PageHeader";
import Sidebar from "../../../Components/Sidebar";
import Spinner from "../../../Components/Spinner";
import { useAuth } from "../../../hooks/useAuth";
import { OpenloginUserInfo } from "@web3auth/openlogin-adapter";
const Marketplace = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [assetButton, setAssetButton] = useState<React.ReactNode>();
  const [activeTab, setActiveTab] = useState("Auctions");
  const [toggleCreateAuctionModal, setToggleCreateAuctionModal] =
    useState(false);
  const [auctions, setAuctions] = useState();
  const [solanaWallet, setSolanaWallet] = useState<any>();
  //@ts-ignore
  const { user: selectorUser } = useAuth();
  const [user1, setUser1] = useState<any>();

  const handleAuctionAdd = async () => {
    setIsLoading(true);
    setToggleCreateAuctionModal(true);
    try {
      const ownerAddress = await solanaWallet.requestAccounts();
      const rpc = process.env.NEXT_PUBLIC_RPCENDPOINT;

      const umi = createUmi(rpc).use(mplBubblegum());
      umi.use(dasApi());

      const rpcAssetList = await umi.rpc.getAssetsByOwner({
        owner: ownerAddress[0]
      });

      const assets = rpcAssetList.items.map((item) => item.id);

      const assetButtons = assets.map((item: any, idx: any) => {
        return (
          <AssetCard
            key={idx}
            assetId={item}
            owner={ownerAddress[0]}
            setIsLoading={setIsLoading}
            user={user1}
            solanaWallet={solanaWallet}
          />
        );
      });

      setAssetButton(assetButtons);
    } catch (error) {
      console.error("error to get asset", error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    const authUser = async () => {
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
        displayName: "Solana Mainnet",
        blockExplorer: "https://explorer.solana.com",
        ticker: "SOL",
        tickerName: "Solana"
      };

      const web3auth = new Web3Auth({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

        web3AuthNetwork: process.env
          .NEXT_PUBLIC_AUTH_NETWORK as typeof OPENLOGIN_NETWORK.CYAN,
        chainConfig: chainConfig
      });

      await web3auth.initModal();

      try {
        await web3auth.getUserInfo();
      } catch (err) {
        console.error("error to get user", err);
      }
      setUser1(selectorUser);
    };

    authUser();
  }, [user1, selectorUser]);

  useEffect(() => {
    if (user1) {
      const getWallet = async () => {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: "Solana Testnet",
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana"
        };
        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

          web3AuthNetwork: process.env
            .NEXT_PUBLIC_AUTH_NETWORK as typeof OPENLOGIN_NETWORK.CYAN,
          chainConfig: chainConfig
        });
        await web3auth.initModal();

        const web3authProvider = await web3auth.connect();

        const solanaWallet = new SolanaWallet(web3authProvider);

        setSolanaWallet(solanaWallet);
      };

      getWallet();
    }
  }, [user1, selectorUser]);
  useEffect(() => {
    const signatureObj: {
      sign?: string;
      sign_nonce?: string;
      sign_issue_at?: string;
      sign_address?: string;
    } = {};
    if (user1 && solanaWallet) {
      const getAuctions = async () => {
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

          const message = new SIWWeb3({ header, payload, network });

          const messageText = message.prepareMessage();
          const msg = new TextEncoder().encode(messageText);
          const result = await solanaWallet.signMessage(msg);

          const signature = base58.encode(result);

          signatureObj.sign = signature;
          signatureObj.sign_nonce = message.payload.nonce;
          signatureObj.sign_issue_at = message.payload.issuedAt;
          signatureObj.sign_address = user1.blockchainAddress;
          const resNft = await fetch(`/api/proxy?${Date.now()}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",

              uri: `/nft`,
              sign: signatureObj.sign,
              time: signatureObj.sign_issue_at,
              nonce: signatureObj.sign_nonce,
              address: signatureObj.sign_address
            }
          });
          const resNftJson = await resNft.json();

          const resdata = resNftJson.data;

          const auction_card = resdata.map((item, idx) => {
            return (
              <AuctionCard
                key={idx}
                assetId={item.assetId}
                owner={item.owner}
                highestBid={item.highestBid}
                totalBids={item.totalBid}
                user={user1}
                solanaWallet={solanaWallet}
              />
            );
          });
          setAuctions(auction_card);
        } catch (error) {
          console.error(error);
        }
      };
      getAuctions();
    }
  }, [user1, selectorUser, solanaWallet]);
  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Marketplace</title>
      </Head>

      {isLoading &&
        createPortal(<Backdrop />, document.getElementById("backdrop-root"))}
      {isLoading &&
        createPortal(<Spinner />, document.getElementById("backdrop-root"))}

      <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
        <Sidebar />
        <div className="w-full h-full flex flex-col">
          <PageHeader pageTitle={"Marketplace"} />
          <div className="flex w-full pr-8">
            <div className="min-h-screen ml-[5rem] self-end bg-white w-full flex justify-start items-center flex-col mt-20 px-[10rem] pb-8">
              <div className="pt-4 flex items-center justify-between w-full border-b">
                <div className="flex items-center gap-4 ">
                  <div
                    className={`${activeTab === "Auctions" ? "border-b-4  border-[#6CA1F7]" : "text-gray-400"} font-medium px-8 py-2 cursor-pointer transition ease-linear delay-75`}
                    onClick={() => setActiveTab("Auctions")}
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

              {activeTab === "Auctions" && auctions && (
                <div className="grid grid-cols-1 lg:grid-cols-3 pt-8 w-full gap-8">
                  {auctions}
                </div>
              )}

              {activeTab === "Auctions" && !auctions && (
                <div className="pt-8 w-full gap-8 text-center italic text-grayText">
                  No Auctions Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Marketplace;
