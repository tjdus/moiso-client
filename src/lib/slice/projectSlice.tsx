import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ProjectDetailDTO } from "../interface/work";

const initialState: ProjectDetailDTO | null = null;

export const projectSlice = createSlice({
  name: "project",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setProject: (state, action: PayloadAction<ProjectDetailDTO>) => {
      return action.payload;
    },
  },
});

export const { setProject } = projectSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//xsexport const selectCount = (state: RootState) => state.counter.value;

export default projectSlice.reducer;
