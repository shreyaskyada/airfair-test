import backendService from "../api"
import {
  getAirports,
  getBankDetailsConfig,
  getBankNameConfig,
  getFlightsConfig,
  getBestOfferConfig
} from "../api/urlConstants"

export const airlineMapping: { [key: string]: string } = {
  AI: "Air India",
  IX: "Air India Express",
  I5: "AIX Connect",
  QP: "Akasa Air",
  G8: "Go First",
  "6E": "Indigo",
  SG: "Spicejey",
  UK: "Vistara"
}

export const getAirportsWrapper = (query: string) => {
  const config = getAirports(query)
  return backendService
    .request(config)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.error(err))
}

export const searchFlights = (data: {
  from: string
  to: string
  doj: string
  roundtrip: boolean
  adults: number
  infants: number
  children: number
  seatingClass: string
  typeOfJourney: string
  offerDetails: Array<object>
  doa?: string
  bankList: any
  walletList: any
}) => {
  const config = getFlightsConfig(data)
  return backendService
    .request(config)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.error(err))
}

export const getBankDetails = (status: string) => {
  const config = getBankDetailsConfig(status)
  return backendService
    .request(config)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.error(err))
}

export const getBankName = (bankName: string, bankType: string) => {
  const config = getBankNameConfig(bankName, bankType)
  return backendService
    .request(config)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.error(err))
}

export const getBestOffer = (data: object, token: string) => {
  const config = getBestOfferConfig(data, token)
  return backendService
    .request(config)
    .then((res) => {
      return res
    })
    .catch((err) => console.error(err))
}
