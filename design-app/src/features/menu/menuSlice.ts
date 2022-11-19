import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface MenuState {
  textColor: String;
}

const initialState: MenuState = {
  textColor: "#000000",
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    updateTextColor: (state, action: PayloadAction<String>) => {
      state.textColor = action.payload;
    },
  },
});

export const { updateTextColor } = menuSlice.actions;
export const selectTextColor = (state: RootState) => state.menu.textColor;
export default menuSlice.reducer;
