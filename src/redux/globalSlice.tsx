import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListItem } from "../common/common";

interface GlobalState {
  error: {
    isError: boolean;
    message: string;
  };
  selectedIngredients: ListItem[];
  selectedTags: ListItem[];
  selectedMealType: string;
  search_str: string;
  server_connection: boolean;
  loading: boolean;
  loadingGlobal: boolean;
  popup: {
    open: boolean;
    isError: boolean;
    message: string;
    singleButton: boolean;
    title?: string;
    onClickLeft?: string;
    onClickRight?: string;
    leftButtonText?: string;
    rightButtonText?: string;
    id?: number;
  };
}

const initialState: GlobalState = {
  error: {
    isError: false,
    message: "Placeholder",
  },
  selectedIngredients: [],
  selectedTags: [],
  selectedMealType: "",
  search_str: "",
  server_connection: false,
  loading: false,
  loadingGlobal: false,
  popup: {
    open: false,
    isError: false,
    message: "Placeholder",
    singleButton: false,
    title: "Success",
    leftButtonText: "Ok",
    rightButtonText: "Close",
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,

  reducers: {
    setPopup: (
      state: any,
      action: PayloadAction<{
        open: boolean;
        isError: boolean;
        message: string;
        singleButton?: boolean;
        title?: string;
        onClickLeft?: string;
        onClickRight?: string;
        leftButtonText?: string;
        rightButtonText?: string;
        id?: number;
      }>
    ) => {
      state.popup.open = action.payload.open;
      state.popup.isError = action.payload.isError;
      state.popup.message = action.payload.message;
      state.popup.singleButton = action.payload.singleButton || false;
      state.popup.title = action.payload.title || undefined;
      state.popup.onClickLeft = action.payload.onClickLeft || undefined;
      state.popup.onClickRight = action.payload.onClickRight || undefined;
      state.popup.leftButtonText = action.payload.leftButtonText || undefined;
      state.popup.rightButtonText = action.payload.rightButtonText || undefined;
      state.popup.id = action.payload.id || undefined;
    },
    clearPopup: (state: any) => {
      state.popup.open = false;
      state.popup.isError = false;
      state.popup.message = "";
      state.popup.title = undefined;
      state.popup.onClickLeft = undefined;
      state.popup.onClickRight = undefined;
      state.popup.leftButtonText = undefined;
      state.popup.rightButtonText = undefined;
      state.popup.id = undefined;
    },
    setError: (
      state: any,

      action: PayloadAction<{ isError: boolean; message: string }>
    ) => {
      state.error.isError = action.payload.isError;
      state.error.message = action.payload.message;
    },
    setSelectedIngredients: (state: any, action: PayloadAction<ListItem[]>) => {
      state.selectedIngredients = action.payload;
    },
    setSelectedTags: (state: any, action: PayloadAction<ListItem[]>) => {
      state.selectedTags = action.payload;
    },
    setSelectedMealType: (state: any, action: PayloadAction<string>) => {
      state.selectedMealType = action.payload;
    },
    setSearchStr: (state: any, action: PayloadAction<string>) => {
      state.search_str = action.payload;
    },
    setServerConnection: (state: any, action: PayloadAction<boolean>) => {
      state.server_connection = action.payload;
    },
    setLoading: (state: any, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setGlobalLoading: (state: any, action: PayloadAction<boolean>) => {
      state.loadingGlobal = action.payload;
    },
  },
});

export const {
  setPopup,
  clearPopup,
  setError,
  setSelectedIngredients,
  setSelectedTags,
  setSelectedMealType,
  setSearchStr,
  setServerConnection,
  setLoading,
  setGlobalLoading,
} = globalSlice.actions;

export default globalSlice.reducer;
