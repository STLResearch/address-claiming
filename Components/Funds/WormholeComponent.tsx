import React, { useState } from 'react';
import { Root } from 'react-dom/client';
import WormholeConnect, { WormholeConnectConfig, WormholeConnectTheme } from '@wormhole-foundation/wormhole-connect';

const WormholeComponent = ({ root }: { root: Root }) => {
    const [gotItClicked, setgotItClicked] = useState(false);

    const config: WormholeConnectConfig = {
        network: "Testnet",
        chains: ["Sepolia", "Solana"],
        tokens: ["USDCsepolia", "USDCsol"],
        rpcs: {
            Sepolia: "https://sepolia.infura.io/v3/060fcd8bc2ae459c99523251e06536b3",
            Solana: process.env.NEXT_PUBLIC_RPC_TARGET,
        }
    };

    const theme: WormholeConnectTheme = {
        mode: 'dark',
    };

    const closeBox = () => {
        root.unmount();
    };

    const handleGotIt = () => {
        setgotItClicked(true);
    };

    return (
        <div
            style={{
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
            }}
        >
            <button
                onClick={closeBox}
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
                    backgroundColor: '#E8E8E8',
                }}
            >
                <p
                    style={{
                        fontSize: '14px',
                    }}
                >
                    To bridge USDC from Ethereum to Solana:
                    <br />
                    <ul>
                        <li>-Select Ethereum as the "from" chain.</li>
                        <li>-Select Solana as the "to" chain.</li>
                    </ul>
                    <br />
                    Make sure to connect compatible wallets for both chains when prompted.
                    <br />
                    <br />
                    You'll need:
                    <ul>
                        <li>-An Ethereum wallet with USDC (compatible with WormholeConnect).</li>
                        <li>-A Solana wallet with enough SOL for gas fees (compatible with WormholeConnect).</li>
                    </ul>
                    <br />
                    After the bridge is completed, transfer your USDC to your SkyTrade wallet.
                    <br />
                    <br />
                </p>

                {!gotItClicked ? (
                    <>
                        <button
                            onClick={handleGotIt}
                            style={{
                                fontSize: '15px',
                                marginTop: '30px',
                                backgroundColor: '#0653EA',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '10px',
                            }}>
                            Got it
                        </button>
                    </>
                ) : (
                    <div style={{
                        marginTop: '10px',
                        borderRadius: '10px',
                        zIndex: 1200,
                        backgroundColor: 'black',
                    }}>
                        <WormholeConnect config={config} theme={theme} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WormholeComponent;
