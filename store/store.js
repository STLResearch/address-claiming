import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    newAirspace: false,
    airspaceAdditionalInfo: false,
    airspaceData: {},
    category: {},
    userUSDWalletBalance:"0"
  },
  
};

const airspaceSlice = createSlice({
  name: 'airspace',
  initialState: initialState,
  reducers: {
    newAirspaceModal(state) {
      state.value.newAirspace = true;
    },

    closeNewAirspaceModal(state) {
      state.value.newAirspace = false;
    },

    additionalInfoModal(state) {
      state.value.airspaceAdditionalInfo = true;
    },

    closeAdditionalInfoModal(state) {
      state.value.airspaceAdditionalInfo = false;
    },

    airspaceData(state, action) {
      state.value.airspaceData = {
        ...state.value.airspaceData,
        ...action.payload,
      };
    },
    category(state, action) {
      state.value.category = {
        ...state.value.category,
        ...action.payload,
      };
    },
    setUserUSDWalletBalance: (state, action) => {

      state.value.userUSDWalletBalance = action.payload
  }
  },
});

const store = configureStore({
  reducer: airspaceSlice.reducer,
});

export const counterActions = airspaceSlice.actions;


export default store;
