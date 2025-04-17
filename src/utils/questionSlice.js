import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const questionStore = createSlice({
  name: "question",
  initialState,
  reducers: {
    addQuestions: (_, action) => action.payload,
    removeQuestions: () => null,
  },
});

export const { addQuestions, removeQuestions } = questionStore.actions;

export default questionStore.reducer;
