import { Fragment, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Script from 'next/script';
import {
  DroneIcon,
  GiftIcon,
  WalletIcon,
  LocationPointIcon,
  ChevronRightIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  EarthIcon,
} from '@/Components/Icons';
import Sidebar from '@/Components/Sidebar';
import PageHeader from '@/Components/PageHeader';
import Spinner from '@/Components/Spinner';
import Backdrop from '@/Components/Backdrop';
import WorldMap from '@/Components/WorldMap';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { Web3Auth } from '@web3auth/modal';
import { SolanaWallet } from '@web3auth/solana-provider';
import { Payload as SIWPayload, SIWWeb3 } from '@web3auth/sign-in-with-web3';
import base58 from 'bs58';
import useDatabase from '@/hooks/useDatabase';
import Head from 'next/head';

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const Item = ({ children, title, icon, linkText, href, style }) => {
  return (
    <div
      className={`${style || ''} relative flex w-full flex-col gap-[15px] rounded-[30px] bg-white pb-[21px] pl-[25px] pr-[18px] pt-[17px] md:w-[343px]`}
      style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}
    >
      <div className='flex items-center justify-between'>
        <p className='text-xl font-medium text-[#222222]'>{title}</p>
        <div className='flex items-center justify-center rounded-[50%] bg-[#CCE3FC] p-[10px]'>
          <div className='h-6 w-6'>{icon}</div>
        </div>
      </div>
      {children}
      <Link href={href}>
        <p className='cursor-pointer text-right text-base font-medium text-[#0653EA]'>
          {linkText}
        </p>
      </Link>
    </div>
  );
};

const AvailableBalance = ({ balance = 0 }) => {
  return (
    <Item
      title={'Available Balance'}
      icon={<WalletIcon isActive />}
      linkText={'View funds'}
      href={'/homepage/funds'}
      style='h-fit'
    >
      <div className='flex items-center justify-between'>
        <p className='absolute bottom-[12px] left-[26px] text-3xl font-medium text-[#4285F4]'>
          {USDollar.format(balance)}
        </p>
      </div>
    </Item>
  );
};

const MyAirspaces = ({ airspaces = [] }) => {
  return (
    <Item
      title={
        <Fragment>
          My Airspaces{' '}
          <span className='text-[15px] font-normal'>({airspaces.length})</span>
        </Fragment>
      }
      icon={<DroneIcon isActive />}
      linkText={'View all airspaces'}
      href={'/homepage/portfolio'}
    >
      <div className='flex flex-col items-center gap-[29px]'>
        <div className='h-[131.01px] w-[265.81px]'>
          <WorldMap coloredCountries={['Spain']} />
        </div>
        <div className='flex w-full flex-col items-center gap-[7px]'>
          {airspaces.length === 0 && (
            <p className='px-[55px] text-center text-[17px] font-normal text-[#222222]'>
              Claim your first piece of sky now!
            </p>
          )}
          {airspaces.length !== 0 &&
            airspaces.slice(0, 3).map((airspace) => (
              <div
                className='flex w-full items-center gap-[10px] rounded-lg px-[22px] py-[16px]'
                style={{ border: '1px solid #4285F4' }}
              >
                <div className='flex h-[24px] w-[24px] items-center justify-center'>
                  <LocationPointIcon />
                </div>
                <p className='flex-1'>
                  {(airspace.title || airspace.address).substring(0, 15)}
                </p>
                <div className='flex h-[18px] w-[18px] items-center justify-center'>
                  <ChevronRightIcon />
                </div>
              </div>
            ))}
        </div>
      </div>
    </Item>
  );
};

const Path = () => {
  return (
    <div
      className='h-1 w-[7.85px] rotate-90 md:h-[7.95px] md:w-0'
      style={{ borderRight: '1px dashed #4285F4' }}
    />
  );
};

const ReferralProgramItem = ({ icon, title, text }) => {
  return (
    <div
      className='flex flex-1 flex-col items-center gap-[7.85px] rounded-[30px] bg-white py-[15px] text-center md:px-[38px]'
      style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}
    >
      <div
        className='flex h-[33px] w-[33px] items-center justify-center bg-[#E9F5FE]'
        style={{ borderRadius: '50%' }}
      >
        <div className='flex h-[19px] w-[19px] items-center justify-center'>
          {icon}
        </div>
      </div>
      <p className='text-[12px] font-semibold text-[#4285F4]'>{title}</p>
      <p className='hidden text-center text-[10px] font-normal text-[#1E1E1E] md:block'>
        {text}
      </p>
    </div>
  );
};

const ReferralProgram = () => {
  return (
    <Item
      title={'Referral Program'}
      icon={<GiftIcon isActive />}
      linkText={'View referral program'}
      href={'/homepage/referral'}
      style={'h-fit'}
    >
      <div className='flex items-center justify-center gap-[8.37px] md:flex-col md:px-[17px]'>
        <ReferralProgramItem
          icon={<ShareIcon />}
          title={'Share'}
          text={
            'Send your invite link or code to your friends and explain them how cool is SkyTrade'
          }
        />
        <Path />
        <ReferralProgramItem
          icon={<EarthIcon isActive={true} />}
          title={'Register & Claim'}
          text={
            'Let them register and claim their airspaces using your referral link or code'
          }
        />
        <Path />
        <ReferralProgramItem
          icon={<GiftIcon isActive={true} />}
          title={'Earn'}
          text={
            <Fragment>
              You and your friends are rewarded with{' '}
              <span className='font-bold'>50 credits</span> and{' '}
              <span className='font-bold'>+10%</span> on top of the passive
              income generated by those you refer{' '}
              <span className='font-bold'>FOREVER</span>
            </Fragment>
          }
        />
      </div>
    </Item>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user: selectorUser } = useAuth();
  const [user, setUser] = useState();
  const [token, setToken] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [signature, setSignature] = useState();
  const [airspaces, setAirspaces] = useState([]);
  const { getPropertiesByUserId } = useDatabase();

  // GET USER AND TOKEN
  useEffect(() => {
    if (selectorUser) {
      const authUser = async () => {
        const chainConfig = {
          chainNamespace: 'solana',
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: 'Solana Mainnet',
          blockExplorer: 'https://explorer.solana.com',
          ticker: 'SOL',
          tickerName: 'Solana',
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
          localStorage.removeItem('openlogin_store');
          router.push('/auth/join');
          return;
        }

        const fetchedToken = JSON.parse(
          localStorage.getItem('openlogin_store')
        );

        if (!selectorUser) {
          localStorage.removeItem('openlogin_store');
          router.push('/auth/join');
          return;
        }

        setToken(fetchedToken.sessionId);
        setUser(selectorUser);
      };
      authUser();
    }
  }, [selectorUser]);

  // GET TOKEN BALANCE
  useEffect(() => {
    if (user) {
      console.log({ user });
      const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          user.blockchainAddress,
          {
            mint: process.env.NEXT_PUBLIC_MINT_ADDRESS,
          },
          {
            encoding: 'jsonParsed',
          },
        ],
      };

      fetch(process.env.NEXT_PUBLIC_SOLANA_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
            setTokenBalance('0');
            return;
          }
          setTokenBalance(
            result.result.value[0].account.data.parsed.info.tokenAmount
              .uiAmountString
          );
        })
        .catch((error) => {
          setTokenBalance('');
          console.error(error);
        });
    }
  }, [user]);

  // GET SIGNATURE
  useEffect(() => {
    if (user) {
      const getSignature = async () => {
        const signatureObj = {};

        const chainConfig = {
          chainNamespace: 'solana',
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: 'Solana Mainnet',
          blockExplorer: 'https://explorer.solana.com',
          ticker: 'SOL',
          tickerName: 'Solana',
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
        const origin = window.location.origin;

        const payload = new SIWPayload();
        payload.domain = domain;
        payload.uri = origin;
        payload.address = user.blockchainAddress;
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

        signatureObj.sign = signature;
        signatureObj.sign_nonce = message.payload.nonce;
        signatureObj.sign_issue_at = message.payload.issuedAt;
        signatureObj.sign_address = user.blockchainAddress;
        setSignature(signatureObj);
      };

      getSignature();
    }
  }, [user]);

  // GET AIRSPACE LENGTH
  useEffect(() => {
    if (!user) return;

    const getAirspaces = async () => {
      try {
        const response = await getPropertiesByUserId(
          user.blockchainAddress,
          user.id
        );
        setAirspaces(response);
      } catch (error) {
        console.log(error);
      }
    };

    getAirspaces();
  }, [user]);

  if (!user || !token) {
    return <Spinner />;
  }

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      {isLoading &&
        createPortal(<Backdrop />, document?.getElementById('backdrop-root'))}
      {isLoading &&
        createPortal(<Spinner />, document?.getElementById('backdrop-root'))}

      <div className='relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F0F0FA]'>
        <Sidebar />
        <div className='flex h-full w-full flex-col'>
          <PageHeader pageTitle={'Dashboard'} />
          <section className='relative hidden h-full w-full px-[53px] pt-[52px] md:flex'>
            <div className='flex flex-1 gap-[37px]'>
              <div className='my-[-53px] flex h-full basis-[58%] flex-col gap-[48px] overflow-y-auto py-[53px]'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-xl font-medium text-black'>
                    Welcome on SkyTrade!
                  </h2>
                  <p className='text-base font-normal text-[#87878D]'>
                    Claim your airspace on the dashboard to kickstart your
                    passive income journey. Don't forget to share the love—refer
                    friends using your code or link and watch your earnings
                    grow. Welcome to the community, where the future is yours to
                    seize! 🌟🚀
                  </p>
                </div>
                <div className='flex flex-wrap gap-[22px]'>
                  <div className='flex flex-col gap-[22px]'>
                    <AvailableBalance balance={tokenBalance} />
                    <MyAirspaces airspaces={airspaces} />
                  </div>
                  <ReferralProgram />
                </div>
              </div>
              <Link
                href={'/homepage/airspace2'}
                className='-mr-[53px] -mt-[53px] flex flex-1 flex-col items-center justify-between bg-cover bg-center bg-no-repeat px-[18px] pb-[40px] pt-[42px]'
                style={{ backgroundImage: "url('/images/map-bg.png')" }}
              >
                <div
                  className='flex max-w-[362px] flex-col items-center gap-[15px] rounded-[30px] bg-[#FFFFFFCC] px-[29px] py-[43px]'
                  style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}
                >
                  <div className='flex items-center gap-[5px]'>
                    <p className='text-xl font-medium text-[#222222]'>
                      Claim Airspace
                    </p>
                    <div className='h-5 w-5 items-center justify-center'>
                      <InfoIcon />
                    </div>
                  </div>
                  <p className='text-[15px] font-normal text-[#222222]'>
                    Ready to claim your airspace? No registered airspace yet,
                    but exciting times ahead!
                  </p>
                  <div
                    className='relative w-full rounded-lg bg-white px-[22px] py-[16px]'
                    style={{ border: '1px solid #87878D' }}
                  >
                    <input
                      type='text'
                      name='searchAirspaces'
                      id='searchAirspaces'
                      placeholder='Search Airspaces'
                      className='w-full pr-[20px] outline-none'
                    />
                    <div className='absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2'>
                      <MagnifyingGlassIcon />
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-center rounded-lg bg-[#0653EA] px-[96px] py-[16px] text-[15px] font-normal text-white'>
                  Claim Airspace
                </div>
              </Link>
            </div>
          </section>
          <section className='relative mb-[78.22px] flex h-full w-full flex-col items-center gap-[21px] overflow-y-auto px-[18px] pb-[47px] md:hidden'>
            <Link
              href={'/homepage/airspace2'}
              className='-mx-[18px] flex h-[668px] flex-col items-center justify-between gap-[120px] bg-cover bg-center bg-no-repeat px-[16px] py-[23px]'
              style={{ backgroundImage: "url('/images/map-bg.png')" }}
            >
              <div className='flex flex-col gap-[5.71px] rounded-[30px] bg-white pb-[17px] pl-[27px] pr-[16px] pt-[17.29px]'>
                <h2 className='text-xl font-medium text-[#222222]'>
                  Welcome on SkyTrade!
                </h2>
                <p className='text-base font-normal text-[#87878D]'>
                  Claim your airspace on the dashboard to kickstart your passive
                  income journey. Don't forget to share the love—refer friends
                  using your code or link and watch your earnings grow. Welcome
                  to the community, where the future is yours to seize! 🌟🚀
                </p>
              </div>
              <div className='flex items-center justify-center rounded-lg bg-[#0653EA] px-[96px] py-[16px] text-[15px] font-normal text-white'>
                Claim Airspace
              </div>
            </Link>
            <MyAirspaces airspaces={airspaces} />
            <ReferralProgram />
            <AvailableBalance balance={tokenBalance} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
