import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [],
};

const rootReducer = combineReducers({
  userReducer,
  // UserReducer: persistReducer(persistConfig, userReducer),
  // Add other reducers here...
});

export default rootReducer;
