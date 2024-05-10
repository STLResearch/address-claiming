
import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  category: {},
  newAirspaceModal: false,
  additionalInfoModal: false,
  airspaceData: {},
  userUSDWalletBalance: { amount: "0", isLoading: true },
  isWaitingScreenVisible: false,
  user: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },

    setNewAirspaceModal:(state, action)=> {
        state.newAirspaceModal = action.payload;
      },
  
      setAdditionalInfoModal:(state, action)=> {
        state.additionalInfoModal = action.payload;
      },
  
      setAirspaceData:(state, action)=> {
        state.airspaceData = action.payload;
      },
      setUserUSDWalletBalance: (state, action)=>{
        state.userUSDWalletBalance = action.payload
      },
      setIsWaitingScreenVisible: (state, action)=>{
        state.isWaitingScreenVisible = action.payload
      },
      setUser: (state, action)=>{
        state.user = action.payload
      },
      setClearState: (state, action)=>{
        state.user = {};
        state.category = {};
        state.isWaitingScreenVisible = false;
      }
  },
});

export const {
  setCategory,
  setNewAirspaceModal,
  setAdditionalInfoModal,
  setAirspaceData,
  setUserUSDWalletBalance,
  setIsWaitingScreenVisible,
  setUser,
  setClearState
} = userSlice.actions;
export default userSlice.reducer;