"use client";  

import React, { useState, useEffect, Fragment, useContext } from "react";
import { useRouter } from "next/navigation";
import { PublicKey, Connection } from "@solana/web3.js";
import useAuth from '@/hooks/useAuth';
import { SolanaWallet } from "@web3auth/solana-provider";
import Sidebar from "../Sidebar";
import PageHeader from "../PageHeader";
import Backdrop from "../Backdrop";
import Spinner from "../Spinner";
import AvailableBalance from "./AvailableBalance";
import DepositAndWithdraw from "./DepositAndWithdraw";
import TransactionHistory from "./TransactionHistory";
import Head from "next/head";
import { ConnectionConfig,Transaction } from "../../types";
import { Web3authContext } from "@/providers/web3auth";
import MainLayout from "@/layout/MainLayout";


const Funds  = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<number>(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [transactionHistory, setTransactionHistory] = useState<any>();
    const [refetchBal, setreFetchBal] = useState<boolean>(true);
    const { user, web3authStatus } = useAuth();
    const [tokenBalance, setTokenBalance] = useState<number>(0);
    const router = useRouter();
    const [solbalance, setSolBalance] = useState<number>(0);
    const { provider } = useContext(Web3authContext);
  
  
    //get sol balance
    useEffect(() => {
        
      let fetchbalance = async () => {
        if (user && provider) {
          const solanaWallet = new SolanaWallet(provider);
  
          console.log("solana wallet ", solanaWallet);
          const accounts = await solanaWallet.requestAccounts();
  
        const connectionConfig: ConnectionConfig = await solanaWallet.request({
            method: "solana_provider_config",
            params: [],
          });
  
        const connection = new Connection(connectionConfig.rpcTarget);
        const solbalance1 = await connection.getBalance(
          new PublicKey(accounts[0])
        );
          setSolBalance(solbalance1);
        }
      };
      fetchbalance()
        // make sure to catch any error
        .catch(console.error);
    }, [solbalance, user, web3authStatus]);
  
    // GET TRANSACTION HISTORY
    useEffect(() => {
      if (user) {
        fetch(
          `https://api.solana.fm/v0/accounts/${user?.blockchainAddress}/transfers?inflow=true&outflow=true&mint=${process.env.NEXT_PUBLIC_MINT_ADDRESS}&page=1`
        )
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error(errorData.error);
              });
            }
  
            return response.json();
          })
          .then((result) => {
            if (result.results) {
              setTransactionHistory(result.results);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, [user, web3authStatus]);
  
    useEffect(() => {
      if (transactionHistory) {
        const collectedTransactions: any[] = [];
  
        for (const trans of transactionHistory) {
            trans.data.forEach((key: any) => {
                const date = new Date(key.timestamp * 1000);
                const month = date.toLocaleString("default", { month: "short" });
                const day = date.getDate();
                const year = date.getFullYear();
                const hour = date.getHours().toString().padStart(2, "0");
                const minute = date.getMinutes().toString().padStart(2, "0");
                const second = date.getSeconds().toString().padStart(2, "0");
                //   key.date = `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
                key.date = `${month} ${day}, ${year}`;
      
                if (key.token && key.amount >= 10000) {
                  key.hash = trans.transactionHash.substring(0, 15) + "...";
                  key.transHash = trans.transactionHash;
                  collectedTransactions.push(key);
                }
            })
        }
  
        console.log(collectedTransactions);
        setTransactions(collectedTransactions);
      }
    }, [transactionHistory, user, web3authStatus]);
  
    return (
      <MainLayout 
        title="Funds" 
        isLoading={isLoading} 
        showSidebar={true}
        showPageHeader={true}
      >
        <section className="relative  w-full h-full py-6 md:py-[37px]  flex flex-col gap-8 mb-[78.22px]  md:mb-0 overflow-y-scroll sm:pl-[68.82px] sm:pr-[55px]">
          <div className="flex  sm:gap-[50px] flex-wrap justify-center">
            <div className="flex flex-col gap-5 items-center sm:items-start ">
              <AvailableBalance
                solbalance={solbalance}
              />
              <DepositAndWithdraw
                walletId={user?.blockchainAddress}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                setreFetchBal={setreFetchBal}
                refetchBal={refetchBal}
                setTokenBalance={setTokenBalance}
                tokenBalance={tokenBalance}
                solbalance={solbalance}
              />
            </div>
            <TransactionHistory transactions={transactions} user={user} />
          </div>
        </section>
      </MainLayout>
    );
  };

export default Funds;