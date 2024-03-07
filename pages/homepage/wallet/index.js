import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';
import { loadStripeOnramp } from '@stripe/crypto';
import { CryptoElements, OnrampElement } from '@/hooks/stripe';
import { Web3Auth } from '@web3auth/modal';
import Script from 'next/script';

import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import Backdrop from '@/Components/Backdrop';
import Spinner from '@/Components/Spinner';
import WalletModal from '@/Components/Modals/WalletModal';

import { useAuth } from '@/hooks/useAuth';

const Wallet = () => {
  const url = process.env.NEXT_PUBLIC_SOLANA_API;

  const router = useRouter();

  const [user, setUser] = useState();
  const [token, setToken] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [tokenAccount, setTokenAccount] = useState('');
  const [transactionHistory, setTransactionHistory] = useState();
  const [transactionData, setTransactionData] = useState([]);
  const [transactionHistories, setTransactionHistories] = useState([]);
  const [completedTrans, setCompletedTrans] = useState();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [stripeOnramp, setStripeOnRamp] = useState();

  const [transactions, setTransactions] = useState();
  const [completedTransactions, setCompletedTransactions] = useState([]);

  const transactionsPerPage = 5;
  const pagesVisited = pageNumber * transactionsPerPage;


  const pageCount =
    transactionHistory &&
    Math.ceil(transactionHistory.length / transactionsPerPage);

  const { user: selectorUser } = useAuth();


  useEffect(() => {
    (async () => {
        if(selectorUser == undefined){
                localStorage.removeItem('openlogin_store');
                router.push('/auth/join');
                return;
        }
        const chainConfig = {
            chainNamespace: 'solana',
            chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
            rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
            displayName: `Solana ${process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME}`,
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
            swal({
              title: 'oops!',
              text: 'Something went wrong. Kindly try again',
            }).then(() => router.push('/auth/join'));
            return;
        }

        const fetchedToken = JSON.parse(
            localStorage.getItem('openlogin_store')
        );

        setToken(fetchedToken.sessionId);
        setUser(selectorUser);
    })()

}, [selectorUser]);


  useEffect(() => {
    if (showStripeModal) {
      const stripeOnrampPromise = loadStripeOnramp(
        `${process.env.STRIPEONRAMP_APIKEY}`
      );

      setStripeOnRamp(stripeOnrampPromise);

      fetch(`/api/proxy?${Date.now()}`, {
        method: 'POST',
        body: JSON.stringify({
          blockchainAddress: user.blockchainAddress,
        }),
        headers: {
          'Content-Type': 'application/json',
          uri: '/public/stripe/create',
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setClientSecret(data.data.client_secret);
        })
        .catch((error) => {
          console.error('Error:', error);
          setClientSecret('');
        });
    }
  }, [showStripeModal]);

  useEffect(() => {
    if (user) {
      const mintAddress = process.env.NEXT_PUBLIC_MINT_ADDRESS

      fetch(`https://api.solana.fm/v1/addresses/${walletAddress}/tokens`)
        .then(response => response.json())
        .then(response => {
            for(const key in response.tokens) {      
              if(key === mintAddress) {
                setTokenBalance(response.tokens[key].balance)
              }
          }
            console.log(balanceArray);
          })
        .catch(err => console.error(err));

      fetch(`https://api.solana.fm/v0/accounts/${walletAddress}/transfers?inflow=true&outflow=true&mint=${process.env.NEXT_PUBLIC_MINT_ADDRESS}&page=1`)
      // fetch(`https://api.solana.fm/v0/accounts/${walletAddress}/transfers?inflow=true&outflow=true&page=1`)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.error);
            });
          }

          return response.json();
        })
        .then((result) => {
          setTransactions(result.results)
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  useEffect(() => {
    if(transactions) {
      const collectedTransactions = [];

      for(const trans of transactions) {
        for(const key of trans.data) {
          const date = new Date(key.timestamp * 1000);
          const month = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const year = date.getFullYear();
          const hour = date.getHours().toString().padStart(2, '0');
          const minute = date.getMinutes().toString().padStart(2, '0');
          const second = date.getSeconds().toString().padStart(2, '0');

          key.date = `${month} ${day}, ${year} ${hour}:${minute}:${second}`;

          if(key.token && key.amount >= 10000) {
            key.hash = trans.transactionHash
            collectedTransactions.push(key);
          }
        }
      }

      console.log(collectedTransactions);
      setCompletedTransactions(collectedTransactions);
    }
  }, [transactions]);

  useEffect(() => {
    if (user) {
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

      fetch(url, {
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
            setTokenAccount('');
            setTransactionHistory([]);
            return;
          }

          setTokenAccount(result.result.value[0].pubkey);
          setTokenBalance(
            result.result.value[0].account.data.parsed.info.tokenAmount
              .uiAmountString
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  useEffect(() => {
    if (tokenAccount && searchValue.length < 1) {
      const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [tokenAccount],
      };

      fetch(url, {
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
          setTransactionHistory(result.result);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [tokenAccount, searchValue]);

  useEffect(() => {
    let userArray = [];
    if (transactionHistory && transactionHistory.length > 0) {
      let trans;
      if (transactionHistory.length > 4) {
        trans = transactionHistory.slice(
          pagesVisited,
          pagesVisited + transactionsPerPage
        );
      } else {
        trans = transactionHistory;
      }

      trans.map((trans) => {
        userArray.push(trans);
      });

      setCompletedTrans(userArray);
    }
  }, [pagesVisited, transactionHistory]);

  useEffect(() => {
    if (completedTrans && completedTrans.length > 0) {
      setTransactionData([]);
      for (const transaction of completedTrans) {
        const date = new Date(transaction.blockTime * 1000);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');

        transaction.date = `${month} ${day}, ${year} 
                                        ${hour}:${minute}:${second}`;
        const data = {
          jsonrpc: '2.0',
          id: 1,
          method: 'getTransaction',
          params: [transaction.signature, 'json'],
        };

        fetch(url, {
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
          .then((resData) => {
            const postBalances = resData.result.meta.postTokenBalances.filter(
              (sender) => {
                return sender.owner === user.blockchainAddress;
              }
            );

            const preBalances = resData.result.meta.preTokenBalances.filter(
              (sender) => {
                return sender.owner === user.blockchainAddress;
              }
            );

            let postBalance;
            let preBalance;
            let transactionAmount;

            if (preBalances.length > 0) {
              preBalance = preBalances[0].uiTokenAmount.uiAmountString;
              postBalance = postBalances[0].uiTokenAmount.uiAmountString;

              transactionAmount = postBalance - preBalance;
            } else {
              const senderPreBalances =
                resData.result.meta.preTokenBalances.filter((sender) => {
                  return sender.owner !== user.blockchainAddress;
                });

              const senderPostBalances =
                resData.result.meta.postTokenBalances.filter((sender) => {
                  return sender.owner !== user.blockchainAddress;
                });

              const oldBalance =
                senderPreBalances[0].uiTokenAmount.uiAmountString;
              const postBalance =
                senderPostBalances[0].uiTokenAmount.uiAmountString;

              transactionAmount = +oldBalance - +postBalance;
            }

            transaction.amount = +transactionAmount.toFixed(4);
            // transactionHistoryArray.push(transaction);
            setTransactionData((prev) => {
              return [...prev, transaction];
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [completedTrans]);

  useEffect(() => {
    if (transactionData.length > 0) {
      const trans = transactionData.sort((a, b) => b.blockTime - a.blockTime);
      setTransactionHistories(trans);
    }
  }, [transactionData]);

  const Stripe = (props) => {
    return (
      <div
        style={{ width: '400px', height: '70vh', left: 'calc(50% - 200px)' }}
        className='fixed top-10 z-50'
      >
        <CryptoElements stripeOnramp={stripeOnramp}>
          <OnrampElement clientSecret={props.clientSecret} />
        </CryptoElements>
        <button onClick={props.closeModal} className='absolute right-3 top-8'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='34'
            height='34'
            viewBox='0 0 34 34'
            fill='none'
          >
            <path
              d='M12.7578 12.7285L21.2431 21.2138'
              stroke='#252530'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12.7569 21.2138L21.2422 12.7285'
              stroke='#252530'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    );
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const backdropCloseHandler = () => {
    setShowDepositModal(false);
    setShowWithdrawalModal(false);
    // setShowStripeModal(false)
    // setClientSecret("")
  };

  const depositRouteHandler = () => {
    router.push('/homepage/wallet/direct-deposit');
  };

  const withdrawalRouteHandler = () => {
    router.push('/homepage/wallet/direct-withdraw');
  };

  const StripeHandler = () => {
    setShowStripeModal(true);
    setShowDepositModal(false);
  };

  if (!user || !token) {
    return <Spinner />;
  }

  return (
    <Fragment>
      {showWithdrawalModal &&
        createPortal(
          <Backdrop onClick={backdropCloseHandler} />,
          document.getElementById('backdrop-root')
        )}
      {showWithdrawalModal &&
        createPortal(
          <WalletModal
            method='withdrawal'
            form='to'
            closeModal={() => setShowWithdrawalModal(false)}
            navigate={withdrawalRouteHandler}
          />,
          document.getElementById('modal-root')
        )}
      {(showDepositModal || showStripeModal) &&
        createPortal(
          <Backdrop onClick={backdropCloseHandler} />,
          document.getElementById('backdrop-root')
        )}
      {showDepositModal &&
        createPortal(
          <WalletModal
            method='deposit'
            closeModal={() => setShowDepositModal(false)}
            form='from'
            stripe={StripeHandler}
            navigate={depositRouteHandler}
          />,
          document.getElementById('modal-root')
        )}
      {showStripeModal &&
        clientSecret &&
        createPortal(
          <Stripe
            closeModal={() => {
              setShowStripeModal(false);
              backdropCloseHandler();
              setClientSecret('');
            }}
            clientSecret={clientSecret}
          />,
          document.getElementById('modal-root')
        )}
      <div className='flex flex-row'>
        <Sidebar user={user} />
        <div
          style={{ width: 'calc(100vw - 257px)', height: '100vh' }}
          className='overflow-y-auto overflow-x-hidden'
        >
          <Navbar
            name={user.name}
            categoryId={user.categoryId}
          // status={user.KYCStatusId}
          />
          <div
            className='relative mx-auto mt-5 flex flex-col items-center rounded-lg bg-bleach-green p-7'
            style={{
              width: '395px',
              height: '169px',
              boxShadow: '0px 2px 20px 0px rgba(0, 0, 0, 0.13)',
            }}
          >
            <div className='z-10 text-center'>
              <p className='text-light-brown'>My Wallet</p>
              {!tokenBalance && (
                <p className='mt-2 font-semibold text-light-brown'>
                  Loading...
                </p>
              )}
              {tokenBalance && (
                <p className='mt-2 text-2xl font-semibold text-light-brown'>
                  USDC {tokenBalance}
                </p>
              )}
              {tokenBalance && (
                <p className='-mt-2 text-sml font-semibold text-light-brown'>
                  US$ {tokenBalance}
                </p>
              )}
            </div>
            <div
              style={{ zIndex: '10' }}
              className='absolute -bottom-3 flex flex-row items-center justify-center gap-4'
            ></div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='z-1 absolute right-6 top-4'
              width='146'
              height='121'
              viewBox='0 0 146 121'
              fill='none'
            >
              <path
                d='M95.5943 60.4999C95.5943 54.5876 100.376 49.7947 106.275 49.7947C112.174 49.7947 116.956 54.5876 116.956 60.4999C116.956 66.4122 112.174 71.2051 106.275 71.2051C100.376 71.2051 95.5943 66.4122 95.5943 60.4999Z'
                fill='#1A572E'
                fillOpacity='0.1'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M130.779 22.4894C126.096 11.4583 115.747 3.52846 103.432 2.22957L98.79 1.74002C75.3471 -0.732551 51.7018 -0.5695 28.295 2.22613L25.2194 2.59347C13.3367 4.01269 3.92162 13.3177 2.3389 25.2065C-0.779634 48.6317 -0.779634 72.3683 2.3389 95.7935C3.92162 107.682 13.3367 116.987 25.2194 118.407L28.295 118.774C51.7018 121.57 75.3471 121.733 98.79 119.26L103.432 118.77C115.747 117.472 126.096 109.542 130.779 98.5105C138.179 96.3022 143.827 89.8722 144.754 81.9273C146.415 67.691 146.415 53.309 144.754 39.0727C143.827 31.1278 138.179 24.6977 130.779 22.4894ZM97.6723 12.3864C75.0213 9.9974 52.1748 10.1549 29.5588 12.8561L26.4832 13.2235C19.4423 14.0644 13.8636 19.5779 12.9258 26.6224C9.93238 49.1078 9.93238 71.8922 12.9258 94.3776C13.8636 101.422 19.4423 106.936 26.4832 107.777L29.5588 108.144C52.1748 110.845 75.0213 111.003 97.6723 108.614L102.314 108.124C108.37 107.485 113.729 104.493 117.442 100.052C106.704 100.679 95.8219 100.399 85.2108 99.2103C76.1724 98.1978 68.8625 91.0643 67.7963 81.9273C66.1351 67.691 66.1351 53.309 67.7963 39.0727C68.8625 29.9357 76.1724 22.8022 85.2108 21.7897C95.8219 20.601 106.704 20.3205 117.442 20.9482C113.729 16.5068 108.37 13.5148 102.314 12.876L97.6723 12.3864ZM122.491 32.0577C122.495 32.0851 122.5 32.1125 122.504 32.1399L122.547 32.4174L123.961 32.1972C124.693 32.2698 125.424 32.347 126.153 32.4287C130.336 32.8972 133.666 36.2097 134.146 40.3163C135.71 53.7264 135.71 67.2736 134.146 80.6837C133.666 84.7903 130.336 88.1028 126.153 88.5713C125.424 88.653 124.693 88.7302 123.961 88.8028L122.547 88.5826L122.504 88.8601C122.5 88.8875 122.495 88.9149 122.491 88.9423C110.538 90.0261 98.2801 89.9025 86.3972 88.5713C82.2146 88.1028 78.884 84.7903 78.4048 80.6837C76.8399 67.2736 76.8399 53.7264 78.4048 40.3163C78.884 36.2097 82.2146 32.8972 86.3972 32.4287C98.2801 31.0975 110.538 30.9739 122.491 32.0577Z'
                fill='#1A572E'
                fillOpacity='0.1'
              />
            </svg>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='z-1 absolute bottom-0 left-0'
              width='137'
              height='103'
              viewBox='0 0 137 103'
              fill='none'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M130.63 103H10C4.47717 103 0 98.5229 0 93V10.0757C13.4341 3.66759 29.0313 0 45.6673 0C96.1093 0 137.001 33.7183 137.001 75.3118C137.001 85.0882 134.742 94.4294 130.63 103Z'
                fill='#AECCB8'
              />
            </svg>
          </div>
          <div
            className='mx-auto mt-10 flex flex-row items-center justify-between rounded-md bg-white px-6'
            style={{
              width: 'calc(100vw - 257px)',
              maxWidth: '1139px',
              height: '47px',
            }}
          >
            <h3>Transaction History</h3>
            <form className='flex flex-row items-center justify-center gap-2'>
              <input
                type='text'
                onChange={(e) => setSearchValue(e.target.value)}
                className='rounded bg-light-grey ps-3 placeholder:text-sm placeholder:text-light-brown focus:outline-blue-200'
                placeholder='Search Transaction'
                style={{ width: '211px', height: '27px' }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  changePage({ selected: 1 });
                  const filteredTransactions = transactionHistory.filter(
                    (history) => {
                      return history.signature.includes(searchValue);
                    }
                  );

                  if (filteredTransactions.length > 0) {
                    setTransactionHistory(filteredTransactions);
                  } else {
                    setTransactionHistories([]);
                    setTransactionHistory([]);
                    setTransactionData([]);
                  }
                }}
                className='rounded bg-dark-blue px-1 text-sm text-white'
                style={{ width: '73px', height: '27px' }}
              >
                SEARCH
              </button>
            </form>
          </div>
          <div
            className='mx-auto mt-2 flex flex-row items-center justify-between gap-x-6 rounded-md pe-16 ps-6 font-semibold'
            style={{
              width: 'calc(100vw - 257px)',
              maxWidth: '1139px',
              height: '47px',
            }}
          >
            <p className='w-3/12'>Date</p>
            <p className='w-4/12'>Transaction ID</p>
            <p className='w-2/12'>Amount (USDC)</p>
            <p className='w-1/12'>Status</p>
          </div>
          {!transactions && (
            <p className='mt-5 text-center'>Loading...</p>
          )}
          {transactions && transactions.length < 1 && (
            <div className='mt-20 flex flex-row justify-center'>
              <p>No transaction for your account at the moment</p>
            </div>
          )}

  
          
          {transactions && transactions.length > 0 &&
            completedTransactions.map((history) => {
              return (
                <div
                  key={history.hash}
                  className='mx-auto mt-2 flex flex-row items-center justify-between gap-x-6 rounded-md bg-white pe-16 ps-6'
                  style={{
                    height: '47px',
                    width: 'calc(100vw - 257px)',
                    maxWidth: '1139px',
                  }}
                >
                  <p className='w-3/12'>{history.date}</p>
                  {/*remove the cluster before going live  */}
                  <a
                    href={`https://explorer.solana.com/tx/${history.signature}?cluster=devnet`}
                    target='_blank'
                    className='w-4/12 overflow-x-clip text-ellipsis text-dark-blue'
                  >
                    {history.hash}
                  </a>
                  
                  <p
                    className={`w-2/12 ${!history.destination ? 'text-green-500' : 'text-red-600'
                      }`}
                  >
                    <span>{history.amount ? history.amount / 1000000 : ''}</span>
                  </p>
                  <p className='flex w-1/12 flex-row items-center justify-center gap-1 rounded-lg bg-bleach-green p-0.5 text-sml text-light-dark'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='6'
                      height='6'
                      viewBox='0 0 6 6'
                      fill='none'
                    >
                      <circle cx='3' cy='3' r='3' fill='#1A572E' />
                    </svg>
                    {history.status}
                  </p>
                </div>
              );
            })}
          {transactionHistory && transactionHistory.length > 0 && (
            <div
              className='mx-auto flex flex-row justify-end'
              style={{ maxWidth: '1139px' }}
            >
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={'paginationBttns'}
                previousLinkClassName={'previousBttn'}
                nextLinkClassName={'nextBttn'}
                disabledClassName={'pagination-disabled'}
                activeClassName={'paginationActive'}
              />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Wallet;
