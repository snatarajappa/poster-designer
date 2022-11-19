import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface MenuState {
  textColor: String;
  imageSrc: String;
}

const initialState: MenuState = {
  textColor: "#000000",
  imageSrc: "image1",
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    updateTextColor: (state, action: PayloadAction<String>) => {
      state.textColor = action.payload;
    },
    updateImageSrc: (state, action: PayloadAction<String>) => {
      state.imageSrc = action.payload;
    },
  },
});

export const { updateTextColor, updateImageSrc } = menuSlice.actions;
export const selectTextColor = (state: RootState) => state.menu.textColor;
export const selectImageSrc = (state: RootState) => state.menu.imageSrc;
export default menuSlice.reducer;
