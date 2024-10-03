import React, { Dispatch, SetStateAction } from "react";

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
};

export interface Document {
  id: number;
  filePath: string;
  userId: number;
  requestDocumentId: number;
  createdAt: string;
  updateAt: string;
}

export interface RequestDocument {
  id: number;
  userId: number;
  actionType: string;
  status: string;
  description: string;
  referenceId: number;
  dateCreated: string;
  dateUpdated: string;
  document: Document;
  previewUrl: string;
}

export type propertyStatus = {
  id: number;
  type: string;
};

type metadata = {
  endTime: Date;
};

export type AirspaceItem = {
  type: string;
  receivedBid: {
    id: number;
    price: number;
    bidder: string;
    transaction: string;
    auctionId: number;
  };
  auction: {
    id: number;
    assetId: string;
    seller: string;
    pdaAddress: string;
    initialPrice: number;
    endDate: string;
    currentPrice: number;
    currentBidder: string;
    paymentToken: string;
    transactions: string[];
    isCancelled: boolean;
    isExecuted: boolean;
    AuctionBid: {
      id: number;
      price: number;
      bidder: string;
      transaction: string;
      auctionId: number;
    }[];
    layer: {
      id: number;
      createdAt: string;
      updateAt: string;
      tokenId: string;
      propertyId: number;
      isCurrentlyInAuction: boolean;
      property: {
        id: number;
        createdAt: string;
        updateAt: string;
        title: string;
        transitFee: string;
        address: string;
        timezone: string;
        hasLandingDeck: boolean;
        hasChargingStation: boolean;
        hasStorageHub: boolean;
        isFixedTransitFee: boolean;
        isRentableAirspace: boolean;
        ownerId: number;
        noFlyZone: boolean;
        isBoostedArea: boolean;
        latitude: number;
        longitude: number;
        propertyStatusId: number;
        isActive: boolean;
        isPropertyRewardClaimed: boolean;
        isSoftDelete: boolean;
      };
    };
  };
};

export type requestDocument = {
  actionType: string;
  dateCreated: string;
  dateUpdated: string;
  description: string;
  id: number;
  referenceId: number;
  status: string;
  userId: number;
};

export type PropertyData = {
  id?: number | string;
  address: string;
  ownerId?: number;
  propertyStatusId?: number;
  propertyId?: number;
  property?: any;
  auction?: AirspaceItem;
  hasChargingStation: boolean;
  hasLandingDeck: boolean;
  hasStorageHub: boolean;
  isRentableAirspace: boolean;
  sell?: boolean;
  title: string;
  name: string;
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
  status?: number;
  type?: string;
  hasPlanningPermission?: string | null;
  requestDocument?: requestDocument;
  metadata?: metadata;
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
  isUserRewardClaimed: boolean;
  requestDocument: RequestDocument[];
};

interface Reward {
  id: string;
  rewardId: string;
  email: string;
  taskType: string;
  point: number;
  createdAt: string;
  updateAt: string;
}

interface RewardStats {
  _count: {
    point: number;
  };
  _sum: {
    point: number | null;
  };
  _avg: {
    point: number | null;
  };
  _min: {
    point: number | null;
  };
  _max: {
    point: number | null;
  };
}

export interface UserRewards {
  stats: RewardStats;
  rewards: Reward[];
}

export type Bounds = {
  _ne: {
    lat: number;
    lng: number;
  };
  _sw: {
    lat: number;
    lng: number;
  };
};
export type RentTokenResponse = {
  status: string;
  message: string;
  statusCode?: number;
  errorMessage?: string;
  data?: {
    status?: string;
    message?: string;
    tokenId?: string;
  };
};

export interface UserType {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  newsletter: boolean;
  KYCStatusId: number;
}

export interface Web3authContextType {
  web3auth: any;
  setWeb3auth: React.Dispatch<React.SetStateAction<any>>;
  provider: any;
  setProvider: React.Dispatch<React.SetStateAction<any>>;
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
  setTokenBalance: Dispatch<SetStateAction<number>>;
  tokenBalance: number;
}

export interface AccordionProps {
  selectedMethod: { icon: string; name: string };
  setSelectedMethod: Dispatch<SetStateAction<{ icon: string; name: string }>>;
  activeSection: number;
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

export interface CategoryI {
  email: "";
  blockchainAddress: "";
}

export interface UserUSDWalletBalanceI {
  amount: string;
  isLoading: boolean;
}

export interface KeyI {
  hash: string;
  transHash: string;
  token: string;
  amount: number;
  timestamp: number;
  date: string;
}

export type defaultData = {
  address: string;
  title: string;
  rent: boolean;
  sell: boolean;
  hasPlanningPermission: boolean | null | string;
  hasChargingStation: boolean;
  hasLandingDeck: boolean;
  hasStorageHub: boolean;
  sellingPrice: string;
  timezone: string;
  transitFee: string;
  isFixedTransitFee: boolean;
  noFlyZone: boolean;
  weekDayRanges: [
    { fromTime: number; toTime: 21; isAvailable: boolean; weekDayId: 0 },
    {
      fromTime: number;
      toTime: number;
      isAvailable: boolean;
      weekDayId: number;
    },
    {
      fromTime: number;
      toTime: number;
      isAvailable: boolean;
      weekDayId: number;
    },
    {
      fromTime: number;
      toTime: number;
      isAvailable: boolean;
      weekDayId: number;
    },
    {
      fromTime: number;
      toTime: number;
      isAvailable: boolean;
      weekDayId: number;
    },
    {
      fromTime: number;
      toTime: number;
      isAvailable: boolean;
      weekDayId: number;
    },
    {
      fromTime: number;
      toTime: number;
      isAvailable: boolean;
      weekDayId: number;
    },
  ];
};

export interface AuctionPropertyI {
  id?: string;
  propertyId?: number;
  address?: string;
  latitude?: number;
  property?: PropertyData;
  longitude?: number;
  transitFee: number;
  owner?: string;
  imageUrl: string;
  area?: number[][];
  name?: string;
  highest_bid?: string;
  time_left?: string;
  price?: number;
  currentUserBid?: number;
}

export type AuctionListingI = {
  assetId: string;
  seller: string;
  initialPrice: number;
  secsDuration: number;
};

export type AuctionSubmitI = {
  signatures: string[];
  assetId: string | undefined;
};

export enum ToastEnum {
  ERROR,
  SUCCESS,
}

export type AuctionDataI = {
  id: number;
  assetId: string;
  seller: string;
  pdaAddress: string;
  initialPrice: number;
  endDate: string;
  currentPrice: number;
  currentBidder: string;
  paymentToken: string;
  transactions: string[];
  isCancelled: boolean;
  isExecuted: boolean;
  AuctionBid: {
    id: number;
    price: number;
    bidder: string;
    transaction: string;
    auctionId: number;
  }[];
  layer: {
    id: number;
    createdAt: string;
    updateAt: string;
    tokenId: string;
    propertyId: number;
    isCurrentlyInAuction: boolean;
    property: {
      id: number;
      createdAt: string;
      updateAt: string;
      title: string;
      transitFee: string;
      address: string;
      timezone: string;
      hasLandingDeck: boolean;
      hasChargingStation: boolean;
      hasStorageHub: boolean;
      isFixedTransitFee: boolean;
      isRentableAirspace: boolean;
      ownerId: number;
      noFlyZone: boolean;
      isBoostedArea: boolean;
      latitude: number;
      longitude: number;
      propertyStatusId: number;
      isActive: boolean;
      isPropertyRewardClaimed: boolean;
      vertexes?: [];
    };
  };
};

export enum StatusTypes {
  NotAttempted = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Completed = 4,
  Failed = 5,
  Expired = 6,
  Declined = 7,
  DocumentError = 8,
}



export enum RequestDocumentStatus {
  NOT_SUBMITTED = "NOT_SUBMITTED",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
