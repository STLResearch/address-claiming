import { useContext } from "react";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import { Web3authContext } from "@/providers/web3authProvider";
import axios from "axios";
import base58 from "bs58";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/nextjs";

interface RequestI {
  uri: string;
  isPublic?: boolean;
  postData?: any;
  suppressErrorReporting?: boolean;
}

const TIMEOUT = 300000;
const CUSTOM_ERROR_MESSAGE = "An Error occured! Please try again later.";

const Service = () => {
  const { provider } = useContext(Web3authContext);

  const isLocalhostUrl = (url: string): boolean => {
    const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/;
    return localhostRegex.test(url);
  };

  const getRequestUrl = (uri: string): string => {
    const serverUrl = String(process.env.NEXT_PUBLIC_SERVER_URL);

    return `${serverUrl}${uri}`;
  };

  const toastError = (error: any, suppressErrorReporting?: boolean) => {
    console.error(error);
    if (!suppressErrorReporting && error.response) {
      const backendError =
        error.response.data.errorMesagge || error.response.data.data.message;

      if (backendError && backendError !== "UNAUTHORIZED") {
        toast.error(backendError);
      } else {
        toast.error(CUSTOM_ERROR_MESSAGE);
      }
    }
    Sentry.captureException(error);
  };

  const createHeader = async ({
    isPublic,
    uri,
  }: {
    uri: string;
    isPublic?: boolean;
  }) => {
    try {
      let newHeader = {};

      if (provider && !isPublic) {
        const solanaWallet = new SolanaWallet(provider);
        const accounts = await solanaWallet.requestAccounts();

        const payload = new SIWPayload();

        payload.domain = String(process.env.NEXT_PUBLIC_FRONTEND_DOMAIN);
        payload.uri = String(process.env.NEXT_PUBLIC_FRONTEND_URI);
        payload.address = accounts[0];
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

        newHeader = {
          "Content-Type": "application/json",
          sign: signature,
          // Support localhost
          sign_issue_at: message.payload.issuedAt,
          sign_nonce: message.payload.nonce,
          sign_address: accounts[0],
        };
      } else {
        newHeader = {
          "Content-Type": "application/json",
        };
      }

      return {
        ...newHeader,
        api_key: process.env.NEXT_PUBLIC_FRONTEND_API_KEY, // TODO: remove
      };
    } catch (error) {
      console.error(error);
    }
  };

  const getRequest = async ({
    uri,
    isPublic,
    suppressErrorReporting,
  }: RequestI) => {
    try {
      const headers = await createHeader({ isPublic, uri });

      if (!isPublic && !headers) return null;
      return await axios({
        method: "get",
        timeout: TIMEOUT,
        url: getRequestUrl(uri),
        headers,
      });
    } catch (error) {
      toastError(error, suppressErrorReporting);
    }
  };

  const postRequest = async ({
    uri,
    postData,
    isPublic,
    suppressErrorReporting,
  }: RequestI) => {
    try {
      const headers = await createHeader({ isPublic, uri });

      if (!isPublic && !headers) return null;

      return await axios({
        method: "post",
        url: getRequestUrl(uri),
        timeout: TIMEOUT,
        data: { ...postData },
        headers,
      });
    } catch (error) {
      toastError(error, suppressErrorReporting);
    }
  };

  const patchRequest = async ({
    uri,
    postData,
    isPublic,
    suppressErrorReporting,
  }: RequestI) => {
    try {
      const headers = await createHeader({ isPublic, uri });

      if (!isPublic && !headers) return null;

      return await axios({
        method: "patch",
        url: getRequestUrl(uri),
        timeout: TIMEOUT,
        data: { ...postData },
        headers,
      });
    } catch (error) {
      toastError(error, suppressErrorReporting);
    }
  };

  const deleteRequest = async ({
    uri,
    postData,
    isPublic,
    suppressErrorReporting,
  }: RequestI) => {
    try {
      const headers = await createHeader({ isPublic, uri });

      if (!isPublic && !headers) return null;

      return await axios({
        method: "delete",
        url: getRequestUrl(uri),
        timeout: TIMEOUT,
        data: { ...postData },
        headers,
      });
    } catch (error) {
      toastError(error, suppressErrorReporting);
    }
  };
  return { getRequest, postRequest, patchRequest, deleteRequest };
};

export default Service;
