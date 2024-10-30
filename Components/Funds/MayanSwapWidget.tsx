import { Root } from 'react-dom/client';
import { Colors } from 'react-select';
import Script from "next/script";

type MayanWidgetChainName =
    | "solana"
    | "ethereum"
    | "bsc"
    | "polygon"
    | "avalanche"
    | "arbitrum"
    | "optimism"
    | "base";

type MayanWidgetConfigType = {
    appIdentity: {
        uri: string;
        icon: string;
        name: string;
    };
    setDefaultToken?: boolean;
    rpcs?: { [index in MayanWidgetChainName]?: string };
    solanaExtraRpcs?: string[];
    defaultGasDrop?: { [index in MayanWidgetChainName]?: number };
    sourceChains?: MayanWidgetChainName[];
    destinationChains?: MayanWidgetChainName[];
    tokens?: {
        from?: { [index in MayanWidgetChainName]?: string[] };
        to?: { [index in MayanWidgetChainName]?: string[] };
        featured?: { [index in MayanWidgetChainName]?: string[] };
    };
    solanaReferrerAddress?: string;
    evmReferrerAddress?: string;
    referrerBps?: number;
    isNarrow?: boolean;
    colors?: Colors;
}

declare global {
    interface Window {
        MayanSwap: {
            init: (id: string, config: MayanWidgetConfigType) => void;
        };
    }
}

const widgetConfig: MayanWidgetConfigType = {
    appIdentity: {
        name: 'SkyTrade',
        icon: '',
        uri: 'https://sky.trade/',
    },
    rpcs: {
        solana: process.env.NEXT_PUBLIC_RPC_TARGET,
        ethereum: 'https://sepolia.infura.io/v3/060fcd8bc2ae459c99523251e06536b3',
    },
}
const MayanSwapWidget = ({ root }: { root: Root }) => {
    const closeBox = () => {
        root.unmount();
    };

    const handleLoadMayanWidget = () => {
        window.MayanSwap.init('swap_widget', widgetConfig);
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
                }}
            >
                <div style={{
                    marginTop: '10px',
                    borderRadius: '10px',
                    zIndex: 1200,
                }}>
                    <div id="swap_widget" />
                </div>
            </div>

            <Script
                src="https://cdn.mayan.finance/mayan_widget_v_1_2_3_nowc.js"
                integrity="sha256-bJh3N4pFRH9XtG0u2icxu+PUsyPKGguVp5wmTKVsw3g="
                crossOrigin="anonymous"
                onReady={handleLoadMayanWidget}
            />
        </div>
    );
};


export default MayanSwapWidget;