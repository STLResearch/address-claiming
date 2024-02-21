'use client';
import { CloseIcon, SuccessIcon } from '@/Components/Icons';
import { Fragment, useState, useEffect } from 'react';
import Script from 'next/script';
import Sidebar from '@/Components/Sidebar';
import PageHeader from '@/Components/PageHeader';
import Spinner from '@/Components/Spinner';
import Backdrop from '@/Components/Backdrop';
import { useAuth } from '@/hooks/useAuth';
import { Web3Auth } from '@web3auth/modal';
import { SolanaWallet } from '@web3auth/solana-provider';
import { Payload as SIWPayload, SIWWeb3 } from '@web3auth/sign-in-with-web3';
import base58 from 'bs58';
import {
  MagnifyingGlassIcon,
  WarningIcon,
  WalletIcon,
} from '@/Components/Icons';
import { useRouter } from 'next/router';
import { useQRCode } from 'next-qrcode';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  TokenAccountNotFoundError,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import Head from 'next/head';

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const AvailableBalance = ({ balance = 0 }) => {
  return (
    <div
      className='relative flex w-[468px] items-center justify-between rounded-[30px] bg-white px-[32px] py-[37px]'
      style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}
    >
      <div className='flex h-full flex-col justify-between'>
        <p className='text-xl font-medium text-[#222222]'>Available balance</p>
        <p className='text-3xl font-medium text-[#4285F4]'>
          {USDollar.format(balance)}
        </p>
      </div>
      <div className='absolute right-[9px] top-3 flex items-center justify-center rounded-[50%] bg-[#CCE3FC] p-[10px]'>
        <div className='h-6 w-6'>
          <WalletIcon isActive={true} />
        </div>
      </div>
    </div>
  );
};

const TransactionHistory = ({ transactions, user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const TRANSACTIONS_PER_PAGE = 8;
  const initialIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const finalIndex = currentPage * TRANSACTIONS_PER_PAGE;
  const paginatedData = transactions.slice(initialIndex, finalIndex);
  const totalPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const changePage = (newPage) => setCurrentPage(newPage);
  const getPaginationNumbers = () => {
    const pages = [];
    const range = 2;

    for (let i = currentPage - range; i <= currentPage + range; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className='flex min-w-[600px] flex-1 flex-col gap-5'>
      <div className='flex items-center justify-between'>
        <p className='text-xl font-medium text-[#222222]'>
          Transaction History
        </p>
        <div
          className='relative w-[272px] rounded-lg bg-white px-[22px] py-[16px]'
          style={{ border: '1px solid #87878D' }}
        >
          <input
            type='text'
            name='searchTransactions'
            id='searchTransactions'
            placeholder='Search Transactions'
            className='w-full pr-[20px] outline-none'
          />
          <div className='absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2'>
            <MagnifyingGlassIcon />
          </div>
        </div>
      </div>
      <table className='table-auto'>
        <thead className='text-sm font-bold uppercase tracking-[0.5px] text-[#7D90B8]'>
          <tr>
            {['date', 'transaction id', 'type', 'amount', 'status'].map(
              (th) => (
                <th className='px-5 py-5 text-start'>{th}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((transaction, index) => (
            <tr
              key={transaction.id}
              className={`${index % 2 === 0 && 'bg-white'}`}
            >
              {/* {Object.values(transaction).map((value, secondIndex, array) => { return (<td className={`${secondIndex === 0 ? 'rounded-l-lg' : ''} py-6 ${secondIndex === array.length - 1 ? 'rounded-r-lg' : ''} text-[#222222] px-5`}>{value}</td>) })} */}
              <td className={`w-2/12 px-5 py-6 text-[#222222]`}>
                {transaction.date}
              </td>
              <td className={`py- w-2/12 text-clip px-5 text-[#222222]`}>
                <a
                  className=''
                  target='_blank'
                  href={`https://explorer.solana.com/tx/${transaction.transHash}`}
                >
                  {transaction.hash}
                </a>
              </td>
              <td className={`w-2/12 px-5 py-6 text-[#222222]`}>
                {transaction.destination !== user.blockchainAddress
                  ? 'withdraw'
                  : 'deposit'}
              </td>
              <td className={`w-2/12 px-5 py-6 text-[#222222]`}>
                ${transaction.amount / 1000000}
              </td>
              <td className={`w-2/12 px-5 py-6 text-[#222222]`}>
                {transaction.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex items-center justify-end'>
        <div className='mx-auto flex gap-[11.71px]'>
          {getPaginationNumbers().map((pageNumber) => (
            <div
              className={`${currentPage === pageNumber ? 'text-[#87878D]' : 'cursor-pointer text-[#0653EA]'} text-base font-bold`}
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </div>
          ))}
          {totalPages > 1 && (
            <div
              className={`${currentPage === totalPages ? 'text-[#87878D]' : 'cursor-pointer text-[#0653EA]'} text-base font-normal`}
              onClick={() => {
                if (currentPage !== totalPages) changePage(currentPage + 1);
              }}
            >
              Next
            </div>
          )}
        </div>
        {totalPages !== 0 && (
          <div className='text-[14px] font-normal -tracking-[0.5px] text-[#87878D]'>
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};

const SuccessModal = ({ setShowSuccess, finalAns }) => {
  const [owner, setOwner] = useState({});
  return (
    <div
      className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${finalAns.status == 'Transaction SuccessFull' ? 'bg-green-600' : 'bg-red-600'} z-40 flex h-screen max-h-screen w-full flex-col items-center gap-[15px] overflow-y-auto px-[29px] py-[30px] md:h-auto md:max-h-[700px] md:w-[689px] md:rounded-[30px]`}
    >
      <div className='h-[100px] w-[100px]  '>
        {finalAns.status == 'Transaction SuccessFull' ? (
          <SuccessIcon />
        ) : (
          <CloseIcon />
        )}
      </div>
      <div className=' text-center text-xl text-white'> {finalAns.status} </div>
      <div className=' text-center text-xl text-white'> {finalAns.message}</div>
      <div
        onClick={() => {
          setShowSuccess(false);
        }}
        className='w-1/2 cursor-pointer rounded-[5px] bg-white px-16 py-[10px] text-center text-green-600'
      >
        OK
      </div>
    </div>
  );
};

const DepositAndWithdraw = ({
  walletId,
  activeSection,
  setActiveSection,
  setIsLoading,
  setreFetchBal,
  refetchBal,
  setTokenBalance,
  tokenBalance,
}) => {
  const [amount, setAmount] = useState();
  const [showSuccess, setShowSuccess] = useState(false);
  const [finalAns, setFinalAns] = useState({
    status: 'Transaction SuccessFull',
  });

  const [recipientWalletAddress, setRecipientWalletAddress] = useState('');

  const { user } = useAuth();

  const handleWithdraw = async () => {
    try {
      if (activeSection == 1 && parseInt(tokenBalance) <= parseInt(amount)) {
        console.log('amts=', parseInt(tokenBalance), parseInt(amount));
        setFinalAns({
          status: 'Transaction failed',
          message: `invalid transafer amount`,
        });
        setShowSuccess(true);
        throw new Error('invalid transafer amount');
      }
      //new PublicKey('fgdf')

      setIsLoading(true);

      const chainConfig = {
        chainNamespace: 'solana',
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
        displayName: 'Solana ',
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

      console.log('solana wallet ', solanaWallet);

      const connectionConfig = await solanaWallet.request({
        method: 'solana_provider_config',
        params: [],
      });

      const connection = new Connection(connectionConfig.rpcTarget);

      console.log('connection ', connection);
      let mintAccount = process.env.NEXT_PUBLIC_MINT_ADDRESS;
      let tx = new Transaction();
      console.log('sender ', user.blockchainAddress);
      console.log('reciever ', recipientWalletAddress);
      console.log(mintAccount);
      let recipientUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(recipientWalletAddress)
      );

      let senderUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(user.blockchainAddress)
      );
      let ix = [];
      try {
        await getAccount(connection, recipientUSDCAddr);
      } catch (error) {
        if (error.name == TokenAccountNotFoundError.name) {
          let createIx = createAssociatedTokenAccountInstruction(
            new PublicKey(user.blockchainAddress),
            recipientUSDCAddr,
            new PublicKey(recipientWalletAddress),
            new PublicKey(mintAccount)
          );

          ix.push(createIx);
        }
      }
      console.log('amount = ', amount);
      let transferIx = createTransferInstruction(
        senderUSDCAddr,
        recipientUSDCAddr,
        new PublicKey(user.blockchainAddress),
        parseInt(amount) * Math.pow(10, 6)
      );

      ix.push(transferIx);

      tx.add(...ix);

      let blockhash = (await connection.getLatestBlockhash('finalized'))
        .blockhash;

      tx.recentBlockhash = blockhash;
      tx.feePayer = new PublicKey(user.blockchainAddress);

      console.log('transaction obj ', tx);
      try {
        const signature = await solanaWallet.signAndSendTransaction(tx);

        console.log('sig =', signature);
        setFinalAns({
          status: 'Transaction SuccessFull',
          message:
            'signature ' + `${signature.signature}`.slice(0, 30) + '.........',
        });
        setShowSuccess(true);
        setTokenBalance(tokenBalance - amount);
        console.log('new token bal=', amount);
        setTimeout(() => {
          setIsLoading(false);
          console.log('timeout over');
          setreFetchBal(!refetchBal);
        }, 10000);
      } catch (err) {
        setFinalAns({
          status: 'Transaction Failed',
          message: `transaction failed ${err}`,
        });
        setShowSuccess(true);
      }
    } catch (error) {
      console.log('pub key ', error);
      setFinalAns({
        status: 'Transaction failed',
        message: ` ${error}`,
      });
      setShowSuccess(true);
      setIsLoading(false);
    }
  };

  const { SVG } = useQRCode();
  return (
    <div
      className='flex w-[468px] flex-col items-center gap-[15px] rounded-[30px] bg-white px-[29px] py-[30px]'
      style={{
        boxShadow: '0px 12px 34px -10px #3A4DE926',
      }}
    >
      <div>
        {showSuccess && (
          <SuccessModal setShowSuccess={setShowSuccess} finalAns={finalAns} />
        )}
      </div>
      <div className='flex w-full gap-[5px]'>
        {['Deposit', 'Withdraw'].map((text, index) => (
          <div
            onClick={() => setActiveSection(index)}
            className={`${activeSection === index ? 'bg-[#222222] text-base text-white' : 'bg-[#2222221A] text-[15px] text-[#222222]'} w-full cursor-pointer rounded-[30px] p-[10px] text-center`}
          >
            {text}
          </div>
        ))}
      </div>
      <div className='flex w-full flex-col gap-[5px]'>
        <div className='flex flex-col gap-[5px]'>
          <label
            htmlFor='amount'
            className='text-[14px] font-normal text-[#838187]'
          >
            Enter amount you want to{' '}
            {activeSection === 0 ? 'deposit' : 'withdraw'}
          </label>
          <input
            type='number'
            name='amount'
            id='amount'
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            placeholder='USDC'
            className='w-full rounded-lg px-[22px] py-[16px] text-[14px] font-normal text-[#87878D]'
            style={{ border: '1px solid #87878D' }}
          />
        </div>
        {activeSection === 0 && (
          <div className='flex items-end gap-[11px]'>
            <div className='flex flex-1 flex-col items-start gap-[5px]'>
              <label
                htmlFor='walletId'
                className='text-[14px] font-normal text-[#838187]'
              >
                Wallet ID
              </label>
              <div className='relative w-full'>
                <input
                  className='w-full rounded-lg bg-[#DFF1FF] py-[14px] pl-[22px] pr-[95px] text-[14px] text-[#222222] focus:outline-none'
                  type='text'
                  name='walletId'
                  id='walletId'
                  value={walletId}
                  disabled
                />
                <p className='absolute right-[22px] top-1/2 -translate-y-1/2 cursor-pointer text-[14px] text-[#0653EA]'>
                  Copy
                </p>
              </div>
            </div>
            <div className='h-[72px] w-[72px] bg-cover bg-center bg-no-repeat'>
              {walletId && (
                <SVG
                  text={walletId}
                  options={{
                    margin: 2,
                    width: 72,
                    color: {
                      dark: '#000000',
                      light: '#FFFFFF',
                    },
                  }}
                />
              )}
            </div>
          </div>
        )}
        {activeSection === 1 && (
          <div className='flex flex-col gap-[5px]'>
            <label
              htmlFor='walletId'
              className='text-[14px] font-normal text-[#838187]'
            >
              Your Wallet ID
            </label>
            <input
              type='text'
              name='walletId'
              id='walletId'
              placeholder='Wallet'
              value={recipientWalletAddress}
              onChange={(e) => {
                setRecipientWalletAddress(e.target.value);
              }}
              className='w-full rounded-lg px-[22px] py-[16px] text-[14px] font-normal text-[#87878D]'
              style={{ border: '1px solid #87878D' }}
            />
          </div>
        )}
      </div>
      <div className='flex w-full items-center gap-[15px]'>
        <div className='h-0 w-full' style={{ border: '1px solid #00000033' }} />
        <div className='text-sm font-normal text-[#CCCCCC]'>or</div>
        <div className='h-0 w-full' style={{ border: '1px solid #00000033' }} />
      </div>
      <div className='flex w-full flex-col gap-[5px]'>
        <label
          htmlFor='amount'
          className='text-[14px] font-normal text-[#838187]'
        >
          Choose your payment source
        </label>
        <select
          name='paymentMethod'
          id='amount'
          placeholder='USDC'
          className='w-full appearance-none rounded-lg px-[22px] py-[16px] text-[14px] font-normal text-[#87878D] focus:outline-none'
          style={{ border: '1px solid #87878D' }}
        >
          <option value='stripe'>native</option>
          <option value='stripe'>stripe</option>
        </select>
      </div>
      {activeSection === 1 && (
        <div
          className='flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#0653EA] py-2 text-white'
          onClick={handleWithdraw}
        >
          withdraw
        </div>
      )}
      <div className='flex items-center gap-[15px] bg-[#F2F2F2] p-[15px]'>
        <div className='h-6 w-6'>
          <WarningIcon />
        </div>
        <div className='w-full text-[14px] font-normal text-[#222222]'>
          Funds may be irrecoverable if you enter an incorrect wallet ID. It is
          crucial to ensure the accuracy of the provided ID to avoid any loss.
        </div>
      </div>
    </div>
  );
};

const Funds = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState();
  const [refetchBal, setreFetchBal] = useState(true);
  const { user: selectorUser } = useAuth();
  const [user, setUser] = useState();
  const [token, setToken] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [signature, setSignature] = useState();
  const router = useRouter();

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
          console.log(
            'tokenBalance  ==  ',
            result.result.value[0].account.data.parsed.info.tokenAmount
              .uiAmountString
          );
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
  }, [user, refetchBal]);

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

  // GET TRANSACTION HISTORY
  useEffect(() => {
    if (user) {
      fetch(
        `https://api.solana.fm/v0/accounts/${user.blockchainAddress}/transfers?inflow=true&outflow=true&mint=${process.env.NEXT_PUBLIC_MINT_ADDRESS}&page=1`
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
  }, [user]);

  useEffect(() => {
    if (transactionHistory) {
      const collectedTransactions = [];

      for (const trans of transactionHistory) {
        for (const key of trans.data) {
          const date = new Date(key.timestamp * 1000);
          const month = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const year = date.getFullYear();
          const hour = date.getHours().toString().padStart(2, '0');
          const minute = date.getMinutes().toString().padStart(2, '0');
          const second = date.getSeconds().toString().padStart(2, '0');

          //   key.date = `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
          key.date = `${month} ${day}, ${year}`;

          if (key.token && key.amount >= 10000) {
            key.hash = trans.transactionHash.substring(0, 15) + '...';
            key.transHash = trans.transactionHash;
            collectedTransactions.push(key);
          }
        }
      }

      console.log(collectedTransactions);
      setTransactions(collectedTransactions);
    }
  }, [transactionHistory]);

  return (
    <Fragment>
      <Head>
        <title>Funds</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}
      <div className='relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F0F0FA]'>
        <Sidebar />
        <div className='flex h-full w-full flex-col'>
          <PageHeader pageTitle={'Funds'} />
          <section className='relative mb-[78.22px] flex h-full w-full flex-col gap-8 overflow-y-scroll py-6 pl-[68.82px] pr-[55px] md:mb-0 md:py-[37px]'>
            <div className='flex flex-wrap gap-[50px]'>
              <div className='flex flex-col gap-5'>
                <AvailableBalance balance={tokenBalance} />
                <DepositAndWithdraw
                  walletId={user?.blockchainAddress}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  setIsLoading={setIsLoading}
                  setreFetchBal={setreFetchBal}
                  refetchBal={refetchBal}
                  setTokenBalance={setTokenBalance}
                  tokenBalance={tokenBalance}
                />
              </div>
              <TransactionHistory transactions={transactions} user={user} />
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Funds;
