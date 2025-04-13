import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userStore = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (_, action) => action.payload,
    removeUser: () => null,
  },
});

export const { addUser, removeUser } = userStore.actions;

export default userStore.reducer;
