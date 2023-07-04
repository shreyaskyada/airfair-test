import React, { useEffect } from "react"
import { useLocation,useNavigate } from "react-router-dom"
import {
  Descriptions,
  Layout,
  Row,
  Col,
  notification,
  Typography,
  Divider
} from "antd"
import Sidebar from "./Sidebar"
import HeaderUI from "./HeaderUI"
import ContentUI from "./ContentUI"
import { Outlet } from "react-router"
import { Content } from "antd/es/layout/layout"
import Loader from "../components/Modals/Loader"
import FlightDetailsCard from "../components/Modals/FlightDetailsCard"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import SignupCard from "../components/Modals/SignupCard"
import VerifyTokenCard from "../components/Modals/VerifyTokenCard"
import LoginCard from "../components/Modals/LoginCard"
import {
  UserDetailsType,
  toggleModal,
  updateIsLoggedIn,
  updateNotifcationModal,
  updateUserDetails
} from "../redux/slices/app"
import useLocalStorage from "../hooks/LocalStorage"
import ProfileCard from "../components/Modals/ProfileCard"
import { getProfileDetails } from "../services/auth"
import { popularFlightsData } from "../data/popularFlights"
import { getFlightsConfig } from "../services/api/urlConstants"
import backendService from "../services/api"
import moment from "moment"
import { uploadIsLoading } from "../redux/slices/app"
import { updateFlights,updateDepartFlights,updateReturnFlights } from "../redux/slices/flights"
import { updateOriginFlights } from "../redux/slices/originFlight"
import { updateDestinationFlights } from "../redux/slices/destinationFlight"
import { AIRPORT_DATA } from "../data/popularFlights"


export type NotificationType = "success" | "info" | "warning" | "error"
const { Title, Text } = Typography
const { Footer } = Layout

const footerStyle: React.CSSProperties = {
  //textAlign: "center",
  color: "#fff",
  backgroundColor: "#210340"
}

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

  const { modal, notifcationModal } = useAppSelector((state) => state.app)

  const [userId, setUserId] = useLocalStorage("userId", "")
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", "")
  const [authToken, setAuthToken] = useLocalStorage("authToken", "")

  const [api, contextHolder] = notification.useNotification()

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
      setIsLoggedIn(true)
      setUserId(userDetails.userName)
      setAuthToken(userDetails.token)
      dispatch(updateUserDetails(userDetails))
      dispatch(toggleModal({ modal: "signup", status: false }))
      dispatch(toggleModal({ modal: "otp", status: true }))
      getUserInfo(dispatch, userDetails.userName, userDetails.token)
    } else {
      const errorMessage = userDetails.data.message || ""
      !notifcationModal &&
        dispatch(updateNotifcationModal(openNotificationWithIcon))
      openNotificationWithIcon("error", errorMessage)
      getUserInfo(dispatch)
    }
  }

  const onLoginFinishHandler = (success: boolean, userDetails: any) => {
    if (success) {
      dispatch(updateIsLoggedIn(true))
      setIsLoggedIn(true)
      setUserId(userDetails.username)
      setAuthToken(userDetails.token)
      dispatch(updateUserDetails(userDetails))
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

  const navigate = useNavigate()

  const { userDetails } = useAppSelector((state) => state.app)

  const getflightDetail = (departureFlightCode:string,destination: string) => {
    dispatch(uploadIsLoading(true))

    const destinationAirport = AIRPORT_DATA.find(
      (airport) => airport.code.toLowerCase() === destination.toLowerCase()
    )

    const flightDetail: any = {
      from: departureFlightCode,
      to: destinationAirport?.code,
      doj: moment().add(1, "days").format("DDMMYYYY"),
      seatingClass: "ECONOMY",
      adults: 1,
      children: 0,
      infants: 0,
      roundtrip: false,
      bankList: userDetails.bankList,
      walletList: userDetails.walletList
    }

    const flightList = getFlightsConfig(flightDetail)
    backendService
      .request(flightList)
      .then((res: any) => {
        dispatch(updateFlights(res))
        dispatch(updateOriginFlights(res.flightCompareResponse))
        dispatch(updateDestinationFlights(res.returnJourneyCompareResponse))
        dispatch(updateDepartFlights(res.flightCompareResponse[0]))
        dispatch(updateReturnFlights({}))

        dispatch(uploadIsLoading(false))
        navigate("/flights-listing")
      })
      .catch((error) => {
        dispatch(uploadIsLoading(false))
        console.error(error)
      })
  }

  return (
    <>
      {contextHolder}
      <Layout style={{ height: "100%" }}>
        <Sidebar />
        <Layout>
          <HeaderUI />
          <Content style={{ background: "#3B8BEB", overflow: "scroll" }}>
            {modal.flightInfo &&
              location &&
              location.pathname === "/flights-listing" && <FlightDetailsCard />}

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
      <Footer style={footerStyle}>
        <Title level={3} style={{ color: "white" }}>
          Top Flights
        </Title>
        <Divider style={{ background: "gray" }} />
        <Row gutter={[0, 6]}>
          {popularFlightsData.map((flights) =>
            flights.destinationFlights.map((flight) => (
              <Col xs={6} onClick={()=>getflightDetail(flights.departureFlightCode,flight.fligthCode)}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "left",
                    fontSize: ".92rem",
                    cursor:"pointer"
                  }}
                >
                  {flights.departureFlightTitle} To {flight.flightTitle}
                </Text>
              </Col>
            ))
          )}
        </Row>
      </Footer>
      <Loader />
    </>
  )
}

export default LayoutUI
