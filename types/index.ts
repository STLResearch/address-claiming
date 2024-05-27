import { IProvider } from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { Dispatch, SetStateAction } from "react";

export type Coordinates = {
    longitude: number;
    latitude: number;
};

export type Vertex = {
    latitude: number;
    longitude: number;
};

export type WeekDayRange = {
    isAvailable: boolean;
    fromTime: number;
    toTime: number;
    weekDayId: number;
};


export interface TransactionHistoryProps {
  transactions: Transaction[];
  user: User;
}


export interface Transaction {
    token: boolean;
    timestamp: number;
    id: string;
    date: string;
    transHash: string;
    hash: string;
    destination: string;
    amount: number;
    status: string;
  }

export type layers = {
    createdAt?: Date;
    updateAt?: Date;
    id: number;
    tokenId: string;
    propertyId: number;
}

export type propertyStatus = {
    id: number;
    type: string;
}

export type PropertyData = {
    id?: number | string;
    address: string;
    ownerId?: number;
    propertyStatusId?: number;
    hasChargingStation: boolean;
    hasLandingDeck: boolean;
    hasStorageHub: boolean;
    isRentableAirspace: boolean;
    sell?: boolean;
    title: string;
    transitFee: string;
    noFlyZone: boolean;
    isFixedTransitFee: boolean;
    latitude?: number;
    longitude?: number;
    timezone: string;
    isActive?: boolean | null;
    sellingPrice?: string;
    price?: number;
    vertexes?: Vertex[];
    weekDayRanges: WeekDayRange[];
    createdAt?: Date;
    updateAt?: Date;
    layers?: layers[];
    propertyStatus?: propertyStatus;
};
export type User = {
    KYCStatusId: number;
    blockchainAddress: string;
    categoryId: number;
    createdAt: string;
    email: string;
    id: number;
    isActive: boolean;
    isAdmin: boolean;
    name: string;
    newsletter: boolean;
    ownedReferralCode: {
        id: number;
        code: string;
        codeChanged: boolean;
    };
    ownedReferralCodeId: number;
    phoneNumber: string;
    updateAt: string;
    usedReferralCode: {
        id: number | null;
        code: string | null;
        codeChanged: boolean;
    } | null;
    usedReferralCodeId: number | null;
};

export type Bounds = {
    _ne: {
        lat: number;
        lng: number;
    }
    _sw: {
        lat: number;
        lng: number;
    }
}
export type RentTokenResponse = {
    status: string;
    message: string
    statusCode?: number;
    errorMessage?:string;
    data?:{
        status?:string;
        message?:string;
        tokenId?:string
    }
}


export interface UserType {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    newsletter: boolean;
    KYCStatusId: number;
}

export interface PersonalInformationType {
    name: string;
    email: string;
    phoneNumber: string;
    newsletter: boolean;
    KYCStatusId: number;
}
 
 export interface AvailableBalanceProps {
    solbalance: number;
  }
  
  export interface UserUSDWalletBalance {
    isLoading: boolean;
    amount: number;
  }
  
  export interface RootState {
    value: {
      userUSDWalletBalance: UserUSDWalletBalance;
    };
  }
  

 export interface DepositAndWithdrawProps {
  walletId: string;
  activeSection: number;
  setActiveSection: Dispatch<SetStateAction<number>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setreFetchBal: Dispatch<SetStateAction<boolean>>;
  refetchBal: boolean;
  setTokenBalance: Dispatch<SetStateAction<number>>;
  tokenBalance: number;
  solbalance: number;
}

 export interface AccordionProps {
    selectedMethod: { icon: string; name: string };
    setSelectedMethod: Dispatch<SetStateAction<{ icon: string; name: string }>>;
  }
  
  export interface PaymentMethod {
    icon: string;
    name: string;
  }

export interface TooltipProps {
  isCopied: boolean;
}

export interface ConnectionConfig {
    rpcTarget: string;
  }

  
