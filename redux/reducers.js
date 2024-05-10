import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "./slices/userSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["category", "isWaitingScreenVisible", "user"],
  blacklist: ["userUSDWalletBalance"],
};

const rootReducer = combineReducers({
  userReducer: persistReducer(persistConfig, userReducer),
  // Add other reducers here...
});

export default rootReducer;
