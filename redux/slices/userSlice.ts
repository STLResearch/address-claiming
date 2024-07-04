import { CategoryI, PropertyData, User, UserUSDWalletBalanceI } from "@/types";
import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";

interface UserState {
  newAirspaceModal: boolean;
  additionalInfoModal: boolean;
  airspaceData: {};
  category: CategoryI;
  user: User | null;
  isWaitingScreenVisible: boolean;
  userUSDWalletBalance: UserUSDWalletBalanceI;
  activeFilters: number;
  isCreateAuctionModalOpen: boolean;
  airspaceList: PropertyData[];
  selectedproperty: PropertyData[];
}

const initialState: UserState = {
  newAirspaceModal: false,
  additionalInfoModal: false,
  airspaceData: {},
  category: { email: "", blockchainAddress: "" },
  user: null,
  isWaitingScreenVisible: false,
  userUSDWalletBalance: { amount: "0", isLoading: true },
  activeFilters: 0,
  isCreateAuctionModalOpen: false,
  airspaceList: [],
  selectedproperty: [],
};

const userSlice: Slice<UserState> = createSlice({
  name: "user",
  initialState,
  reducers: {
    setNewAirspaceModal: (state, action: PayloadAction<boolean>) => {
      state.newAirspaceModal = action.payload;
    },

    setAdditionalInfoModal: (state, action: PayloadAction<boolean>) => {
      state.additionalInfoModal = action.payload;
    },

    setAirspaceData: (state, action: PayloadAction<{}>) => {
      state.airspaceData = action.payload;
    },
    setCategory: (state, action: PayloadAction<CategoryI>) => {
      state.category = action.payload;
    },
    setIsWaitingScreenVisible: (state, action: PayloadAction<boolean>) => {
      state.isWaitingScreenVisible = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setUserUSDWalletBalance: (
      state,
      action: PayloadAction<UserUSDWalletBalanceI>
    ) => {
      state.userUSDWalletBalance = action.payload;
    },

    setActiveFilters: (state, action: PayloadAction<number>) => {
      state.activeFilters = action.payload;
    },

    setIsCreateAuctionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateAuctionModalOpen = action.payload;
    },

    setAirspaceList: (state, action: PayloadAction<PropertyData[]>) => {
      state.airspaceList = action.payload;
    },
    setSelectedproperty: (state, action: PayloadAction<PropertyData[]>) => {
      state.selectedproperty = action.payload;
    },
  },
});

export const {
  setNewAirspaceModal,
  setAdditionalInfoModal,
  setAirspaceData,
  setCategory,
  setIsWaitingScreenVisible,
  setUser,
  setUserUSDWalletBalance,
  setActiveFilters,
  setIsCreateAuctionModalOpen,
  setAirspaceList,
  setSelectedproperty,
} = userSlice.actions;
export default userSlice.reducer;
