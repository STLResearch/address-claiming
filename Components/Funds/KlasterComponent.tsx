'use client'
import { BiconomyV2AccountInitData, BridgingTypes, buildBridgingOperations, buildItx, buildMultichainReadonlyClient, buildRpcInfo, buildTokenMapping, deployment, initKlaster, klasterNodeHost, KlasterSDK, loadBiconomyV2Account, prepareStrategy, UnifiedBalanceResult } from "klaster-sdk";
import { useEffect, useState } from "react";
import { createWalletClient, custom, http, formatUnits, parseUnits, WalletClient, ParseAccount } from "viem";
import { arbitrum, base, optimism, polygon, bsc, avalanche } from "viem/chains";
import { LiFiBrigePlugin } from "@/services/LiFiBridgePlugin";
import { Root } from "react-dom/client";

const KlasterComponent = ({ root }: { root: Root }) => {
    const [address, setAddress] = useState<`0x${string}`>('0x');
    const [klasterSdk, setKlasterSdk] = useState<KlasterSDK<BiconomyV2AccountInitData>>();
    const [unifiedBalance, setUnifiedBalance] = useState<UnifiedBalanceResult>();
    const [klasterIsConnected, setKlasterIsConnected] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [walletClient, setWalletClient] = useState<WalletClient>();
    const [bridgeToChain, setBridgeToChain] = useState<'polygon' | 'arbitrum' | 'base' | 'optimism'>('base');

    const closeBox = () => {
        root.unmount();
    };

    const mcClient = buildMultichainReadonlyClient([
        buildRpcInfo(optimism.id, "https://optimism-mainnet.infura.io/v3/060fcd8bc2ae459c99523251e06536b3"),
        buildRpcInfo(base.id, "https://base-mainnet.infura.io/v3/060fcd8bc2ae459c99523251e06536b3"),
        buildRpcInfo(arbitrum.id, "https://arbitrum-mainnet.infura.io/v3/060fcd8bc2ae459c99523251e06536b3"),
        buildRpcInfo(polygon.id, "https://polygon-mainnet.infura.io/v3/060fcd8bc2ae459c99523251e06536b3"),
    ]);

    const mcUSDC = buildTokenMapping([
        deployment(optimism.id, "0x0b2c639c533813f4aa9d7837caf62653d097ff85"),
        deployment(base.id, "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
        deployment(arbitrum.id, "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"),
        deployment(polygon.id, "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"),
    ]);

    const configureKlaster = async (client: WalletClient) => {
        const clientAddresses = await client.getAddresses();
        const clientAddress = clientAddresses[0];
        setAddress(clientAddress);
        const klaster = await initKlaster({
            accountInitData: loadBiconomyV2Account({
                owner: clientAddress,
            }),
            nodeUrl: klasterNodeHost.default,
        });
        await getBalances(klaster);
        setKlasterSdk(klaster);
        setKlasterIsConnected(true);
    }

    const getBalances = async (klaster: KlasterSDK<BiconomyV2AccountInitData>) => {
        const uBalance = await mcClient.getUnifiedErc20Balance({
            tokenMapping: mcUSDC,
            account: klaster.account,
        });
        setUnifiedBalance(uBalance);
    }

    const getChainBalance = (chain: 'polygon' | 'arbitrum' | 'base' | 'optimism'): bigint => {
        if (unifiedBalance) {
            const balance = unifiedBalance.breakdown?.find(item => {
                if (chain === 'polygon') return item.chainId === polygon.id;
                if (chain === 'arbitrum') return item.chainId === arbitrum.id;
                if (chain === 'base') return item.chainId === base.id;
                if (chain === 'optimism') return item.chainId === optimism.id;
                return false;
            })?.amount;

            return balance ?? BigInt(0);
        }
        else {
            console.error('Error: unifiedBalance is undefined.')
            return BigInt(0);
        }
    }

    const bridgeAllUsdcToChain = async () => {
        try {
            if (klasterSdk && unifiedBalance && walletClient) {
                const chainToId = {
                    "polygon": polygon.id,
                    "arbitrum": arbitrum.id,
                    "base": base.id,
                    "optimism": optimism.id,
                };
                const bridgingOps = await prepareStrategy({
                    tokenMapping: mcUSDC,
                    client: mcClient,
                    amount: unifiedBalance.balance - parseUnits("0.2", 6),
                    account: klasterSdk.account,
                    destinationChainId: chainToId[bridgeToChain],
                    unifiedBalance: unifiedBalance
                })
                const usdcAddress = mcUSDC.find(item => { return item.chainId == chainToId[bridgeToChain] })?.address;
                const bridge = await bridgingOps.encode(LiFiBrigePlugin);
                console.log("Hi")
                const iTx = buildItx({
                    operations: bridge.steps,
                    nodeFeeOperation: {
                        token: usdcAddress ? usdcAddress : '0x',
                        chainId: polygon.id
                    }
                })
                const quote = await klasterSdk.getQuote(iTx);
                const signed = await walletClient.signMessage({
                    message: {
                        raw: quote.itxHash,
                    },
                    account: address,
                });
                const result = await klasterSdk.execute(quote, signed);
                console.log('Transaction executed successfully! Hash: ', result.itxHash);
            }
            else {
                if (!klasterSdk)
                    console.error('Error: klasterSdk is undefined.')
                if (!unifiedBalance)
                    console.error('Error: unifiedBalance is undefined.')
                if (!walletClient)
                    console.error('Error: walletClient is undefined.')
            }
        }
        catch (error) {
            console.error('Error bridging tokens: ', error);
        }
    }

    const connectWallet = async () => {
        if ((window as any).ethereum) {
            try {
                await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                const client = createWalletClient({
                    transport: custom((window as any).ethereum),
                });
                setWalletClient(client);
                await configureKlaster(client);
                console.log('Wallet connected successfully!');
            } catch (error) {
                console.error('Error connecting to Metamask:', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '55%',
            left: '40%',
            transform: 'translate(-50%, -50%)',
            width: 'fit-content',
            height: '500px',
            backgroundColor: '#E8E8E8',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            padding: '20px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
        }}>
            <button
                onClick={
                    closeBox
                }
                style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    zIndex: 1100,
                }}
            >
                &times;
            </button>
            <div
                style={{
                    overflowY: 'auto',
                    maxHeight: '90%',
                    width: '100%',
                    padding: '10px 0',
                }}
            >
                <div style={{
                    marginTop: '10px',
                    borderRadius: '10px',
                    zIndex: 1200,
                }}>
                    <div style={{ padding: '20px', maxWidth: '300px', margin: '0 auto' }}>
                        {!klasterIsConnected ? (
                            <button onClick={connectWallet} style={{ padding: '10px', fontSize: '16px' }}>
                                Login with MetaMask
                            </button>
                        ) : (
                            <div>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>Address: </span>
                                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                                </div>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>Balance: </span>
                                    {formatUnits(unifiedBalance ? unifiedBalance.balance : BigInt(0), 6)} USDC
                                    <button
                                        onClick={toggleDropdown}
                                        style={{
                                            marginLeft: '10px',
                                            cursor: 'pointer',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '16px',
                                        }}
                                    >
                                        ⬇️
                                    </button>
                                    {dropdownVisible && (
                                        <div style={{ border: '1px solid #ccc', padding: '5px', marginTop: '5px' }}>
                                            <p>{formatUnits(getChainBalance('polygon'), 6)}</p>
                                            <p>{formatUnits(getChainBalance('base'), 6)}</p>
                                            <p>{formatUnits(getChainBalance('optimism'), 6)}</p>
                                            <p>{formatUnits(getChainBalance('arbitrum'), 6)}</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <button
                                        onClick={bridgeAllUsdcToChain}
                                    >
                                        Bridge to Base
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KlasterComponent;

