import React from "react"
import moment from "moment"
import dayjs from "dayjs"
import { useNavigate } from "react-router"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { uploadIsLoading } from "../../redux/slices/app"
import { getFlightsConfig } from "../../services/api/urlConstants"
import { updateOriginFlights } from "../../redux/slices/originFlight"
import { updateDestinationFlights } from "../../redux/slices/destinationFlight"
import {
  updateFlights,
  updateReturnFlights,
  updateDepartFlights
} from "../../redux/slices/flights"
import backendService from "../../services/api"
import { AIRPORT_DATA } from "../../data/popularFlights"
import { updateInitialValues } from "../../redux/slices/searchFlights"

interface DestinationFlight {
  flightTitle: string
  fligthCode: string
}

interface PopularFlightItemProps {
  departureFlightTitle: string
  departureFlightCode: string
  departureFlightImage: string
  destinationFlights: DestinationFlight[]
}

const PopularFlightItem: React.FC<PopularFlightItemProps> = ({
  departureFlightCode,
  departureFlightTitle,
  departureFlightImage,
  destinationFlights
}) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { userDetails } = useAppSelector((state) => state.app)

  const getflightDetail = (destination: string) => {
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
    <div className="singleFlightSection">
      <div className="imageContainer">
        <img className="image" src={departureFlightImage} />
      </div>
      <div>
        <div className="flightTitle">{departureFlightTitle}</div>
        <div className="destinationFlightsList">
          <span>To:</span>
          {destinationFlights?.map((flight, index) => (
            <span
              key={index}
              className="destinationFlightTitle"
              onClick={() => getflightDetail(flight.fligthCode)}
            >
              {destinationFlights.length !== index + 1
                ? flight.flightTitle + ", "
                : flight.flightTitle}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PopularFlightItem
