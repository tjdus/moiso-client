import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const initialState = "overview";

export const tabSlice = createSlice({
  name: "tab",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setTab: (state, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
});

export const { setTab } = tabSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//xsexport const selectCount = (state: RootState) => state.counter.value;

export default tabSlice.reducer;
