import React, { useEffect } from "react"
import { Button, Divider, Layout, Dropdown, Space, Avatar, Grid } from "antd"
import type { MenuProps } from "antd"
import { MenuFoldOutlined, DownOutlined } from "@ant-design/icons"
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
import { notification } from "../components/Notification/customNotification"
import "./layoutStyles.css"

const { useBreakpoint } = Grid

const HeaderUI = () => {
  const dispatch = useAppDispatch()
  const screens = useBreakpoint()
  const {
    isLoggedIn: isLoggedInState,
  } = useAppSelector((state) => state.app)

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
        notification.success({ message: "LoggedOut successfully" })
      })
      .catch((err) => {
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
          
        }
        notification.error({ message: "unexpected Error while logging out!!!" })
      })
  }

  const items: MenuProps["items"] = [
    {
      label: "Login",
      key: "0",
      onClick: () => openModal("login")
    },
    {
      label: "Signup",
      key: "1",
      onClick: () => openModal("signup")
    }
  ]

  const item2: MenuProps["items"] = [
    {
      label: "Profile",
      key: "2",
      onClick: () => openModal("profile")
    },
    {
      label: "Logout",
      key: "3",
      onClick: () => logoutUserHandler()
    }
  ]

  useEffect(() => {}, [isLoggedIn])

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
          {/* <img src={logoImage} style={{ height: "52px", marginLeft: "1rem" }} /> */}
        </div>
        <div className="buttonContainer">
          {screens.xs ? (
            <Dropdown
              menu={!isLoggedInState ? { items } : { items: item2 }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar />
                  <DownOutlined style={{marginLeft:"-5px",color:"#013042"}}/>
                </Space>
              </a>
            </Dropdown>
          ) : !isLoggedInState ? (
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
          {screens.xs && <Divider
            type="vertical"
            style={{ height: "32px", background: "#f1f3f6" }}
          />}
          <div className="menuButton" onClick={() => dispatch(toggleSidebar())}>
            <MenuFoldOutlined style={{ fontSize: 25, color: "#013042" }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderUI
