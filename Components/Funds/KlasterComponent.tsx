import { BiconomyV2AccountInitData, BridgingTypes, buildBridgingOperations, buildItx, buildMultichainReadonlyClient, buildRpcInfo, buildTokenMapping, deployment, initKlaster, klasterNodeHost, KlasterSDK, loadBiconomyV2Account, prepareStrategy, UnifiedBalanceResult } from "klaster-sdk";
import { useEffect, useState } from "react";
import { createWalletClient, custom, http, formatUnits, parseUnits, WalletClient, ParseAccount } from "viem";
import { arbitrum, base, optimism, polygon } from "viem/chains";
import Image from "next/image";

const KlasterComponent = () => {
    const [address, setAddress] = useState<`0x${string}`>('0x');
    const [klasterSdk, setKlasterSdk] = useState<KlasterSDK<BiconomyV2AccountInitData>>();
    const [unifiedBalance, setUnifiedBalance] = useState<UnifiedBalanceResult>();
    const [klasterIsConnected, setKlasterIsConnected] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [walletClient, setWalletClient] = useState<WalletClient>();
    const [bridgeToChain, setBridgeToChain] = useState<'polygon' | 'arbitrum' | 'base' | 'optimism'>('base');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
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

    const getImagePath = (chain: 'polygon' | 'arbitrum' | 'base' | 'optimism'): string => {
        if (chain == 'polygon') return "images/polygon-matic-logo.svg"
        if (chain == 'arbitrum') return "images/arbitrum-arb-logo.svg"
        if (chain == 'base') return "images/base.svg"
        if (chain == 'optimism') return "images/optimism-ethereum-op-logo.svg"
        return ''

    }

    useEffect(() => {
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
        connectWallet();
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <div style={{ marginTop: '10px', borderRadius: '10px', zIndex: 1200 }}>
            <div style={{ padding: '20px', maxWidth: '350px', margin: '0 auto' }}>
                <div>
                    <div
                        style={{
                            marginBottom: '15px',
                            backgroundColor: '#82B9E6',
                            padding: '10px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                        onClick={handleCopy}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4FA7D9')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#82B9E6')}
                    >
                        <span style={{ fontWeight: 'bold', color: '#FFFFFF', marginRight: '8px' }}>
                            Address:
                        </span>
                        <span style={{ color: '#FFFFFF' }}>
                            {`${address.slice(0, 6)}...${address.slice(-4)}`}
                        </span>
                        {isCopied && (
                            <span
                                style={{
                                    marginLeft: '10px',
                                    fontSize: '14px',
                                    color: '#FFFFFF',
                                }}
                            >
                                Copied!
                            </span>
                        )}
                    </div>
                    <div
                        style={{
                            marginBottom: '15px',
                            backgroundColor: '#82B9E6',
                            padding: '10px',
                            borderRadius: '8px',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            color: '#FFFFFF'
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4FA7D9')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#82B9E6')}
                    >
                        <span style={{ fontWeight: 'bold', color: '#FFFFFF', marginRight: '8px' }}>Balance: </span>
                        {parseFloat(formatUnits(unifiedBalance ? unifiedBalance.balance : BigInt(0), 6)).toFixed(2)} USDC
                        <button
                            onClick={toggleDropdown}
                            style={{
                                marginLeft: '70px',
                                cursor: 'pointer',
                                background: '#E0F7FF',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '18px',
                                padding: '5px',
                                color: '#0077CC',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#CDEBFF')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E0F7FF')}
                        >
                            ⬇️
                        </button>
                        {dropdownVisible && (
                            <div
                                style={{
                                    marginTop: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    padding: '10px',
                                }}
                            >
                                {['Polygon', 'Base', 'Optimism', 'Arbitrum'].map((chain: any) => (
                                    <div
                                        key={chain}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '10px',
                                            borderBottom: '1px solid #F0F0F0',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s',
                                        }}
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F5F5F5')}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                                    >
                                        <div
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                            }}
                                        >
                                            <Image src={getImagePath(chain.toLowerCase())} alt={''} />
                                        </div>
                                        <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>
                                            {chain}: {parseFloat(formatUnits(getChainBalance(chain.toLowerCase()), 6)).toFixed(2)} USDC
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div
                        style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <button
                            disabled
                            style={{
                                width: '245px',
                                padding: '12px 20px',
                                fontSize: '16px',
                                backgroundColor: '#E0F7FF',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#0077CC',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s, transform 0.2s, color 0.3s',
                            }}
                            onMouseOver={(e) => {
                                if (e.currentTarget.disabled) {
                                    e.currentTarget.style.backgroundColor = '#FFD7D7';
                                    e.currentTarget.style.color = '#FF4D4D';
                                    e.currentTarget.textContent = 'Coming Soon!';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (e.currentTarget.disabled) {
                                    e.currentTarget.style.backgroundColor = '#E0F7FF';
                                    e.currentTarget.style.color = '#0077CC';
                                    e.currentTarget.textContent = 'Bridge USDC via Klaster';
                                }
                            }}
                        >
                            Bridge USDC via Klaster
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KlasterComponent;

