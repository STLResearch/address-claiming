import { Fragment, useState, useEffect } from "react";
import Script from "next/script";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import { useAuth } from "@/hooks/useAuth";
import { Web3Auth } from '@web3auth/modal';
import { SolanaWallet } from '@web3auth/solana-provider';
import { Payload as SIWPayload, SIWWeb3 } from '@web3auth/sign-in-with-web3';
import base58 from 'bs58';
import { MagnifyingGlassIcon, WarningIcon, WalletIcon } from "@/Components/Icons";

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const AvailableBalance = ({ balance = 0 }) => {
    return (
        <div className="relative bg-white flex items-center px-[32px] py-[37px] rounded-[30px] justify-between w-[468px]" style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}>
            <div className="flex flex-col justify-between h-full">
                <p className="text-xl font-medium text-[#222222]">Available balance</p>
                <p className="text-3xl text-[#4285F4] font-medium">{USDollar.format(balance)}</p>
            </div>
            <div className="absolute top-3 right-[9px] rounded-[50%] bg-[#CCE3FC] flex items-center justify-center p-[10px]">
                <div className="h-6 w-6">
                    <WalletIcon isActive={true} />
                </div>
            </div>
        </div>
    )
}

const TransactionHistory = ({ transactions }) => {
    return (
        <div className="flex flex-col gap-5 flex-1 min-w-[600px]">
            <div className="flex justify-between items-center">
                <p className="font-medium text-xl text-[#222222]">Transaction History</p>
                <div className="relative pl-[22px] py-[16px] bg-white w-[272px] rounded-lg" style={{ border: "1px solid #87878D" }}>
                    <input type="text" name="searchTransactions" id="searchTransactions" placeholder="Search Transactions" className="outline-none" />
                    <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
                        <MagnifyingGlassIcon />
                    </div>
                </div>
            </div>
            <table className="table-auto">
                <thead className="text-[#7D90B8] uppercase text-sm font-bold tracking-[0.5px]">
                    <tr>
                        {['date', 'transaction id', 'type', 'amount', 'status'].map((th) => (<th className="text-start py-5 px-5">{th}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={transaction.id} className={`${index % 2 === 0 && 'bg-white'}`}>
                            {Object.values(transaction).map((value, secondIndex, array) => { return (<td className={`${secondIndex === 0 ? 'rounded-l-lg' : ''} py-6 ${secondIndex === array.length - 1 ? 'rounded-r-lg' : ''} text-[#222222] px-5`}>{value}</td>) })}
                        </tr>
                    ))}
                </tbody>
            </table>
            {false && <div className="flex items-center justify-end">
                <div className="mx-auto flex gap-[11.71px]">
                    <div className="text-[#4285F4] text-base font-bold cursor-pointer">1</div>
                    <div className="text-[#87878D] text-base font-normal cursor-pointer">2</div>
                    <div className="text-[#87878D] text-base font-normal cursor-pointer">3</div>
                    <div className="text-[#87878D] text-base font-normal cursor-pointer">4</div>
                    <div className="text-[#87878D] text-base font-normal cursor-pointer">5</div>
                    <div className="text-[#0653EA] text-base font-normal cursor-pointer">Next</div>
                </div>
                <div className="text-[#87878D] text-[14px] font-normal -tracking-[0.5px]">Page 1 of 5</div>
            </div>}
        </div>
    )
}

const DepositAndWithdraw = ({ walletId, activeSection, setActiveSection }) => {
    return (
        <div className="flex flex-col gap-[15px] items-center w-[468px] bg-white rounded-[30px] py-[30px] px-[29px]" style={{
            boxShadow: "0px 12px 34px -10px #3A4DE926"
        }}>
            <div className="flex gap-[5px] w-full">
                {['Deposit', 'Withdraw'].map((text, index) => (<div onClick={() => setActiveSection(index)} className={`${activeSection === index ? 'bg-[#222222] text-base text-white' : 'bg-[#2222221A] text-[15px] text-[#222222]'} rounded-[30px] p-[10px] text-center cursor-pointer w-full`}>{text}</div>))}
            </div>
            <div className="flex flex-col gap-[5px] w-full">
                <div className="flex flex-col gap-[5px]">
                    <label htmlFor="amount" className="text-[14px] font-normal text-[#838187]">Enter amount you want to {activeSection === 0 ? 'deposit' : 'withdraw'}</label>
                    <input type="text" name="amount" id="amount" placeholder="USDC" className="w-full rounded-lg py-[16px] px-[22px] text-[#87878D] text-[14px] font-normal" style={{ border: "1px solid #87878D" }} />
                </div>
                {activeSection === 0 &&
                    <div className="flex items-end gap-[11px]">
                        <div className="flex flex-col items-start gap-[5px] flex-1">
                            <label htmlFor="walletId" className="text-[14px] font-normal text-[#838187]">Wallet ID</label>
                            <div className="relative w-full">
                                <input className="bg-[#DFF1FF] text-[#222222] text-[14px] rounded-lg w-full py-[14px] pl-[22px] focus:outline-none pr-[95px]" type="text" name="walletId" id="walletId" value={walletId} disabled />
                                <p className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[#0653EA] text-[14px] cursor-pointer">Copy</p>
                            </div>
                        </div>
                        <div className="w-[72px] h-[72px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('/images/QR-code.png')" }}></div>
                    </div>
                }
                {activeSection === 1 &&
                    <div className="flex flex-col gap-[5px]">
                        <label htmlFor="walletId" className="text-[14px] font-normal text-[#838187]">Your Wallet ID</label>
                        <input type="text" name="walletId" id="walletId" placeholder="Wallet" className="w-full rounded-lg py-[16px] px-[22px] text-[#87878D] text-[14px] font-normal" style={{ border: "1px solid #87878D" }} />
                    </div>
                }
            </div>
            <div className="flex items-center gap-[15px] w-full">
                <div className="w-full h-0" style={{ border: "1px solid #00000033" }} />
                <div className="text-sm text-[#CCCCCC] font-normal">or</div>
                <div className="w-full h-0" style={{ border: "1px solid #00000033" }} />
            </div>
            <div className="flex flex-col gap-[5px] w-full">
                <label htmlFor="amount" className="text-[14px] font-normal text-[#838187]">Choose your payment source</label>
                <select name="paymentMethod" id="amount" placeholder="USDC" className="w-full rounded-lg py-[16px] px-[22px] text-[#87878D] text-[14px] font-normal appearance-none focus:outline-none" style={{ border: "1px solid #87878D" }}>
                    <option value="stripe">Stripe</option>
                </select>
            </div>
            <div className="w-full py-2 bg-[#0653EA] cursor-pointer text-white flex items-center justify-center rounded-lg">Deposit</div>
            <div className="flex items-center gap-[15px] p-[15px] bg-[#F2F2F2]">
                <div className="w-6 h-6"><WarningIcon /></div>
                <div className="text-[#222222] text-[14px] font-normal w-full">Funds may be irrecoverable if you enter an incorrect wallet ID. It is crucial to ensure the accuracy of the provided ID to avoid any loss.</div>
            </div>
        </div>
    )
}

const Funds = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const transactions = [];

    const { user: selectorUser } = useAuth();
    const [user, setUser] = useState();
    const [token, setToken] = useState('');
    const [tokenBalance, setTokenBalance] = useState('');
    const [signature, setSignature] = useState();

    // GET USER AND TOKEN
    useEffect(() => {
        if (selectorUser) {
            const authUser = async () => {
                const chainConfig = {
                    chainNamespace: 'solana',
                    chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
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
                    chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
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
                // const domain = 'localhost:3000';
                const origin = window.location.origin;
                // const origin = 'http://localhost:3000';

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

    return (
        <Fragment>
            {isLoading && createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
            {isLoading && createPortal(<Spinner />, document.getElementById('backdrop-root'))}

            <div className="relative rounded bg-[#F0F0FA] h-screen w-screen flex items-center justify-center overflow-hidden">
                <Sidebar />
                <div className="w-full h-full flex flex-col">
                    <PageHeader pageTitle={'Funds'} />
                    <section className="relative w-full h-full py-6 md:py-[37px] flex flex-col gap-8 mb-[78.22px] md:mb-0 overflow-y-scroll pl-[68.82px] pr-[55px]">
                        <div className="flex gap-[50px] flex-wrap">
                            <div className="flex flex-col gap-5">
                                <AvailableBalance balance={tokenBalance} />
                                <DepositAndWithdraw walletId={user?.blockchainAddress} activeSection={activeSection} setActiveSection={setActiveSection} />
                            </div>
                            <TransactionHistory transactions={transactions} />
                        </div>
                    </section>
                </div>
            </div>
        </ Fragment>
    )
}

export default Funds;