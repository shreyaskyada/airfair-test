import { NotificationType } from "./../../layout/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserDetailsType {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  phoneNo?: string;
  roles?: string[];
  bankList?: any;
  walletList?: any;
}

export type NotificationUIType = (
  type: NotificationType,
  message: string,
  description?: string
) => void;

export interface AppState {
  isLoading: boolean;
  flightDetails: boolean;
  isLoggedIn: boolean;
  notifcationModal: NotificationUIType | null;
  modal: {
    flightInfo: boolean;
    signup: boolean;
    otp: boolean;
    login: boolean;
    profile: boolean;
  };
  appName: string;
  userDetails: UserDetailsType;
}

export const initialState: AppState = {
  isLoading: false,
  isLoggedIn: false,
  flightDetails: false,
  notifcationModal: () => {},
  modal: {
    flightInfo: false,
    signup: false,
    otp: false,
    login: false,
    profile: false,
  },
  appName: "BudgetAir",
  userDetails: {
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    phoneNo: "",
    roles: [],
    bankList: [],
    walletList: [],
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateAppName: (state, action: PayloadAction<string>) => {
      state.appName = action.payload;
    },
    uploadIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateFlightDetails: (state, action: PayloadAction<boolean>) => {
      state.flightDetails = action.payload;
    },
    updateIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    updateUserDetails: (state, action: PayloadAction<UserDetailsType>) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },
    toggleModal: (
      state,
      action: PayloadAction<{
        modal: "flightInfo" | "signup" | "otp" | "login" | "profile";
        status: boolean;
      }>
    ) => {
      state.modal[action.payload.modal] = action.payload.status;
    },
    updateNotifcationModal: (
      state,
      action: PayloadAction<NotificationUIType | null>
    ) => {
      state.notifcationModal = action.payload;
    },
  },
});

// Action creators are generated for each case present in reducers object
export const {
  updateAppName,
  uploadIsLoading,
  updateFlightDetails,
  updateUserDetails,
  toggleModal,
  updateNotifcationModal,
  updateIsLoggedIn,
} = appSlice.actions;

export default appSlice.reducer;
