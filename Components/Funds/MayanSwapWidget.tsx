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
        solana: 'https://chaotic-ancient-frost.solana-mainnet.quiknode.pro/0f052870cbf3bf62091915980033f2a6225680a1',
        polygon: 'https://polygon-mainnet.infura.io/v3/060fcd8bc2ae459c99523251e06536b3',
    },
    sourceChains: ['polygon'],
    destinationChains: ['solana']
}

const MayanSwapWidget = () => {

    const handleLoadMayanWidget = () => {
        window.MayanSwap.init('swap_widget', widgetConfig);
    };

    return (
        <div>
            <div id="swap_widget" />
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