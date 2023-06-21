import React, { useEffect } from "react";
import { Button, Layout } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  toggleModal,
  updateIsLoggedIn,
  updateUserDetails,
} from "../redux/slices/app";
import useLocalStorage from "../hooks/LocalStorage";
import { logoutUser } from "../services/auth";
import { logoImage } from "../assets/images";

const { Header } = Layout;

const HeaderUI = () => {
  const dispatch = useAppDispatch();
  const { notifcationModal, isLoggedIn: isLoggedInState } = useAppSelector(
    (state) => state.app
  );

  const openModal = (type: "signup" | "login" | "profile") => {
    dispatch(toggleModal({ modal: type, status: true }));
  };

  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const [userId, setUserId] = useLocalStorage("userId", "");
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", "");

  const logoutUserHandler = () => {
    console.log("tokens", userId, authToken);
    logoutUser()
      .then((res) => {
        setIsLoggedIn(false);
        setUserId("");
        setAuthToken("");
        dispatch(updateIsLoggedIn(false));
        dispatch(
          updateUserDetails({
            firstName: "",
            lastName: "",
            email: "",
            userName: "",
            phoneNo: "",
            bankList: [],
            walletList: [],
            roles: [],
          })
        );
        notifcationModal &&
          notifcationModal("success", "Logged out successfully!");
      })
      .catch((err) => {
        console.log(err);
        // 400 response is used for Invalid request that means token is no longer valid
        if (err?.response?.status === 400) {
          setIsLoggedIn(false);
          setUserId("");
          setAuthToken("");
          dispatch(updateIsLoggedIn(false));
          dispatch(
            updateUserDetails({
              firstName: "",
              lastName: "",
              email: "",
              userName: "",
              phoneNo: "",
              bankList: [],
              walletList: [],
              roles: [],
            })
          );
          notifcationModal &&
            notifcationModal("success", "Logged out successfully!");
          // console.log(err);
          // notifcationModal &&
          //   notifcationModal("error", `Logout failed (${err.message})`);
        }
      });
  };

  return (
    <Header style={{ background: "#fff", borderBottom: "1px solid #000" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* <div
          style={{
            float: "left",
            width: 120,
            height: 31,
            margin: "16px 24px 16px 0",
            background: "#000",
          }}
        /> */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={logoImage} style={{ height: "20px" }} />
        </div>
        <div>
          {!isLoggedInState ? (
            <>
              <Button
                style={{ marginRight: "5px" }}
                type="primary"
                onClick={() => openModal("login")}
              >
                Login
              </Button>
              <Button onClick={() => openModal("signup")}>Signup</Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => openModal("profile")}
                type="primary"
                style={{ marginRight: "5px" }}
              >
                Profile
              </Button>
              <Button type="primary" onClick={() => logoutUserHandler()}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderUI;
