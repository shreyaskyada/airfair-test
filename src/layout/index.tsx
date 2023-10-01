import React, { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { Layout, notification,Grid } from "antd"
import Sidebar from "./Sidebar"
import HeaderUI from "./HeaderUI"
import { Outlet } from "react-router"
import { Content } from "antd/es/layout/layout"
import Loader from "../components/Modals/Loader"
import FlightDetailsCard from "../components/Modals/FlightDetailsCard"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import SignupCard from "../components/Modals/SignupCard"
import VerifyTokenCard from "../components/Modals/VerifyTokenCard"
import LoginCard from "../components/Modals/LoginCard"
import {
  toggleModal,
  toggleSidebar,
  updateIsLoggedIn,
  updateNotifcationModal,
  updateUserDetails
} from "../redux/slices/app"
import useLocalStorage from "../hooks/LocalStorage"
import ProfileCard from "../components/Modals/ProfileCard"
import { getProfileDetails } from "../services/auth"
import Footer from "./Footer"

export type NotificationType = "success" | "info" | "warning" | "error"

const getUserInfo = (
  dispatch: any,
  userId: any = "false",
  authToken: any = "false"
) => {
  if (userId === "false") {
    dispatch(
      updateUserDetails({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        phoneNo: "",
        bankList: [],
        walletList: []
      })
    )
    return
  }

  getProfileDetails(userId, authToken)
    .then((res: any) => {
      const walletList = res.walletDetails.map((wallet: any) => ({
        walletName: wallet.walletName.toLowerCase(),
        walletType: wallet.walletType
      }))
      const bankList = res.bankDetails.map((bank: any) => ({
        bankCardName: bank.cardName,
        bankCardType: bank.cardType,
        bankIssuerName: bank.cardIssuer,
        bankName: bank.bankName
      }))
      dispatch(
        updateUserDetails({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          userName: res.username,
          phoneNo: res.mobileNo,
          bankList,
          walletList
        })
      )
    })
    .catch((error) => {
      dispatch(updateIsLoggedIn(false))
    })
}

const LayoutUI = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()

  const { modal, notifcationModal, showSidebar } = useAppSelector((state) => state.app)

  const [userId, setUserId] = useLocalStorage("userId", "")
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", "")
  const [authToken, setAuthToken] = useLocalStorage("authToken", "")

  const [api, contextHolder] = notification.useNotification()
  const ref = useRef<any>()

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    api[type]({
      message: message || "",
      description: description || ""
    })
  }

  const onSignupFinishHandler = (success: boolean, userDetails: any) => {
    if (success) {
      console.log("User Detail 2 :", userDetails)
      dispatch(updateIsLoggedIn(true))
      //setIsLoggedIn(true)
      setUserId(userDetails.userName)
      setAuthToken(userDetails.token)
      const {token,...filteredUser} = userDetails
      dispatch(updateUserDetails(filteredUser))
      dispatch(toggleModal({ modal: "signup", status: false }))
      dispatch(toggleModal({ modal: "login", status: false }))
      getUserInfo(dispatch, userDetails.userName, userDetails.token)
      dispatch(toggleModal({ modal: "otp", status: true }))
    } else {
      getUserInfo(dispatch)
    }
  }

  const onLoginFinishHandler = (success: boolean, userDetails: any) => {
    if (success) {
      dispatch(updateIsLoggedIn(true))
      setIsLoggedIn(true)
      setUserId(userDetails.username)
      setAuthToken(userDetails.token)
      const {token,...filteredUser} = userDetails
      dispatch(updateUserDetails(filteredUser))
      dispatch(toggleModal({ modal: "login", status: false }))
      openNotificationWithIcon("success", "Logged in successfully")
      getUserInfo(dispatch, userDetails.username, userDetails.token)
    } else {
      dispatch(updateIsLoggedIn(false))
      setIsLoggedIn(false)
      setUserId("")
      setAuthToken("")
      const errorMessage = userDetails.data.message || ""
      !notifcationModal &&
        dispatch(updateNotifcationModal(openNotificationWithIcon))
      openNotificationWithIcon("error", errorMessage)
      getUserInfo(dispatch)
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
  }

  useEffect(() => {
    dispatch(updateNotifcationModal(openNotificationWithIcon))
    if (isLoggedIn) {
      getUserInfo(dispatch, userId, authToken)
    }
  }, [])

  return (
    <>
      <Layout>
        <Sidebar />
        <HeaderUI />
        <div
          className="siteLayout"
          onClick={() => showSidebar && dispatch(toggleSidebar())}
        >
          <div
            className="contentLayout"
            style={{
              overflow: "initial",
            }}
          >
            <div style={{minHeight:"100vh",
              position:"relative"
            }}>

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
            </div>
          </div>
          <Footer />
        </div>
      </Layout>
      <Loader />
    </>
  )
}

export default LayoutUI
