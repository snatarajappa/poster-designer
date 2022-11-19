import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import sideBarReducer from "../features/sidebar/sideBarSlice";
import menuReducer from "../features/menu/menuSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    sideBar: sideBarReducer,
    menu: menuReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
