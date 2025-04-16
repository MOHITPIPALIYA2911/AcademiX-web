import { configureStore } from "@reduxjs/toolkit";
import questionReducer from "../utils/questionSlice";
import userReducer from "../utils/userSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    questions:questionReducer
  },
});

export default appStore;
