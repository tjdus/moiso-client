import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  TeamDetailDTO,
  TeamMemberInfoDTO,
  ProjectDTO,
  MemberDTO,
} from "../interface/fetchDTOs";

// Define a type for the slice state

// Define the initial state using that type
// const initialState: TeamDetailDTO = {
//   id: "",
//   name: "",
//   members: [],
//   projects: [],
//   created_at: "",
//   updated_at: "",
//   created_by: {
//     id: "",
//     name: "",
//     email: "",
//     username: "",
//   },
//   updated_by: {
//     id: "",
//     name: "",
//     email: "",
//     username: "",
//   },
// };

const initialState: TeamDetailDTO | null = null;

export const teamSlice = createSlice({
  name: "team",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setTeam: (state, action: PayloadAction<TeamDetailDTO>) => {
      return action.payload;
    },
  },
});

export const { setTeam } = teamSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//xsexport const selectCount = (state: RootState) => state.counter.value;

export default teamSlice.reducer;
