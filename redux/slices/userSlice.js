
import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    category: {},
  newAirspaceModal: false,
  additionalInfoModal: false,
    airspaceData: {},
    userUSDWalletBalance:"0"

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
      }
  },
});

export const {
  setCategory,
  setNewAirspaceModal,
  setAdditionalInfoModal,
  setAirspaceData,
  setUserUSDWalletBalance
} = userSlice.actions;
export default userSlice.reducer;