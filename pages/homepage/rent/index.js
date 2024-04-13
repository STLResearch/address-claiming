import { Fragment, useState, useEffect, forwardRef } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import maplibregl from "maplibre-gl";
import {
  ArrowLeftIcon,
  CloseIcon,
  CloseIconWhite,
  LocationPointIcon,
  MagnifyingGlassIcon,
  SuccessIcon,
  InfoIcon,
  SuccessIconwhite,
  CloseIconWhitesm,
} from "@/Components/Icons";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import useDatabase from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import DatePicker from "react-datepicker";
import { Web3Auth } from "@web3auth/modal";
import { SolanaWallet } from "@web3auth/solana-provider";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import base58 from "bs58";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { BalanceLoader } from "@/Components/Wrapped";
import { toast } from "react-toastify";

const SuccessModal = ({
  setShowSuccess,
  finalAns,
  rentData,
  setShowClaimModal,
}) => {
  const router = useRouter();

  return (
    <div
      className={`w-[100%] max-w-[20rem] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40`}
    >
      {/* <div className=" text-xl text-black text-center"> {finalAns?.status} </div>
            <div className=" text-xl text-black text-center"> {finalAns?.message}</div>
 */}
      <div
        className={` w-[100%] h-[500px] py-10 z-40 flex flex-col gap-[15px] items-center  rounded-3xl ${finalAns?.status === "Rent SuccessFull" ? "bg-[#34A853]" : "bg-[#F5AA5E]"}`}
      >
        <div
          onClick={() => {
            setShowSuccess(false);
            setShowClaimModal(false);
          }}
          className="w-[10px] h-[10px] absolute top-[10px] right-[10px] "
        >
          <CloseIconWhite />
        </div>

        <div className="w-[54.56px] h-[54.56px]">
          {finalAns?.status === "Rent SuccessFull" ? (
            <SuccessIconwhite />
          ) : (
            <CloseIconWhite />
          )}
        </div>
        {finalAns?.status === "Rent SuccessFull" ? (
          <>
            <div className="w-[70%] h-[10%] ">
              <h1 className=" font-[500]  text-[22px] text-center text-[#FFFFFF] font-poppins">
                Your rental order is complete
              </h1>
            </div>
          </>
        ) : (
          <>
            <div className="w-[70%] h-[10%] ">
              <h1 className=" font-[500]  text-[22px] text-center text-[#FFFFFF] font-poppins">
                Rent failed
              </h1>
            </div>
          </>
        )}

        <div className="w-[80%] h-[108px] mt-[2rem] ">
          <div className="font-[400] text-[14px] leading-7 text-center text-[#FFFFFF] font-poppins">
            {finalAns?.status === "Rent SuccessFull" && (
              <div>
                'You rented'{" "}
                <span className=" text-[14px] font-bold">{`${rentData.address}`}</span>{" "}
                {` for `}{" "}

                <div  className="">

                <span className=" text-[14px] font-bold">
                  ${rentData.price}
                </span>
                </div>

              </div>
            )}     
          </div>

          <div className="font-[400] text-[14px] leading-7 text-center text-[#FFFFFF] font-poppins">
            {finalAns?.status !== "Rent SuccessFull" && (
              <div>An error occured, please try again.</div>
            )}
          </div>
        </div>

        {finalAns?.status === "Rent SuccessFull" && (
          <div className=" w-[75%] h-[10%]  ">
            <p className="font-[400] text-[10px] text-center text-[#FFFFFF]">
              A copy of your transaction is availble inside your Portfolio{" "}
            </p>
          </div>
        )}

        {finalAns?.status === "Rent SuccessFull" ? (
          <>
            <button
              onClick={() => router.push("/homepage/portfolio")}
              className=" py-2 w-[50%] h-[41px]  border rounded-md gap-10 bg-[#34A853] text-center text-[#FFFFFF] text-[14px]"
            >
              Portfolio
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setShowSuccess(false);
                setShowClaimModal(false);
              }}
              className=" mt-[2.5rem] py-2 w-[50%] h-[41px]  border rounded-md gap-10 text-center text-[#FFFFFF] text-[14px]"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ClaimModal = ({ setShowClaimModal, rentData, setIsLoading }) => {
  const defaultValueDate = dayjs()
    .add(1, "h")
    .set("minute", 30)
    .startOf("minute");
  const maxDate = dayjs().add(29, "day");
  const [owner, setOwner] = useState({});
  const [landAssetIds, setLandAssetIds] = useState([]);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [date, setDate] = useState(defaultValueDate);

  const [showSuccess, setShowSuccess] = useState(false);

  const [finalAns, setfinalAns] = useState();
  const { user: selectorUser } = useAuth();
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  useEffect(() => {
    const authUser = async () => {
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

      const solanaWallet = new SolanaWallet(web3authProvider); // web3auth.provider

      const user = await web3auth.getUserInfo(); // web3auth instance
      // Get user's Solana public address
      const accounts = await solanaWallet.requestAccounts();
      const connectionConfig = await solanaWallet.request({
        method: "solana_provider_config",
        params: [],
      });

      const connection = new Connection(connectionConfig.rpcTarget);

      // Fetch the balance for the specified public key
      const balance = await connection.getBalance(new PublicKey(accounts[0]));

      //const transaction = Transaction.from(Buffer.from(json.transaction, 'base64'));
      console.log("solanaWallet=", balance); // ui info wrong
    };
    authUser();
  }, [selectorUser]);

  useEffect(() => {
    async function getUsersFromBE() {
      try {
        setOwner(rentData.owner);
        console.log("user if this land", owner);
      } catch (error) {
        console.log(error);
      }
    }
    getUsersFromBE();
  }, [rentData]);

  const getTokenBalance = () => {
    const data = {
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        selectorUser.blockchainAddress,
        {
          mint: process.env.NEXT_PUBLIC_MINT_ADDRESS,
        },
        {
          encoding: "jsonParsed",
        },
      ],
    };

    fetch(process.env.NEXT_PUBLIC_SOLANA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error);
          });
        }

        return response.json();
      })
      .then((result) => {
        if (result.result.value.length < 1) {
          setTokenBalance("0");

          return;
        }

        setTokenBalance(
          result.result.value[0].account.data.parsed.info.tokenAmount
            .uiAmountString
        );
      });
  };

  useEffect(() => {
    getTokenBalance();
  }, []);

  const handleRentAirspace = async () => {
    if (parseFloat(tokenBalance) === 0) {
      return toast.error(
        "Please deposit some funds into your wallet to continue"
      );
    }

    setIsLoading(true);

    const chainConfig = {
      chainNamespace: "solana",
      chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
      rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
      displayName: `Solana ${process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME} `,
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

    const solanaWallet = new SolanaWallet(web3authProvider); // web3auth.provider

    console.log("date ansd time");
    console.log("da1", date.toString());
    //console.log("da2",time.add(30,'minute').toString())
    let startDate = new Date(date.toString());
    let endDate = new Date(startDate.getTime());
    endDate.setMinutes(endDate.getMinutes() + 30);
    console.log("start date in date fm", startDate);
    console.log("endtart date in date fm", endDate);

    if (startDate.getMinutes() % 30 != 0) {
      setfinalAns({
        status: "Rent failed",
        message:
          "Invalid time input. Please enter a time that is either a fixed hour or 30 minutes after the hour. For example, 1:00, 1:30, 2:00, 2:30, and so on.",
      });
      setShowSuccess(true);
      setIsLoading(false);
    } else {
      setLandAssetIds([rentData?.layers[0].tokenId]);
      console.log("landASSTId==", landAssetIds);
      console.log("res resll", rentData.layers[0].tokenId);

      let req1Body = {
        callerAddress: selectorUser.blockchainAddress,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        landAssetIds: [rentData.layers[0].tokenId],
      };
      console.log("reqbody", JSON.stringify(req1Body));
      let signatureObj = {};
      if (selectorUser) {
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

        const web3authProvider = await web3auth.connect();

        const solanaWallet = new SolanaWallet(web3authProvider);

        // const userInfo = await web3auth.getUserInfo();

        const domain = window.location.host;
        // const domain = 'localhost:3000';
        const origin = window.location.origin;
        // const origin = 'http://localhost:3000';

        const payload = new SIWPayload();
        payload.domain = domain;
        payload.uri = origin;
        payload.address = selectorUser.blockchainAddress;
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
        signatureObj.sign_address = selectorUser.blockchainAddress;
      }

      console.log("signature obj  ", signatureObj);

      try {
        let res = await fetch(`/api/proxy?${Date.now()}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

            uri: `/private/airspace-rental/create-mint-rental-token-ix`,
            sign: signatureObj.sign,
            time: signatureObj.sign_issue_at,
            nonce: signatureObj.sign_nonce,
            address: signatureObj.sign_address,
          },
          body: JSON.stringify(req1Body),
        });
        res = await res.json();
        if (res && res.errorMessage) {
          toast.error(res.errorMessage);
          setIsLoading(false);
          return;
        }
        if (res.statusCode == 400) {
          setShowSuccess(true);
          setfinalAns({
            status: "Rent failed",
            message: res.errorMessage,
          });
          setIsLoading(false);
          return;
        }
        const transaction = Transaction.from(Buffer.from(res, "base64"));
        //let partialsignedTx=transaction.partialSign(solanaWallet);
        //console.log("is solana wallet partial=",partialsignedTx)
        const signedTx = await solanaWallet.signTransaction(transaction);
        let serializedTx = signedTx.serialize({ requireAllSignatures: false });
        let txToString = serializedTx.toString("base64");
        if (signedTx) {
          let req2body = {
            transaction: txToString,
            landAssetIds: [rentData?.layers[0].tokenId],
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
          };
          console.log("final exexution", JSON.stringify(req2body));
          signatureObj = {};
          if (selectorUser) {
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

            const web3authProvider = await web3auth.connect();

            const solanaWallet = new SolanaWallet(web3authProvider);

            // const userInfo = await web3auth.getUserInfo();

            const domain = window.location.host;
            // const domain = 'localhost:3000';
            const origin = window.location.origin;
            // const origin = 'http://localhost:3000';

            const payload = new SIWPayload();
            payload.domain = domain;
            payload.uri = origin;
            payload.address = selectorUser.blockchainAddress;
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
            signatureObj.sign_address = selectorUser.blockchainAddress;
          }
          let ans2 = await fetch(`/api/proxy?${Date.now()}`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",

              uri: `/private/airspace-rental/execute-mint-rental-token-ix`,
              sign: signatureObj.sign,
              time: signatureObj.sign_issue_at,
              nonce: signatureObj.sign_nonce,
              address: signatureObj.sign_address,
            },
            body: JSON.stringify(req2body),
          });
          ans2 = await ans2.json();

          if (ans2 && ans2.errorMessage) {
            toast.error(ans2.errorMessage);
            setIsLoading(false);
            return;
          }

          if (ans2) {
            if (ans2.data.status == "success") {
              setfinalAns({
                status: "Rent SuccessFull",
                message: ans2.data.message,
              });
            } else {
              setfinalAns({
                status: "Rent failed",
                message: ans2.data.message,
              });
            }

            setShowSuccess(true);

            setIsLoading(false);
          }
        }
      } catch (error) {
        setfinalAns({ status: "Rent failed", message: error });

        setIsLoading(false);
      }
    }
  };
  if (showSuccess) {
    return (
      <SuccessModal
        setShowSuccess={setShowSuccess}
        finalAns={finalAns}
        rentData={rentData}
        setShowClaimModal={setShowClaimModal}
      />
    );
  }
  const shouldDisableTime = (value, view) => {
    if (view === "minutes" && value.minute() >= 1 && value.minute() <= 29) {
      return true;
    } else if (
      view === "minutes" &&
      value.minute() >= 31 &&
      value.minute() <= 59
    ) {
      return true;
    } else {
      return false;
    }
  };

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div
      className="w-full cursor-pointer border rounded-xl p-4 border-gray-400"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </div>
  ));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        className="touch-manipulation fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-[30px] md:rounded-[30px] px-[29px] w-full max-h-screen h-screen md:max-h-[700px] md:h-auto  md:w-[689px] z-40 flex flex-col gap-[15px]"
      >
        <div
          className="touch-manipulation relative flex items-center gap-[20px] md:p-0 py-[20px] px-[29px] -mx-[29px] -mt-[30px] md:my-0 md:mx-0 md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div
            className="w-[16px] h-[12px] md:hidden"
            onClick={() => {
              console.log("ggdgdgdg");
            }}
          >
            <ArrowLeftIcon />
          </div>
          <h2 className="text-[#222222] text-center font-medium text-xl">
            {" "}
            Airspace Details
          </h2>
          <div
            onClick={() => {
              setShowClaimModal(false);
            }}
            className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"
          >
            <CloseIcon />
          </div>
        </div>
        <div
          className="touch-manipulation flex items-center gap-[10px] py-4 px-[22px] rounded-lg"
          style={{ border: "1px solid #4285F4" }}
        >
          <div className="w-6 h-6">
            <LocationPointIcon />
          </div>
          <p className="font-normal text-[#222222] text-[14px] flex-1">
            {rentData ? rentData.address : ""}
          </p>
        </div>
        <div className="gap-[5px] touch-manipulation">
          <span>Owner</span>
          <span> {owner ? owner.name : "grgr"}</span>
        </div>
        <div className="flex touch-manipulation items-center justify-evenly gap-[20px] text-[14px]">
          <div className="flex touch-manipulation flex-col gap-[5px] w-full">
            <div className="flex items-center gap-[5px]">
              <label htmlFor="rentalDate">
                Rental Date and Time
                <span className="text-[#E04F64] touch-manipulation">*</span>
              </label>
              <div
                onClick={() => setIsInfoVisible((prev) => !prev)}
                className="relative flex h-[20px] w-[20px] items-center justify-center"
              >
                <InfoIcon />
                {isInfoVisible && (
                  <div className="absolute -top-4 left-6 w-[189px] rounded-[4px] bg-[#CCE3FC] p-[12px] text-[10px] font-normal italic">
                    Note that we store your data securely with advanced encryption and
                    strict authentication measures to ensure utmost privacy and
                    protection.
                  </div>
                )}
              </div>
            </div>
            {/* <DatePicker
                    selected={date}
                    onChange={(d) => setDate(d)}
                    customInput={<ExampleCustomInput />}
                    /> */}
            <DateTimePicker
              value={date}
              onChange={(e) => {
                setDate(e);
              }}
              disablePast
              maxDate={maxDate}
              shouldDisableTime={shouldDisableTime}
            />
          </div>
        </div>

        <div className="touch-manipulation flex items-center justify-center gap-[20px] text-[14px]">
          <div
            onClick={() => {
              setShowClaimModal(false);
            }}
            className="touch-manipulation rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer w-1/2"
            style={{ border: "1px solid #0653EA" }}
          >
            Cancel
          </div>
          <div
            onClick={handleRentAirspace}
            className="touch-manipulation rounded-[5px] py-[10px] px-[22px] text-white bg-[#0653EA] cursor-pointer w-1/2"
          >
            Rent Airspace
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

const Explorer = ({
  loadingReg,
  loading,
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
  regAdressShow,
  registeredAddress,
  map,
  marker,
  setMarker,
  showClaimModal,
  setShowClaimModal,
  rentData,
  setRentData,
  user1,
}) => {
  const [selectedAddress, setSelectedAddress] = useState();
  console.log({ loading });
  return (
    <div
      className="hidden md:flex bg-[#FFFFFFCC] py-[43px] px-[29px] rounded-[30px] flex-col items-center gap-[15px] max-w-[362px] max-h-full z-20 m-[39px]"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex gap-[5px] items-center">
        <p className="text-xl font-medium text-[#222222]">SkyMarket Hub</p>
      </div>
      <p className="text-[15px] font-normal text-[#222222]">
        Explore and Own Low-Altitude Airspaces, Your Gateway to Aerial Freedom.
      </p>
      <div
        className="relative px-[22px] py-[16px] bg-white rounded-lg w-full"
        style={{ border: "1px solid #87878D" }}
      >
        <input
          autoComplete="off"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="searchAirspaces"
          id="searchAirspaces"
          placeholder="Search Airspaces"
          className="outline-none w-full pr-[20px]"
        />
        <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
          <MagnifyingGlassIcon />
        </div>
      </div>
      {showOptions && (
        <div className=" overflow-y-scroll max-h-60 w-full flex-col z-20 bg-white">
          {loading ? (
            <div className="pt-8 flex justify-center items-center">
              <BalanceLoader />
            </div>
          ) : (
            addresses.map((item) => {
              return (
                <div
                  key={item.id}
                  value={item.place_name}
                  onClick={() => handleSelectAddress(item.place_name)}
                  className="w-full p-5 text-left text-[#222222]  "
                  style={{
                    borderTop: "0.2px solid #222222",
                  }}
                >
                  {item.place_name}
                </div>
              );
            })
          )}
        </div>
      )}

      {loadingReg && (
        <div className="mt-4">
          <BalanceLoader />
        </div>
      )}

      {regAdressShow && (
        <div
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
          className=" mt-5 bg-white w-full flex-col h-auto max-h-60 overflow-y-scroll"
        >
          {registeredAddress.map((item) => {
            //add popup to black ones
            const rentCLickHandler = () => {
              let el1 = document.createElement("div");

              console.log("am rrent clickedd", item.id);
              setSelectedAddress(item.id);

              el1.id = "marker2";
              let lat1 = item.latitude;
              let lng1 = item.longitude;
              let ans2 = new mapboxgl.LngLat(lng1, lat1);
              let newMap = map;
              if (marker) {
                marker.remove();
              }
              let marker1 = new maplibregl.Marker({ color: "#0653EA" })
                .setLngLat(ans2)
                .addTo(map);
              setMarker(marker1);
            };

            const onClickRent = () => {
              console.log("hello rent data==", rentData);
              setRentData(item);
              setShowClaimModal(true);
            };

            return (
              <div
                key={item.id}
                value={item.address}
                onClick={rentCLickHandler}
                className={
                  item.id != selectedAddress
                    ? ` p-5 text-left text-[#913636] w-full flex justify-between text-[12px]`
                    : `bg-[#0653EA] p-5 text-left text-white w-full flex justify-between text-[10px]`
                }
                style={{
                  borderTop: "5px solid #FFFFFFCC",
                }}
              >
                <h3 className="text-black pt-[0.6rem]">{item.address}</h3>
                <h1
                  className={
                    item.id != selectedAddress
                      ? " text-black font-black text-center text-[15px]  cursor-pointer py-2 px-2"
                      : " text-white font-black text-center text-[15px]  cursor-pointer py-2 px-2"
                  }
                >
                  ${item.price}
                </h1>
                <span
                  onClick={onClickRent}
                  className={
                    item.id != selectedAddress
                      ? "bg-[#0653EA] text-white rounded-lg  text-center text-[15px] font-normal cursor-pointer py-2 px-2 flex flex-col item-center justify-center"
                      : "bg-[#e8e9eb] text-[#0653EA] rounded-lg  text-center text-[15px] font-normal cursor-pointer py-2 px-2 flex flex-col item-center justify-center"
                  }
                >
                  RENT
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ExplorerMobile = ({
  loadingReg,
  loading,
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
}) => {
  return (
    <div className="flex bg-white items-center gap-[15px] pb-[19px] px-[21px] z-[40]">
      <div
        className="relative px-[22px] py-[16px] bg-white rounded-lg w-full"
        style={{ border: "1px solid #87878D" }}
      >
        <input
          autoComplete="off"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="searchAirspaces"
          id="searchAirspaces"
          placeholder="Search Airspaces"
          className="outline-none w-full pr-[20px]"
        />
        <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
          <MagnifyingGlassIcon />
        </div>
        {showOptions && (
          <div className="absolute top-[55px] left-0 bg-white w-full flex-col">
            {loading ? (
              <div className="pt-8 flex justify-center items-center">
                <BalanceLoader />
              </div>
            ) : (
              addresses.map((item) => {
                return (
                  <div
                    key={item.id}
                    value={item.place_name}
                    onClick={() => handleSelectAddress(item.place_name)}
                    className="p-5 text-left text-[#222222] w-full"
                    style={{
                      borderTop: "0.2px solid #222222",
                    }}
                  >
                    {item.place_name}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Rent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingRegAddresses, setLoadingRegAddresses] = useState(false);
  const [map, setMap] = useState(null);
  const { isMobile } = useMobile();
  const [registeredAddress, setRegisteredAddress] = useState([]);
  const [mapMove, setMapMove] = useState();
  const [address, setAddress] = useState("");
  const [addressData, setAddressData] = useState();
  const [addresses, setAddresses] = useState([]);
  const [flyToAddress, setFlyToAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    longitude: "",
    latitude: "",
  });

  const [token, setToken] = useState();
  const [marker, setMarker] = useState();
  const [rentData, setRentData] = useState();
  const [showClaimModal, setShowClaimModal] = useState(false);

  const defaultData = {
    address: flyToAddress,
    name: "",
    rent: false,
    sell: false,
    hasPlanningPermission: null,
    hasChargingStation: false,
    hasLandingDeck: false,
    hasStorageHub: false,
    sellingPrice: "",
    timezone: "UTC+0",
    transitFee: "1-99",
    isFixedTransitFee: false,
    noFlyZone: false,
    weekDayRanges: [
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 0 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 1 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 2 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 3 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 4 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 5 },
      { fromTime: 0, toTime: 24, isAvailable: false, weekDayId: 6 },
    ],
  };

  const { user: selectorUser } = useAuth();
  const [user1, setUser1] = useState();
  const [data, setData] = useState({ ...defaultData });
  const [regAdressShow, setRegAdressShow] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
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

        setToken(fetchedToken.sessionId);
        setUser1(selectorUser);
      };

      authUser();
    }
  }, []);

  useEffect(() => {
    if (map) return;
    const createMap = () => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-104.718243, 40.413869],
        zoom: 15,
        // attributionControl: false
      });

      newMap.on("load", function () {
        newMap.addLayer({
          id: "maine",
          type: "fill",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [],
              },
            },
          },
          layout: {},
          paint: {
            "fill-color": "#D20C0C",
          },
        });
      });

      let timeoutId;

      newMap.on("move", async (e) => {
        setLoadingRegAddresses(true);

        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          let el = document.createElement("div");
          el.id = "markerWithExternalCss";
          let crds = e.target.getBounds();

          const signatureObj = {};

          if (user1) {
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

            const web3authProvider = await web3auth.connect();

            const solanaWallet = new SolanaWallet(web3authProvider);
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
          }

          let res = await fetch(`/api/proxy?${Date.now()}`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",

              uri: `/public/properties/`,
              sign: signatureObj.sign,
              time: signatureObj.sign_issue_at,
              nonce: signatureObj.sign_nonce,
              address: signatureObj.sign_address,
            },
            body: JSON.stringify({
              minLongitude: crds._sw.lng,
              minLatitude: crds._sw.lat,
              maxLongitude: crds._ne.lng,
              maxLatitude: crds._ne.lat,
            }),
          });
          res = await res.json();

          let ans,
            features1 = [];
          if (res) {
            ans = res.filter((property1) => {
              if (
                property1.longitude >= crds._sw.lng &&
                property1.longitude <= crds._ne.lng &&
                property1.latitude >= crds._sw.lat &&
                property1.latitude <= crds._ne.lat
              ) {
                return property1;
              }
            });
          }

          setRegisteredAddress(ans);
          setLoadingRegAddresses(false);

          if (ans.length > 0) {
            for (let i = 0; i < ans.length; i++) {
              let lng1 = ans[i].longitude;
              let lat1 = ans[i].latitude;
              let ans2 = new mapboxgl.LngLat(lng1, lat1);

              let popup1 = new maplibregl.Popup().setHTML(
                `<strong>${ans[i].address}</strong>`
              );
              new maplibregl.Marker(el)
                .setLngLat(ans2)
                .setPopup(popup1)
                .addTo(newMap);
            }
          }
        }, 3000);
      });

      setMap(newMap);
    };

    createMap();
  }, []);

  useEffect(() => {
    if (registeredAddress.length > 0) {
      setRegAdressShow(true);
    } else {
      setRegAdressShow(false);
    }
  }, [registeredAddress]);

  useEffect(() => {
    if (!showOptions) setShowOptions(true);
    if (!address) return setShowOptions(false);

    let timeoutId;

    const getAddresses = async () => {
      setLoadingAddresses(true);
      setCoordinates({ longitude: "", latitude: "" });

      timeoutId = setTimeout(async () => {
        try {
          const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

          const response = await fetch(mapboxGeocodingUrl);
          const data = await response.json();
          if (!response.ok) {
            setLoadingAddresses(false);
            throw new Error("Error while getting addresses");
          }

          if (data.features && data.features.length > 0) {
            setAddresses(data.features);
            setLoadingAddresses(false);
          } else {
            setAddresses([]);
            setLoadingAddresses(false);
          }
        } catch (error) {
          console.log(error);
          setLoadingAddresses(false);
        }
      }, 500);
    };

    getAddresses();

    return () => clearTimeout(timeoutId);
  }, [address]);

  useEffect(() => {
    if (!flyToAddress) return;

    const goToAddress = async () => {
      try {
        setIsLoading(true);

        const mapBoxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${flyToAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

        const response = await fetch(mapBoxGeocodingUrl);

        if (!response.ok)
          throw new Error("Error while getting new address location");

        const data = await response.json();

        if (!data.features || data.features.length === 0) {
          throw new Error("Address not found");
        }

        const coordinates = data.features[0].geometry.coordinates;
        const endPoint = [coordinates[0], coordinates[1]];

        setCoordinates({ longitude: coordinates[0], latitude: coordinates[1] });
        setAddressData(data.features[0].properties);
        setIsLoading(false);

        map.flyTo({
          center: endPoint,
          zoom: 16,
        });

        if (marker) {
          marker.remove();
        }

        let el = document.createElement("div");
        el.id = "markerWithExternalCss";

        // Add the new marker to the map and update the marker state
        const newMarker = new maplibregl.Marker(el)
          .setLngLat(endPoint)
          .addTo(map);
        setMarker(newMarker);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };

    goToAddress();
  }, [flyToAddress, map]);

  useEffect(() => {
    if (flyToAddress === address) setShowOptions(false);
    if (flyToAddress) setData((prev) => ({ ...prev, address: flyToAddress }));
  }, [flyToAddress, address]);

  const handleSelectAddress = (placeName) => {
    setAddress(placeName);
    setFlyToAddress(placeName);
    setShowOptions(false);
  };

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Marketplace : Rent</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}

      <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center  overflow-hidden ">
        <Sidebar />

        <div className="w-full h-full flex flex-col">
          <PageHeader pageTitle={isMobile ? "Rent" : "Marketplace: Rent"} />
          {isMobile && (
            <ExplorerMobile
              loadingReg={loadingRegAddresses}
              loading={loadingAddresses}
              address={address}
              setAddress={setAddress}
              addresses={addresses}
              showOptions={showOptions}
              handleSelectAddress={handleSelectAddress}
            />
          )}
          <section
            className={`flex relative w-full h-full justify-start items-start md:mb-0 mb-[79px] `}
          >
            <div
              className={`!absolute !top-0 !left-0 !w-full !h-screen !m-0 `}
              //className={`position: absolute; top: 0; bottom: 0; width: 100%`}

              id="map"
              style={{ zIndex: "20" }}
            />

            {!isMobile && (
              <div className="flex justify-start items-start">
                <Explorer
                  loadingReg={loadingRegAddresses}
                  loading={loadingAddresses}
                  address={address}
                  setAddress={setAddress}
                  addresses={addresses}
                  showOptions={showOptions}
                  handleSelectAddress={handleSelectAddress}
                  regAdressShow={regAdressShow}
                  registeredAddress={registeredAddress}
                  map={map}
                  marker={marker}
                  setMarker={setMarker}
                  showClaimModal={showClaimModal}
                  setShowClaimModal={setShowClaimModal}
                  rentData={rentData}
                  setRentData={setRentData}
                  user1={user1}
                />
                {/* {showClaimModal &&  */}

                {showClaimModal && (
                  <ClaimModal
                    setShowClaimModal={setShowClaimModal}
                    rentData={rentData}
                    setIsLoading={setIsLoading}
                    regAdressShow={regAdressShow}
                    registeredAddress={registeredAddress}
                  />
                )}

                {/* } */}
              </div>
            )}
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Rent;
