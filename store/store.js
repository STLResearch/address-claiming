import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  value: {
    newAirspace: false,
    airspaceAdditionalInfo: false,
    airspaceData: {},
    category: { email: "", blockchainAddress: "" },
    user: {},
    isWaitingScreenVisible: false,
    userUSDWalletBalance: { amount: "0", isLoading: true },
  },
};

const airspaceSlice = createSlice({
  name: "airspace",
  initialState: initialState,
  reducers: {
    setNewAirspaceModal(state, action) {
      state.value.newAirspace = action.payload;
    },
    setCloseNewAirspaceModal(state, action) {
      state.value.newAirspace = action.payload;
    },
    setAdditionalInfoModal(state, action) {
      state.value.airspaceAdditionalInfo = action.payload;
    },
    setCloseAdditionalInfoModal(state, action) {
      state.value.airspaceAdditionalInfo = action.payload;
    },
    setAirspaceData(state, action) {
      state.value.airspaceData = {
        ...state.value.airspaceData,
        ...action.payload,
      };
    },
    setCategory(state, action) {
      state.value.category = {
        ...state.value.category,
        ...action.payload,
      };
    },
    setIsWaitingScreenVisible(state, action) {
      state.value.isWaitingScreenVisible = action.payload;
    },
    setUser(state, action) {
      state.value.user = action.payload;
    },
    setUserUSDWalletBalance(state, action) {
      state.value.userUSDWalletBalance = action.payload;
    },
  },
});

const store = configureStore({
  reducer: airspaceSlice.reducer,
});

export const counterActions = airspaceSlice.actions;
export default store;
