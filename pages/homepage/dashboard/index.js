import { Fragment, useEffect, useState, useContext } from 'react';

import { useRouter } from 'next/router';
import Script from 'next/script';

import Chart from 'chart.js/auto';

import { SolanaWallet } from '@web3auth/solana-provider';
import { Payload as SIWPayload, SIWWeb3 } from '@web3auth/sign-in-with-web3';

import base58 from 'bs58';

import swal from 'sweetalert';

import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import Spinner from '@/Components/Spinner';

import useAuth from '@/hooks/useAuth';
import PropertiesService from "@/services/PropertiesService";
import { Web3authContext } from '@/providers/web3authProvider';
import NewslettersService from "@/services/NewslettersService";

const Dashboard = () => {
  const cData = [
    {
      country: 'United States',
      percent: 50,
      color: '#0653EA',
    },
    {
      country: 'India',
      percent: 7.91,
      color: '#C80000',
    },
    {
      country: 'United Kingdom',
      percent: 5.36,
      color: '#FFD037',
    },
    {
      country: 'Canada',
      percent: 4.69,
      color: '#78A6FF',
    },
    {
      country: 'Brazil',
      percent: 3.64,
      color: '#3A951A',
    },
    {
      country: 'Australia',
      percent: 3.39,
      color: '#722ACF',
    },
    {
      country: 'France',
      percent: 3.39,
      color: '#1581C1',
    },
    {
      country: 'Germany',
      percent: 2.39,
      color: '#5B5167',
    },
    {
      country: 'Argentina',
      percent: 1.8,
      color: '#D87657',
    },
    {
      country: 'Poland',
      percent: 1.8,
      color: '#6BD3FF',
    },
    {
      country: 'Italy',
      percent: 1.8,
      color: '#FF4B32',
    },
    {
      country: 'Spain',
      percent: 1.8,
      color: '#71FF40',
    },
    {
      country: 'Sweden',
      percent: 1.4,
      color: '#000',
    },
    {
      country: 'Finland',
      percent: 1.4,
      color: '#DC36F6',
    },
    {
      country: 'Nigeria',
      percent: 1.3,
      color: '#C89900',
    },
    {
      country: 'Kenya',
      percent: 1.3,
      color: '#006351',
    },
    {
      country: 'Peru',
      percent: 0.9,
      color: '#643B60',
    },
    {
      country: 'Chile',
      percent: 0.9,
      color: '#636C72',
    },
    {
      country: 'Paraguay',
      percent: 0.9,
      color: '#FC6681',
    },
    {
      country: 'Thailand',
      percent: 0.9,
      color: '#D4B5FB',
    },
    {
      country: 'SouthAfrica',
      percent: 0.9,
      color: '#FFAD93',
    },
    {
      country: 'Indonesia',
      percent: 0.9,
      color: '#00F',
    },
    {
      country: 'Algeria',
      percent: 0.9,
      color: '#CF1900',
    },
    {
      country: 'Norway',
      percent: 0.9,
      color: '#5C0000',
    },
    {
      country: 'Others',
      percent: 2.82,
      color: '#ACACAC',
    },
  ];

  const date = new Date();
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  const router = useRouter();

  const [newsletters, setNewsletters] = useState([]);
  const [newslettersLoading, setNewslettersLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('');
  const [airspaceLength, setAirspaceLength] = useState();

  const { user, web3authStatus } = useAuth();
  const { getNewsLetters } = NewslettersService();
  const { provider } = useContext(Web3authContext)
  const { getClaimedPropertiesByUserAddress } = PropertiesService();


  useEffect(() => {
    if (user) {
      const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          user?.blockchainAddress,
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
  }, [user, web3authStatus]);

  useEffect(() => {
    const getUserAirspaceLength = async () => {
      try {
        const responseData = await getClaimedPropertiesByUserAddress();

        if (responseData) {
          setAirspaceLength(responseData.length);
        }
      } catch (error) {
        console.log(error);
        setAirspaceLength('');
      } 
    };

    getUserAirspaceLength();
  }, [user, web3authStatus]);

  useEffect(() => {
    (async () => {
      try {
        setNewslettersLoading(true);
        const response = await getNewsLetters();

        if (response && response.length > 0) {
          setNewsletters(response.reverse());
        }
      } catch (error) {
        console.error(err);
      } finally {
        setNewslettersLoading(false);
      }
    })()
  }, [provider]);

  useEffect(() => {
    if (user) {
      const ctx = document?.getElementById('chart')?.getContext('2d');

      if (ctx) {
        const existingChart = Chart.getChart(ctx);

        if (existingChart) {
          existingChart.destroy();
        }
      }

      const chartData = {
        labels: cData.map((data) => {
          return [`${data.country} - ${data.percent}%`];
        }),
        data: cData.map((data) => data.percent),
        color: cData.map((data) => data.color),
      };

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: '',
              data: chartData.data,
              color: 'black',
              barThickness: 10,
              borderRadius: 10,
              backgroundColor: chartData.color,
            },
          ],
        },
        options: {
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
          plugins: {
            tooltip: {
              backgroundColor: 'black',
              bodyColor: 'transparent',
              yAlign: 'bottom',
              titleFont: {
                size: 14,
              },
              titleColor: 'white',
              textAlign: 'left',
              bodyFont: {
                color: 'red',
              },
              displayColors: false,
            },
            legend: {
              display: false,
            },
            label: {
              // display: false
            },
          },
        },
      });
    }
  }, [user, web3authStatus]);

  const navigationHandler = (route) => {
    router.push(route);
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <div className='mx-auto flex flex-row'>
        <Sidebar user={user} />

        <div
          className='overflow-y-auto overflow-x-hidden'
          style={{ width: 'calc(100vw - 257px)', height: '100vh' }}
        >
          <Navbar
            name={user?.name}
            categoryId={user?.categoryId}
          // status={user?.KYCStatusId}
          />
          <div className='flex w-full flex-row justify-start'>
            <div className='my-5' style={{ width: '100%', height: '100vh' }}>
              <div
                className='mx-auto grid grid-cols-3 gap-5'
                style={{ height: '169px', width: '95%' }}
              >
                <button
                  onClick={navigationHandler.bind(null, '/homepage/wallet')}
                  className='rounded-md bg-white p-5 transition-all duration-500 ease-in-out hover:bg-blue-100'
                  style={{ width: '100%', height: '169px' }}
                >
                  <div className='flex flex-row items-center justify-between'>
                    <div
                      style={{
                        width: '35px',
                        height: '36px',
                        background: '#BED9C7',
                        borderRadius: '4px',
                      }}
                      className='flex flex-row items-center justify-center'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='21'
                        height='17'
                        viewBox='0 0 21 17'
                        fill='none'
                      >
                        <path
                          d='M13.4252 8.47717C13.4252 7.64875 14.0968 6.97717 14.9252 6.97717C15.7537 6.97717 16.4252 7.64875 16.4252 8.47717C16.4252 9.3056 15.7537 9.97717 14.9252 9.97717C14.0968 9.97717 13.4252 9.3056 13.4252 8.47717Z'
                          fill='#1A572E'
                        />
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M18.3666 3.15119C17.7088 1.60553 16.2554 0.494403 14.5259 0.312405L13.874 0.243809C10.5817 -0.102644 7.26098 -0.0797977 3.97374 0.311922L3.5418 0.363394C1.873 0.562254 0.550751 1.86606 0.328475 3.5319C-0.109491 6.81421 -0.109492 10.1402 0.328475 13.4225C0.550751 15.0883 1.873 16.3921 3.5418 16.591L3.97374 16.6425C7.26098 17.0342 10.5817 17.057 13.874 16.7106L14.5259 16.642C16.2554 16.46 17.7088 15.3488 18.3666 13.8032C19.4058 13.4938 20.199 12.5928 20.3292 11.4796C20.5625 9.48477 20.5625 7.4696 20.3292 5.47481C20.199 4.36159 19.4058 3.46062 18.3666 3.15119ZM13.7171 1.73557C10.536 1.40082 7.32741 1.4229 4.15123 1.80138L3.71929 1.85286C2.73048 1.97069 1.947 2.74323 1.8153 3.73029C1.3949 6.88093 1.3949 10.0734 1.8153 13.2241C1.947 14.2111 2.73048 14.9837 3.71929 15.1015L4.15123 15.153C7.32742 15.5315 10.536 15.5535 13.7171 15.2188L14.3689 15.1502C15.2195 15.0607 15.972 14.6415 16.4936 14.0191C14.9854 14.1071 13.4572 14.0678 11.967 13.9012C10.6976 13.7594 9.67103 12.7598 9.52129 11.4796C9.28799 9.48477 9.28799 7.4696 9.52129 5.47481C9.67103 4.19455 10.6976 3.19501 11.967 3.05314C13.4572 2.88659 14.9854 2.84729 16.4936 2.93524C15.972 2.31292 15.2195 1.89367 14.3689 1.80417L13.7171 1.73557ZM17.2026 4.49188C17.2032 4.49572 17.2038 4.49956 17.2044 4.5034L17.2105 4.54229L17.4091 4.51144C17.5119 4.52161 17.6145 4.53242 17.7169 4.54386C18.3043 4.60951 18.7721 5.07366 18.8394 5.64907C19.0591 7.52807 19.0591 9.4263 18.8394 11.3053C18.7721 11.8807 18.3043 12.3449 17.7169 12.4105C17.6145 12.422 17.5119 12.4328 17.4091 12.4429L17.2105 12.4121L17.2044 12.451C17.2038 12.4548 17.2032 12.4587 17.2026 12.4625C15.524 12.6143 13.8024 12.597 12.1336 12.4105C11.5462 12.3449 11.0784 11.8807 11.0111 11.3053C10.7914 9.4263 10.7914 7.52807 11.0111 5.64907C11.0784 5.07366 11.5462 4.60951 12.1336 4.54386C13.8024 4.35735 15.524 4.34002 17.2026 4.49188Z'
                          fill='#1A572E'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='mt-10 text-start'>
                    <p className='text-sm'>Balance</p>
                    {!tokenBalance && (
                      <p className='mt-2 text-light-brown'>Loading...</p>
                    )}
                    {tokenBalance && (
                      <p className='text-2xl font-semibold'>
                        USDC {tokenBalance}
                      </p>
                    )}
                    {tokenBalance && (
                      <p className='-mt-2 text-sml'>US$ {tokenBalance}</p>
                    )}
                  </div>
                </button>
                <div
                  onClick={navigationHandler.bind(null, '/homepage/airspace')}
                  className='cursor-pointer bg-white p-5 transition-all duration-500 ease-in-out hover:bg-blue-100'
                  style={{
                    width: '100%',
                    height: '169px',
                    borderRadius: '10px',
                  }}
                >
                  <div className='flex flex-row items-center justify-between'>
                    <div
                      style={{
                        width: '35px',
                        height: '36px',
                        background: '#AAC0EA',
                        borderRadius: '4px',
                      }}
                      className='flex flex-row items-center justify-center'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M13.5579 5.53472C12.6873 4.69936 11.3128 4.69936 10.4422 5.53472L5.8158 9.97405C5.70245 10.0828 5.6262 10.2245 5.59787 10.379C5.04373 13.4009 5.00283 16.4945 5.47687 19.53L5.58939 20.2505H8.56585V14.0391C8.56585 13.6249 8.90164 13.2891 9.31585 13.2891H14.6843C15.0985 13.2891 15.4343 13.6249 15.4343 14.0391V20.2505H18.4107L18.5232 19.53C18.9973 16.4945 18.9564 13.4009 18.4023 10.379C18.3739 10.2245 18.2977 10.0828 18.1843 9.97406L13.5579 5.53472ZM9.40369 4.4524C10.8546 3.06014 13.1455 3.06014 14.5964 4.4524L19.2229 8.89174C19.5634 9.21853 19.7925 9.64422 19.8777 10.1085C20.4622 13.2961 20.5053 16.5594 20.0053 19.7614L19.8245 20.9189C19.7498 21.3976 19.3375 21.7505 18.853 21.7505H14.6843C14.2701 21.7505 13.9343 21.4147 13.9343 21.0005V14.7891H10.0659V21.0005C10.0659 21.4147 9.73007 21.7505 9.31585 21.7505H5.14712C4.66264 21.7505 4.25035 21.3976 4.1756 20.9189L3.99484 19.7614C3.49479 16.5594 3.53794 13.2961 4.12247 10.1085C4.2076 9.64422 4.43668 9.21853 4.77725 8.89173L9.40369 4.4524Z'
                          fill='#0653EA'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='flex flex-row items-center justify-between'>
                    <div className='mt-10 text-start'>
                      <p className='text-sm'>My Airspace</p>
                      <p className='text-2xl'>{airspaceLength}</p>
                    </div>
                    {/* <button onClick={addAirspaceHandler} className="bg-dark-blue rounded-md mt-12 text-sm text-white transition-all duration-500 ease-in-out hover:bg-blue-600" style={{width: "113px", height: "29px"}}>Claim AirSpace</button> */}
                  </div>
                </div>
                {/* <button onClick={navigationHandler.bind(null, "/homepage/uavs")} className="p-5 bg-white hover:bg-blue-100 transition-all duration-500 ease-in-out" style={{width: "100%", height: "169px", borderRadius: "10px"}}> */}
                <button
                  className='cursor-default bg-light-blue p-5 transition-all duration-500 ease-in-out'
                  style={{
                    width: '100%',
                    height: '169px',
                    borderRadius: '10px',
                  }}
                >
                  <div className='flex flex-row items-center justify-between'>
                    <div
                      style={{
                        width: '35px',
                        height: '36px',
                        background: '#FFF4D1',
                        borderRadius: '4px',
                      }}
                      className='flex flex-row items-center justify-center'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <g clipPath='url(#clip0_462_9841)'>
                          <path
                            d='M20.5002 18.9993H3.50022C2.95022 18.9993 2.50022 19.4493 2.50022 19.9993C2.50022 20.5493 2.95022 20.9993 3.50022 20.9993H20.5002C21.0502 20.9993 21.5002 20.5493 21.5002 19.9993C21.5002 19.4493 21.0502 18.9993 20.5002 18.9993ZM22.0702 9.6393C21.8502 8.8393 21.0302 8.3693 20.2302 8.5793L14.9202 9.9993L8.46022 3.9793C8.19022 3.7193 7.80022 3.6293 7.44022 3.7293C6.76022 3.9193 6.44022 4.6993 6.79022 5.3093L10.2302 11.2693L5.26022 12.5993L3.69022 11.3593C3.44022 11.1693 3.12022 11.0993 2.81022 11.1793L2.48022 11.2693C2.16022 11.3493 2.01022 11.7193 2.18022 11.9993L4.06022 15.2493C4.29022 15.6393 4.75022 15.8293 5.18022 15.7193L21.0002 11.4793C21.8002 11.2593 22.2802 10.4393 22.0702 9.6393Z'
                            fill='#C8A32A'
                          />
                        </g>
                        <defs>
                          <clipPath id='clip0_462_9841'>
                            <rect width='24' height='24' fill='white' />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div className='flex flex-row items-center justify-between'>
                    <div className='mt-10 text-start'>
                      <p className='text-sm'>UAVs</p>
                      <p className='text-2xl'>0</p>
                    </div>
                    <div
                      className='right-0 mt-14 flex flex-col items-center justify-center px-2 py-2.5 font-semibold'
                      style={{ height: '16px', borderRadius: '3px' }}
                    >
                      <p className='text-sm text-dark-green'>Coming Soon</p>
                    </div>
                  </div>
                </button>
              </div>
              <div
                className='mx-auto mt-5 overflow-y-auto overflow-x-hidden rounded-md bg-white px-10 py-4'
                style={{ width: '95%', height: 'calc(100vh - 189px)' }}
              >
                <p className='mb-10 text-xl font-bold'>User Geographies</p>
                <div
                  className='gap- relative flex flex-row items-center justify-center rounded-md'
                  style={{ width: '95%', height: 'calc(100vh - 189px)' }}
                >
                  <div className='w-1/2'>
                    {cData.map((data) => {
                      return (
                        <div
                          key={data.country}
                          className='flex flex-row items-center gap-2 text-sm 2xl:text-base'
                          style={{ color: data.color }}
                        >
                          <div className='flex flex-row items-center gap-2'>
                            <div
                              className='rounded'
                              style={{
                                width: '20px',
                                height: '10px',
                                backgroundColor: data.color,
                              }}
                            ></div>
                            <p>{data.country}</p>
                          </div>
                          <p>{data.percent}%</p>
                        </div>
                      );
                    })}
                  </div>
                  <canvas
                    style={{
                      width: '50%',
                      maxWidth: '500px',
                      maxHeight: '500px',
                    }}
                    id='chart'
                  ></canvas>
                  {/* <div style={{width: "50%", maxWidth: "500px"}}>
                                    
                                </div> */}
                </div>
              </div>
            </div>
            <div
              className='my-5 me-5 rounded-md'
              style={{ width: '20vw', height: '100vh' }}
            >
              <div
                className='me-2 overflow-y-auto overflow-x-hidden bg-white px-4 py-5'
                style={{ width: '100%', height: '100vh', borderRadius: '10px' }}
              >
                <h2 className='mb-3 text-xl font-bold'>News Feed</h2>
                <div className='mb-5 flex flex-row items-center justify-between'>
                  <p className='font-semibold' style={{ color: '#722ACF' }}>
                    {month} {day}
                  </p>
                  <hr style={{ width: '80%' }}></hr>
                </div>
                {newslettersLoading && newsletters.length < 1 && (
                  <p className='text-center text-sm'>Loading...</p>
                )}
                {newsletters.map((newsletter) => {
                  const date = new Date(newsletter.date);
                  const month = date.toLocaleString('default', {
                    month: 'short',
                  });
                  const day = date.getDate();
                  const year = date.getFullYear();
                  const newDate = `${month} ${day} ${year}`;

                  return (
                    <div
                      key={newsletter.id}
                      className='mb-8 flex flex-row items-center'
                    >
                      <p className='w-1/4 text-center text-sm'>{newDate}</p>
                      <div className='ms-2 w-3/4 border-l-4 border-black ps-2'>
                        <h3 className='mb-5 text-sml font-bold'>
                          {newsletter.title}
                        </h3>
                        <p className='mb-5 text-sm'>{newsletter.text}</p>
                        <a
                          className='text-sml text-blue-600 transition-all duration-500 ease-in-out hover:text-blue-400'
                          target='_blank'
                          href={newsletter.link}
                        >
                          continue reading
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className='mt-10 flex flex-row items-center justify-between'>
            <p className='ms-5'>&copy; SkyTrade 2023</p>
            <div className='flex flex-row items-center gap-1 pe-5'>
              <a
                className='flex flex-row items-center gap-1'
                href='mailto:help@sky.trade'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='11'
                  viewBox='0 0 14 11'
                  fill='none'
                >
                  <path
                    d='M12.6 0H1.4C0.63 0 0 0.61875 0 1.375V9.625C0 10.3813 0.63 11 1.4 11H12.6C13.37 11 14 10.3813 14 9.625V1.375C14 0.61875 13.37 0 12.6 0ZM12.32 2.92188L7.742 5.73375C7.287 6.01562 6.713 6.01562 6.258 5.73375L1.68 2.92188C1.505 2.81188 1.4 2.62625 1.4 2.42688C1.4 1.96625 1.911 1.69125 2.31 1.93187L7 4.8125L11.69 1.93187C12.089 1.69125 12.6 1.96625 12.6 2.42688C12.6 2.62625 12.495 2.81188 12.32 2.92188Z'
                    fill='black'
                    fillOpacity='0.5'
                  />
                </svg>
                <span>help@sky.trade</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
