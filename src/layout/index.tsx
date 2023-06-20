import React, { useEffect } from "react";
import { Descriptions, Layout, notification } from "antd";
import Sidebar from "./Sidebar";
import HeaderUI from "./HeaderUI";
import ContentUI from "./ContentUI";
import { Outlet } from "react-router";
import { Content } from "antd/es/layout/layout";
import Loader from "../components/Modals/Loader";
import FlightDetailsCard from "../components/Modals/FlightDetailsCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import SignupCard from "../components/Modals/SignupCard";
import VerifyTokenCard from "../components/Modals/VerifyTokenCard";
import LoginCard from "../components/Modals/LoginCard";
import {
  UserDetailsType,
  toggleModal,
  updateIsLoggedIn,
  updateNotifcationModal,
  updateUserDetails,
} from "../redux/slices/app";
import useLocalStorage from "../hooks/LocalStorage";
import ProfileCard from "../components/Modals/ProfileCard";
import { getProfileDetails } from "../services/auth";

export type NotificationType = "success" | "info" | "warning" | "error";

const { Footer } = Layout;

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#210340",
};

const getUserInfo = (dispatch:any, userId:any = 'false', authToken:any = 'false') => {

  if(userId === 'false'){
    dispatch(
      updateUserDetails({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        phoneNo: "",
        bankList:[],
        walletList:[],
      })
    );
    return;
  }

  getProfileDetails(userId, authToken).then((res: any) => {
    const walletList = res.walletDetails.map((wallet: any) => ({
      walletName: wallet.walletName.toLowerCase(),
      walletType: wallet.walletType,
    }));
    const bankList = res.bankDetails.map((bank: any) => ({
      bankCardName: bank.cardName,
      bankCardType: bank.cardType,
      bankIssuerName: bank.cardIssuer,
      bankName: bank.bankName,
    }));
    dispatch(
      updateUserDetails({
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        userName: res.username,
        phoneNo: res.mobileNo,
        bankList,
        walletList,
      })
    );
  });
}

const LayoutUI = () => {
  const dispatch = useAppDispatch();
  const { modal, notifcationModal } = useAppSelector((state) => state.app);

  const [userId, setUserId] = useLocalStorage("userId", "");
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", "");
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    api[type]({
      message: message || "",
      description: description || "",
    });
  };

  const onSignupFinishHandler = (success: boolean, userDetails: any) => {
    if (success) {
      dispatch(updateIsLoggedIn(true));
      setIsLoggedIn(true);
      setUserId(userDetails.username);
      setAuthToken(userDetails.token);
      dispatch(updateUserDetails(userDetails));
      dispatch(toggleModal({ modal: "signup", status: false }));
      dispatch(toggleModal({ modal: "otp", status: true }));
      getUserInfo(dispatch,userDetails.username,userDetails.token);
    } else {
      const errorMessage = userDetails.data.message || "";
      !notifcationModal &&
        dispatch(updateNotifcationModal(openNotificationWithIcon));
      openNotificationWithIcon("error", errorMessage);
      getUserInfo(dispatch);
    }
  };

  const onLoginFinishHandler = (success: boolean, userDetails: any) => {
    if (success) {
      dispatch(updateIsLoggedIn(true));
      setIsLoggedIn(true);
      setUserId(userDetails.username);
      setAuthToken(userDetails.token);
      dispatch(updateUserDetails(userDetails));
      dispatch(toggleModal({ modal: "login", status: false }));
      openNotificationWithIcon("success", "Logged in successfully");
      getUserInfo(dispatch,userDetails.username,userDetails.token);
    } else {
      dispatch(updateIsLoggedIn(false));
      setIsLoggedIn(false);
      setUserId("");
      setAuthToken("");
      const errorMessage = userDetails.data.message || "";
      !notifcationModal &&
        dispatch(updateNotifcationModal(openNotificationWithIcon));
      openNotificationWithIcon("error", errorMessage);
      getUserInfo(dispatch);
    }
  };

  useEffect(() => {
    dispatch(updateNotifcationModal(openNotificationWithIcon));
    if(isLoggedIn){
      getUserInfo(dispatch, userId, authToken);
    }
  }, []);

  return (
    <>
      {contextHolder}
      <Layout style={{ height: "100%" }}>
        <Sidebar />
        <Layout>
          <HeaderUI />
          <Content style={{ background: "#3B8BEB", overflow: "scroll" }}>
            {modal.flightInfo && <FlightDetailsCard />}

            {modal.signup && (
              <SignupCard onFinishHandler={onSignupFinishHandler} />
            )}
            {modal.otp && <VerifyTokenCard />}
            {modal.login && (
              <LoginCard onFinishHandler={onLoginFinishHandler} />
            )}
            {modal.profile && (
              <ProfileCard onFinishHandler={onLoginFinishHandler} />
            )}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <Footer style={footerStyle}>Footer</Footer>
      <Loader />
    </>
  );
};

export default LayoutUI;
