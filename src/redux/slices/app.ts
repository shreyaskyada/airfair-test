import { getProfileDetails } from "../../services/auth";
import { createSlice, PayloadAction,createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { NotificationType } from "./../../layout/index";

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

// const getUserProfile = createAsyncThunk(
//   "app/userDetail",
//   async ({ userId, token }: any, thunkApi) => {
//     try {
//       const res = await getProfileDetails(userId, token)
      
//       return (res as AxiosResponse<any, any>).data
//     } catch (error: any) {
//         throw error.response.data

//     }
//   }
// )


const appSlice = createSlice({
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
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getUserProfile.pending.type, (state, action) => {
        
  //     })
  //     .addCase(
  //       getUserProfile.fulfilled.type,
  //       (state, action: PayloadAction<any>) => {
  //         const res=action.payload
  //         const walletList = res.walletDetails.map((wallet: any) => ({
  //           walletName: wallet.walletName.toLowerCase(),
  //           walletType: wallet.walletType
  //         }))
  //         const bankList = res.bankDetails.map((bank: any) => ({
  //           bankCardName: bank.cardName,
  //           bankCardType: bank.cardType,
  //           bankIssuerName: bank.cardIssuer,
  //           bankName: bank.bankName
  //         }))

  //         const userDetail = {
  //           firstName: res.firstName,
  //           lastName: res.lastName,
  //           email: res.email,
  //           userName: res.username,
  //           phoneNo: res.mobileNo,
  //           bankList,
  //           walletList
  //         }

  //         console.log("User Detail : ",userDetail)
  //         state.userDetails = userDetail
  //       }
  //     )
  //     .addCase(getUserProfile.rejected.type, (state, action) => {
        
  //     })
  //   }
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
