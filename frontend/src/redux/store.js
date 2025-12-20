import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import workshopReducer from "./slices/workshopSlice";

 const store = configureStore({
  reducer: {
    auth: authReducer,
    workshop: workshopReducer,
  },
});

export default store;
