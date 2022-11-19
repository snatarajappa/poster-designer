import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ToolState {
  tool: "text" | "image" | "selection";
}

const initialState: ToolState = {
  tool: "text",
};

export const sideBarSlice = createSlice({
  name: "sideBar",
  initialState,
  reducers: {
    updateTool: (
      state,
      action: PayloadAction<"text" | "image" | "selection">
    ) => {
      state.tool = action.payload;
    },
  },
});

export const { updateTool } = sideBarSlice.actions;
export const selectTool = (state: RootState) => state.sideBar.tool;
export default sideBarSlice.reducer;
