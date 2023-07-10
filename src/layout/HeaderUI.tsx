import React, { useEffect } from "react"
import { Button, Layout } from "antd"
import {MenuFoldOutlined } from "@ant-design/icons"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import {
  toggleModal,
  toggleSidebar,
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
  const { notifcationModal, isLoggedIn: isLoggedInState,showSidebar } = useAppSelector(
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
        height: "80px",
        display: "flex",
        alignItems: "center",
        padding: "0 2rem 0 0",
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
            alignItems: "center",
            height: "100%"
          }}
        >
          <img
            src={logoImage}
            style={{ height: "52px",marginLeft:"1rem"}}
          />
        </div>
        <div className="buttonContainer">
          {!isLoggedInState ? (
            <>
              <button
                onClick={() => openModal("login")}
                className="headerButtons outlined"
              >
                Login
              </button>
              <button
                onClick={() => openModal("signup")}
                className="headerButtons filled"
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openModal("profile")}
                className="headerButtons outlined"
              >
                Profile
              </button>
              <button
                className="headerButtons filled"
                onClick={() => logoutUserHandler()}
              >
                Logout
              </button>
            </>
          )}
          <div className="menuButton" onClick={()=>dispatch(toggleSidebar())}>

          <MenuFoldOutlined />
          </div>

        </div>
      </div>
    </div>
  )
}

export default HeaderUI
