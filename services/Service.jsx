import React, { Fragment, useContext } from 'react';
import { SolanaWallet } from '@web3auth/solana-provider';
import { Payload as SIWPayload, SIWWeb3 } from '@web3auth/sign-in-with-web3';
import { Web3authContext } from '@/providers/web3authProvider';
import axios from 'axios';
import base58 from 'bs58';
import { toast } from 'react-toastify';

const Service = () => {
  const { provider } = useContext(Web3authContext)

  const toastError = (error, suppressErrorReporting) => {
    console.error(error);
    if ( 
      !suppressErrorReporting &&
      error.response &&
      error.response.status === 500 && 
      error.response?.data?.errorMessage
    ) {
      if (error.response?.data?.errorMessage !== "UNAUTHORIZED") {
        toast.error(error.response?.data?.errorMessage)
      }
    }
  }

  const createHeader = async ({ uri, isPublic }) => {
    try {
      if (isPublic === true) {
        return {
          URI: uri,
          'Content-Type': 'application/json'
        }
      }
      if (!provider) return;

      const solanaWallet = new SolanaWallet(provider);
      const accounts = await solanaWallet.requestAccounts();

      const domain = window.location.host;
      const origin = window.location.origin;
      const payload = new SIWPayload();

      payload.domain = domain;
      payload.uri = origin;
      payload.address = accounts[0];
      payload.statement = 'Sign in to SkyTrade app.';
      payload.version = '1';
      payload.chainId = 1;

      const header = { t: 'sip99' };
      const network = 'solana';

      let message = new SIWWeb3({ header, payload, network });

      const messageText = message.prepareMessage();
      const msg = new TextEncoder().encode(messageText);
      const result = await solanaWallet.signMessage(msg);

      const signature = base58.encode(result);
      const signatureObj = {};

      signatureObj.sign = signature;
      signatureObj.sign_nonce = message.payload.nonce;
      signatureObj.sign_issue_at = message.payload.issuedAt;
      signatureObj.sign_address = accounts[0];

      return {
        'Content-Type': 'application/json',
        URI: uri,
        sign: signatureObj.sign,
        time: signatureObj.sign_issue_at,
        nonce: signatureObj.sign_nonce,
        address: signatureObj.sign_address,
      };
    } catch (error) {
      console.error(error);
    }
  }

  const getRequest = async ({ uri, isPublic, suppressErrorReporting }) => {
    try {
      const headers = await createHeader({ uri, isPublic })

      if (!isPublic && !headers) return null;

      return await axios({
        method: "get",
        url: `/api/proxy?${Date.now()}`,
        headers
      });
    } catch (error) {
      toastError(error, suppressErrorReporting);
    }
  }

  const postRequest = async ({ uri, postData, isPublic, suppressErrorReporting }) => {
    try {
      const headers = await createHeader({ uri, isPublic })

      if (!isPublic && !headers) return null;

      return await axios({
        method: "post",
        url: `/api/proxy?${Date.now()}`,
        data: {...postData},
        headers
      });

    } catch (error) {
      toastError(error, suppressErrorReporting);
    }
  }

  const patchRequest = async ({ uri, postData, isPublic, suppressErrorReporting }) => {
    try {
      const headers = await createHeader({ uri, isPublic })

      if (!isPublic && !headers) return null;

      return await axios({
        method: "patch",
        url: `/api/proxy?${Date.now()}`,
        data: {...postData},
        headers
      });

    } catch (error) {
      toastError(error, suppressErrorReporting);
    }
  }

  const deleteRequest = async ({ uri, postData, isPublic, suppressErrorReporting }) => {
    try {
      const headers = await createHeader({ uri, isPublic })

      if (!isPublic && !headers) return null;

      return await axios({
        method: "delete",
        url: `/api/proxy?${Date.now()}`,
        data: {...postData},
        headers
      });

    } catch (error) {
      toastError(error, suppressErrorReporting);
    }
  }
  return { getRequest, postRequest, patchRequest, deleteRequest };
}


export default Service;
