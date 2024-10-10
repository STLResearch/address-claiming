import React from "react";
import { LiFiWidget, WidgetConfig, ChainType } from "@lifi/widget";
import { CloseIconBlack } from "../Icons";

export enum TRANSACTION_TYPE {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
}

interface LiFiComponentProps {
  transactionType: TRANSACTION_TYPE.DEPOSIT | TRANSACTION_TYPE.WITHDRAW;
  walletAddress: string | undefined;
  onClose: () => void;
}

export const LiFiComponent: React.FC<LiFiComponentProps> = ({ transactionType, walletAddress, onClose }) => {
  const widgetConfig: WidgetConfig = {
    toChain: transactionType === TRANSACTION_TYPE.DEPOSIT ? 1151111081099710 : undefined,
    toToken: transactionType === TRANSACTION_TYPE.DEPOSIT ? "USDC" : undefined,
    toAddress:
      transactionType === TRANSACTION_TYPE.DEPOSIT && walletAddress ?
        { address: walletAddress, chainType: ChainType.SVM }
      : undefined,
    fromChain: transactionType === TRANSACTION_TYPE.WITHDRAW ? 1151111081099710 : undefined,
    fromToken: transactionType === TRANSACTION_TYPE.WITHDRAW ? "USDC" : undefined,
    appearance: "light",
    disabledUI: transactionType === TRANSACTION_TYPE.DEPOSIT ? ["toToken"] : ["fromToken"],
    hiddenUI: ["appearance"],
    theme: {
      container: {
        border: "1px solid rgb(234, 234, 234)",
        borderRadius: "16px",
        height: "520px",
      },
    },
    integrator: "Sky Trade",
  };

  return (
    <div className="fixed left-0 top-0 z-[500] h-full w-full backdrop-blur-md md:left-1/2 md:top-1/2 md:h-auto md:w-auto md:-translate-x-1/2 md:-translate-y-1/2">
      <div
        onClick={onClose}
        className="absolute right-4 top-3 z-[501] flex h-[10px] w-[10px] cursor-pointer items-center justify-center"
      >
        <CloseIconBlack />
      </div>
      <LiFiWidget config={widgetConfig} integrator="Sky Trade" />
    </div>
  );
};
