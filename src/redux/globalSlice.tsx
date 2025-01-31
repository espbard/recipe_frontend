import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListItem } from "../common/common";

interface GlobalState {
  error: {
    isError: boolean;
    message: string;
  };
  sidebarCollapsed: boolean;
  selectedIngredients: ListItem[];
  selectedTags: ListItem[];
  search_str: string;
  server_connection: boolean;
  loading: boolean;
}

const initialState: GlobalState = {
  error: {
    isError: false,
    message: "Placeholder",
  },
  sidebarCollapsed: true,
  selectedIngredients: [],
  selectedTags: [],
  search_str: "",
  server_connection: false,
  loading: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,

  reducers: {
    setError: (
      state,
      action: PayloadAction<{ isError: boolean; message: string }>
    ) => {
      state.error.isError = action.payload.isError;
      state.error.message = action.payload.message;
    },
    setSideBarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setSelectedIngredients: (state, action: PayloadAction<ListItem[]>) => {
      state.selectedIngredients = action.payload;
    },
    setSelectedTags: (state, action: PayloadAction<ListItem[]>) => {
      state.selectedTags = action.payload;
    },
    setSearchStr: (state, action: PayloadAction<string>) => {
      state.search_str = action.payload;
    },
    setServerConnection: (state, action: PayloadAction<boolean>) => {
      state.server_connection = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setError,
  setSideBarCollapsed,
  setSelectedIngredients,
  setSelectedTags,
  setSearchStr,
  setServerConnection,
  setLoading,
} = globalSlice.actions;

export default globalSlice.reducer;
