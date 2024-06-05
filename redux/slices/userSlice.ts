import { CategoryI, User, UserUSDWalletBalanceI } from "@/types";
import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";

interface UserState {
  newAirspaceModal: boolean;
  additionalInfoModal: boolean;
  airspaceData: {};
  category: CategoryI;
  user: User | null;
  isWaitingScreenVisible: boolean;
  userUSDWalletBalance: UserUSDWalletBalanceI;
}

const initialState: UserState = {
  newAirspaceModal: false,
  additionalInfoModal: false,
  airspaceData: {},
  category: { email: "", blockchainAddress: "" },
  user: null,
  isWaitingScreenVisible: false,
  userUSDWalletBalance: { amount: "0", isLoading: true },
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
} = userSlice.actions;
export default userSlice.reducer;
