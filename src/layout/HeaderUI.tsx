import React, { useEffect } from "react"
import { Button, Layout } from "antd"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import {
  toggleModal,
  updateIsLoggedIn,
  updateUserDetails
} from "../redux/slices/app"
import useLocalStorage from "../hooks/LocalStorage"
import { logoutUser } from "../services/auth"
import { logoImage } from "../assets/images"
import "./layoutStyles.css"

const { Header } = Layout

const HeaderUI = () => {
  const dispatch = useAppDispatch()
  const { notifcationModal, isLoggedIn: isLoggedInState } = useAppSelector(
    (state) => state.app
  )

  const openModal = (type: "signup" | "login" | "profile") => {
    dispatch(toggleModal({ modal: type, status: true }))
  }

  const [authToken, setAuthToken] = useLocalStorage("authToken", "")
  const [userId, setUserId] = useLocalStorage("userId", "")
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", "")

  const logoutUserHandler = () => {
    logoutUser()
      .then((res) => {
        setIsLoggedIn(false)
        setUserId("")
        setAuthToken("")
        dispatch(updateIsLoggedIn(false))
        dispatch(
          updateUserDetails({
            firstName: "",
            lastName: "",
            email: "",
            userName: "",
            phoneNo: "",
            bankList: [],
            walletList: [],
            roles: []
          })
        )
        notifcationModal &&
          notifcationModal("success", "Logged out successfully!")
      })
      .catch((err) => {
        console.log(err)
        // 400 response is used for Invalid request that means token is no longer valid
        if (err?.response?.status === 400) {
          setIsLoggedIn(false)
          setUserId("")
          setAuthToken("")
          dispatch(updateIsLoggedIn(false))
          dispatch(
            updateUserDetails({
              firstName: "",
              lastName: "",
              email: "",
              userName: "",
              phoneNo: "",
              bankList: [],
              walletList: [],
              roles: []
            })
          )
          notifcationModal &&
            notifcationModal("success", "Logged out successfully!")
          // console.log(err);
          // notifcationModal &&
          //   notifcationModal("error", `Logout failed (${err.message})`);
        }
      })
  }

  return (
    <div
      style={{
        background: "#fff",
        position: "fixed",
        top: 0,
        zIndex: 1000,
        height: "70px",
        display: "flex",
        alignItems: "center",
        padding: "0 2rem",
        width: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img src={logoImage} style={{ height: "40px" }} />
        </div>
        <div>
          {!isLoggedInState ? (
            <>
              <Button
                style={{ marginRight: "5px" }}
                onClick={() => openModal("login")}
                className="headerButtons"
              >
                Login
              </Button>
              <Button
                onClick={() => openModal("signup")}
                className="headerButtons"
              >
                Signup
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => openModal("profile")}
                className="headerButtons"
                style={{ marginRight: "5px" }}
              >
                Profile
              </Button>
              <Button
                type="primary"
                className="headerButtons"
                onClick={() => logoutUserHandler()}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeaderUI
