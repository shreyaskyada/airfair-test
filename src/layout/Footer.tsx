import React from "react"
import { useNavigate } from "react-router-dom"
import { Layout, Row, Col, Typography, Divider } from "antd"
import { InstagramOutlined, LinkedinOutlined } from "@ant-design/icons"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import moment from "moment"
import dayjs from "dayjs"
import { popularFlightsData } from "../data/popularFlights"
import { getFlightsConfig } from "../services/api/urlConstants"
import backendService from "../services/api"
import { uploadIsLoading } from "../redux/slices/app"
import {
  updateFlights,
  updateReturnFlights,
  updateDepartFlights
} from "../redux/slices/flights"
import { updateOriginFlights } from "../redux/slices/originFlight"
import { updateDestinationFlights } from "../redux/slices/destinationFlight"
import { AIRPORT_DATA } from "../data/popularFlights"
import "./layoutStyles.css"
import { updateInitialValues } from "../redux/slices/searchFlights"

const { Title, Text } = Typography
const { Footer: FooterLayout } = Layout


const Footer = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { userDetails } = useAppSelector((state) => state.app)

  const getflightDetail = (
    departureFlightCode: string,
    destination: string
  ) => {
    dispatch(uploadIsLoading(true))

    const destinationAirport = AIRPORT_DATA.find(
      (airport) => airport.code.toLowerCase() === destination.toLowerCase()
    )
    const departureAirport = AIRPORT_DATA.find(
      (airport) =>
        airport.code.toLowerCase().toLowerCase() ===
        departureFlightCode.toLowerCase()
    )

    const searchedData = {
      from: {
        code: departureAirport?.code,
        city: departureAirport?.city,
        name: departureAirport?.name
      },
      to: {
        code: destinationAirport?.code,
        city: destinationAirport?.city,
        name: destinationAirport?.name
      },
      type: "one-way",
      departure: dayjs().add(1, "days"),
      return: dayjs(),
      adult: 1,
      child: 0,
      infant: 0,
      class: "ECONOMY"
    }

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
        dispatch(updateInitialValues(searchedData))
        dispatch(uploadIsLoading(false))
        navigate("/flights-listing")
      })
      .catch((error) => {
        dispatch(uploadIsLoading(false))
        console.error(error)
      })
  }
  return (
    <FooterLayout className="footerSection">
      <Title level={3} style={{ color: "white" }}>
        Top Flights
      </Title>
      <Divider style={{ background: "gray" }} />
      <Row gutter={[0, 6]}>
        {popularFlightsData.map((flights) =>
          flights.destinationFlights.map((flight) => (
            <Col
              xs={6}
              onClick={() =>
                getflightDetail(flights.departureFlightCode, flight.fligthCode)
              }
            >
              <Text className="flightLinks">
                {flights.departureFlightTitle} To {flight.flightTitle}
              </Text>
            </Col>
          ))
        )}
      </Row>
      <Divider style={{ background: "gray" }} />
      <div className="socialLinksSection">
        <div className="socialLinkContainer">
          <a href="https://www.instagram.com/mytripsaver/" className="linkUrl" target="_blank">
            <InstagramOutlined style={{ fontSize: 25, color: "white" }} />
            <span className="linkText">Follow us on Istagram</span>
          </a>
        </div>
        <div className="socialLinkContainer">
          <a
            href="https://www.linkedin.com/company/mytripsaver/"
            className="linkUrl"
            target="_blank"
          >
            <LinkedinOutlined style={{ fontSize: 25, color: "white" }} />
            <span className="linkText">Follow us on Istagram</span>
          </a>
        </div>
      </div>
    </FooterLayout>
  )
}

export default Footer
