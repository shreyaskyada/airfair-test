import { Avatar, Typography, Skeleton, Divider, Tooltip, Tag } from "antd"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useState, useEffect, Fragment } from "react"
import { FlightState } from "../redux/slices/flights"
import { ISearchFlights } from "../redux/slices/searchFlights"
import Loadash from "lodash"
import moment from "moment"
import dayjs from "dayjs"
import { airlineMapping } from "../services/airports"
import { getBestOffer } from "../services/airports"
import { uploadIsLoading } from "../redux/slices/app"
import { Airlines_Images } from "../data/popularAirlines"
import { Link } from "react-router-dom"
import { airplaneIcon } from "../assets/images"

const FlightDetailPage = () => {
  const dispatch = useAppDispatch()

  const [providerWithOffers, setProviderWithOffers] = useState<any>([])

  const { userDetails } = useAppSelector((state) => state.app)

  const { departFlight, returnFlight } = useAppSelector(
    (state: { flight: FlightState }) => state.flight
  )

  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  )

  const getDiscount = async (provider: []) => {
    console.log("🚀 ~ file: FlightDetailPage.tsx:32 ~ getDiscount ~ provider:", provider)
    try {
      if (!provider.length || !searchFlightData) {
        throw new Error("invalid inputs")
      }

      setProviderWithOffers([])

      const walletList = userDetails.walletList.map(
        (wallet: any) => wallet.walletName
      )

      const bankList = userDetails.bankList.map((bank: any) => ({
        bankName: bank.bankName,
        bankCards: [bank.bankCardType + "-" + bank.bankCardName]
      }))

      const departAirlinesCode =
        departFlight &&
        departFlight.flightCode?.split("->").map((item) => item.substring(0, 2))

      const departAirlineNames =
        departAirlinesCode?.map((code) => airlineMapping[code]) || []

      const airlineNames = Loadash.uniq([...departAirlineNames])

      const doj = moment(searchFlightData.dateOfDep).valueOf()
      const dob = moment(dayjs().toString()).valueOf()

      const payloads: any = provider.map((_provider: any) => ({
        provider: _provider.provider,
        airlines: airlineNames.length ? airlineNames : ["ALL"],
        flightType: "DOMESTIC",
        journeyType: searchFlightData.flightType,
        dateOfJourney: doj / 1000,
        dateOfBooking: dob / 1000,
        bankList: bankList,
        walletList,
        noOfTravellers: searchFlightData.totalTravellers,
        fare: {
          baseFare: _provider.baseFare,
          tax: _provider.tax,
          totalFare: _provider.totalFare
        }
      }))

      let payloadResponse: any = []
      for (const payload of payloads) {
        try {
          const res: any = await getBestOffer(payload)

          if (res) {
            payloadResponse.push(res.bestOffer)
          } else {
            payloadResponse.push({})
          }
        } catch (error) {
          console.log(error)
        }
      }

      let _providersWithOffer = provider.map(
        (_provider: any, index: number) => {
          return {
            ..._provider,
            bestOffer: payloadResponse[index]
          }
        }
      )

      //_providersWithOffer = [..._providersWithOffer]

      _providersWithOffer.length > 1 &&
        _providersWithOffer.sort((a, b) => {
          const aFare =
            a.bestOffer.fare.totalFareAfterDiscount > 0
              ? a.bestOffer.fare.totalFareAfterDiscount + a.convenienceFee
              : a.totalFare + a.convenienceFee
          const bFare =
            b.bestOffer.fare.totalFareAfterDiscount > 0
              ? b.bestOffer.fare.totalFareAfterDiscount + b.convenienceFee
              : b.totalFare + b.convenienceFee

          return aFare - bFare
        })

      dispatch(uploadIsLoading(false))
      setProviderWithOffers(_providersWithOffer)
    } catch (error) {
      console.log(error)
      dispatch(uploadIsLoading(false))
      return []
    }
  }

  useEffect(() => {
    const makeProvideres = async () => {
      let providers: any = []

      if (
        !Loadash.isEmpty(departFlight) &&
        !Loadash.isEmpty(returnFlight)
      ) {
        const keys = Object.keys(departFlight.compare || {})
        keys &&
          keys.forEach((key: any) => {
            let totalDepartFare =
              departFlight.compare && departFlight.compare[key]
                ? departFlight.compare[key].fare?.totalFareAfterDiscount
                : 0
            let totalreturnFare =
              returnFlight.compare && returnFlight.compare[key]
                ? returnFlight.compare[key].fare?.totalFareAfterDiscount
                : 0
            let url =
              departFlight.compare && departFlight.compare[key].redirecUrl
            const totalFare =
              totalDepartFare && totalreturnFare
                ? totalreturnFare + totalDepartFare
                : 0
            let totalDepartTax =
              departFlight.compare && departFlight.compare[key]
                ? departFlight.compare[key].fare?.totalTax ||
                  departFlight.compare[key].fare?.tax
                : 0
            let totalReturnTax =
              returnFlight.compare && returnFlight.compare[key]
                ? returnFlight.compare[key].fare?.totalTax ||
                  returnFlight.compare[key].fare?.tax
                : 0

            let totalTax = (totalDepartTax || 0) + (totalReturnTax || 0)

            let baseFareDepart =
              departFlight.compare && departFlight.compare[key]
                ? departFlight.compare[key].fare?.totalBaseFare ||
                  departFlight.compare[key].fare?.baseFare
                : 0
            let baseFareReturn =
              returnFlight.compare && returnFlight.compare[key]
                ? returnFlight.compare[key].fare?.totalBaseFare ||
                  returnFlight.compare[key].fare?.baseFare
                : 0
            let baseFare = (baseFareDepart || 0) + (baseFareReturn || 0)

            let departConvfee =
              departFlight.compare && departFlight.compare[key]
                ? departFlight.compare[key].fare?.convenienceFee
                : 0

            let returnConvfee =
              returnFlight.compare && returnFlight.compare[key]
                ? returnFlight.compare[key].fare?.convenienceFee
                : 0

            let convfee = (departConvfee || 0) + (returnConvfee || 0)

            providers.push({
              provider: key,
              totalFare: totalFare,
              url: url,
              baseFare: baseFare,
              tax: totalTax,
              convenienceFee: convfee
            })
          })

        await getDiscount(providers)
      }else if (!Loadash.isEmpty(departFlight) && Loadash.isEmpty(returnFlight)) {
        const keys = Object.keys(departFlight.compare || {})
        keys &&
          keys.forEach((key: any) => {
            let totalDepartFare =
              departFlight.compare && departFlight.compare[key]
                ? departFlight.compare[key].fare?.totalFareAfterDiscount
                : 0

            let url =
              departFlight.compare && departFlight.compare[key].redirecUrl

            let totalTax =
              departFlight.compare && departFlight.compare[key]
                ? departFlight.compare[key].fare?.totalTax ||
                  departFlight.compare[key].fare?.tax
                : 0

            let baseFare =
              departFlight.compare && departFlight.compare[key]
                ? departFlight.compare[key].fare?.totalBaseFare ||
                  departFlight.compare[key].fare?.baseFare
                : 0

            let convfee =
              departFlight.compare && departFlight.compare[key]
                ? departFlight.compare[key].fare?.convenienceFee
                : 0

            providers.push({
              provider: key,
              totalFare: totalDepartFare,
              url: url,
              baseFare: baseFare,
              tax: totalTax,
              convenienceFee: convfee
            })
          })

        await getDiscount(providers)
      }
    }

    makeProvideres()
  }, [departFlight, returnFlight])

  const flighInfoTabCard = ({
    fromTime,
    fromDate,
    fromAddress,
    toTime,
    toDate,
    duration,
    toAddress,
    flightCode,
    airLine,
    city,
    stops,
    cabinBaggage,
    checkinBaggage,
    flipPlaneIcon = false
  }: any) => {
    return (
      <div className="flightDetailContent">
        <div className="flightNameContainer">
          {/* <Avatar
            size={45}
            src={Airlines_Images[airlineMapping[airLine?.slice(0, 2)]]}
          >
            K
          </Avatar> */}
          <div style={{ width: "30px", height: "30px" }}>
            <img
              src={Airlines_Images[airlineMapping[airLine?.slice(0, 2)]]}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <h1 className="flightName">{`${
            airlineMapping[airLine?.slice(0, 2) || "AI"]
          } ${airLine}`}</h1>
        </div>
        <div className="flightTimeDetail">
          <div className="flightTime">
            <h3>{fromTime}</h3>
          </div>

          <div className="cityDivider">
            <span className="circle circle1"></span>
            <img
              src={airplaneIcon}
              alt="aeroplane"
              width={25}
              height={25}
              className="dividerIcon"
              // style={{
              //   transform: flipPlaneIcon
              //     ? "translateX(50%) rotateY(180deg)"
              //     : "translateX(50%) rotateY(0deg)"
              // }}
            />
            <div className="divider"></div>
            <span className="circle circle2"></span>
          </div>

          <div className="flightTime">
            <h3>{toTime}</h3>
          </div>
        </div>
        <div className="flightCity" style={{ fontWeight: "bold" }}>
          <p>{city?.from}</p>
          <p>{duration}</p>
          <p>{city?.to}</p>
        </div>
        <div className="terminalContainer" style={{ fontWeight: "bold" }}>
          <p>
            {`${
              fromAddress
                ? fromAddress.includes("Terminal")
                  ? ""
                  : "Terminal "
                : "Terminal "
            } ${fromAddress || "--"}`}
          </p>
          <p>
            {`${
              toAddress
                ? toAddress.includes("Terminal")
                  ? ""
                  : "Terminal "
                : "Terminal "
            } ${toAddress || "--"}`}
          </p>
        </div>
        <div className="chipsSection">
          <div className="rowChip">
            <div className="chip">
              <p>Economy</p>
            </div>
            <div className="chip">
              <p>{fromDate}</p>
            </div>
          </div>

          <div className="rowChip">
            {cabinBaggage && (
              <div className="chip">
                <p>{cabinBaggage}</p>
              </div>
            )}

            {checkinBaggage && (
              <div className="chip">
                <p>{checkinBaggage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ margin: "1rem 1.5rem" }}>
      <div style={{ padding: "2rem 0" }}>
        <div className="headerCard">
          <div className="cardContent">
            <div className="flightStats">
              <Avatar.Group>
                <Avatar size={64}>{departFlight && departFlight.from}</Avatar>
                <Avatar size={64}>{departFlight && departFlight.to}</Avatar>
              </Avatar.Group>

              <h2 className="heading">
                {departFlight && `${departFlight.from} - ${departFlight.to}`}
              </h2>
              <p className="date">
                {departFlight &&
                  `${moment(departFlight.depDate).format("D MMM")}`}
              </p>
              <p className="passengers">
                {searchFlightData && searchFlightData.totalTravellers} Traveller
              </p>
            </div>
            <Divider />
            <div className="providersSection">
              {!!providerWithOffers.length ? (
                providerWithOffers.map((provideDetail: any, index: number) => (
                  <div className="providerDetail">
                    <div className="leftCol">
                      <div>
                      <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                        <p className="providerTitle">{provideDetail.provider}</p>
                        {index === 0 && providerWithOffers.length > 1 && (
                            <Tag color="#4E6F7B"> Cheapest</Tag>
                        )}
                    </div>
                      </div>
                      <p className="ticketPrice">
                        ₹{" "}
                        {provideDetail.bestOffer &&
                        provideDetail.bestOffer.fare &&
                        provideDetail.bestOffer.fare.totalFareAfterDiscount
                          ? provideDetail.bestOffer.fare.totalFareAfterDiscount
                          : provideDetail.bestOffer.fare &&
                            provideDetail.bestOffer.fare.totalFare}
                        <span style={{ color: "#4E6F7B",fontSize:"0.7rem"}}>{` + ${provideDetail.convenienceFee} conv fee`}</span>
                      </p>
                    </div>
                    <div className="rightCol">
                      <Tooltip
                        color="white"
                        title={
                          provideDetail.bestOffer ? (
                            <>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Base Fare:{" "}
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {provideDetail.baseFare}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Total Tax:{" "}
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {provideDetail.tax}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Total Fare:{" "}
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {provideDetail &&
                                    provideDetail.bestOffer &&
                                    provideDetail.bestOffer.fare &&
                                    provideDetail.bestOffer.fare.totalFare}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Total Discount:{" "}
                                </span>{" "}
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {provideDetail &&
                                    provideDetail.bestOffer &&
                                    provideDetail.bestOffer.fare &&
                                    provideDetail.bestOffer.fare.totalDiscount}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Promo Code:{" "}
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {provideDetail.bestOffer &&
                                  provideDetail.bestOffer.promoCode
                                    ? provideDetail.bestOffer.promoCode
                                    : "No offer applicable"}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Total Fare After Discount:{" "}
                                </span>
                                <b>
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      color: "#013042"
                                    }}
                                  >
                                    {provideDetail.bestOffer &&
                                    provideDetail.bestOffer.fare &&
                                    provideDetail.bestOffer.fare
                                      .totalFareAfterDiscount
                                      ? provideDetail.bestOffer.fare
                                          .totalFareAfterDiscount
                                      : provideDetail.bestOffer.fare &&
                                        provideDetail.bestOffer.fare.totalFare}
                                  </span>
                                </b>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Conv Fee :{" "}
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {provideDetail.convenienceFee}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Final Fare:{" "}
                                </span>
                                <b>
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      color: "#013042"
                                    }}
                                  >
                                    {provideDetail.bestOffer &&
                                    provideDetail.bestOffer.fare &&
                                    provideDetail.bestOffer.fare
                                      .totalFareAfterDiscount
                                      ? provideDetail.bestOffer.fare
                                          .totalFareAfterDiscount +
                                        provideDetail.convenienceFee
                                      : provideDetail.bestOffer.fare &&
                                        provideDetail.bestOffer.fare.totalFare +
                                          provideDetail.convenienceFee}
                                  </span>
                                </b>
                              </div>
                            </>
                          ) : (
                            <div
                              style={{ fontWeight: "bold", color: "#013042" }}
                            >
                              Unlock Exclusive Deals by Logging In
                            </div>
                          )
                        }
                        placement="top"
                      >
                        <p className="tooltipContent">i</p>
                      </Tooltip>
                      <button
                        className="headerButtons filled"
                        style={{ width: "100px" }}
                      >
                        <Link to={provideDetail.url} target="_blank">
                          View Detail
                        </Link>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <Skeleton.Input
                  active={true}
                  size="large"
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="headerCard" style={{ margin: "2rem 0" }}>
          <div className="flighCompleteDetail">
            {departFlight && departFlight.stops === 0
              ? flighInfoTabCard({
                  airLine: departFlight.flightCode,
                  fromTime: departFlight.depTime,
                  fromDate: departFlight.depDate,
                  fromAddress:
                    departFlight.departureTerminalList &&
                    departFlight.departureTerminalList[0],
                  toTime: departFlight.arrTime,
                  toDate: departFlight.arrDate,
                  duration: departFlight.duration,
                  toAddress:
                    departFlight.arrivalTerminalList &&
                    departFlight.arrivalTerminalList[0],
                  flightCode: departFlight.flightCode,
                  city: {
                    from: departFlight.fromCity,
                    to: departFlight.toCity
                  },
                  stop: departFlight.stops,
                  cabinBaggage:
                    departFlight.cabinBaggage && departFlight.cabinBaggage[0],
                  checkinBaggage:
                    departFlight.checkinBaggage &&
                    departFlight.checkinBaggage[0]
                })
              : departFlight &&
                departFlight.startTimeList?.map((ele, index) => (
                  <Fragment key={index}>
                    {flighInfoTabCard({
                      airLine: departFlight.flightCode?.split("->")[index],
                      fromTime: moment(
                        departFlight?.startTimeList
                          ? departFlight?.startTimeList[index]
                          : new Date()
                      ).format("HH:mm"),
                      fromDate: moment(
                        departFlight?.startTimeList
                          ? departFlight?.startTimeList[index]
                          : new Date()
                      ).format("DD/MM/YYYY"),
                      fromAddress:
                        departFlight.departureTerminalList &&
                        departFlight.departureTerminalList[index],
                      toTime: moment(
                        departFlight?.endTimeList
                          ? departFlight?.endTimeList[index]
                          : new Date()
                      ).format("HH:mm"),
                      toDate: moment(
                        departFlight?.endTimeList
                          ? departFlight?.endTimeList[index]
                          : new Date()
                      ).format("DD/MM/YYYY"),
                      duration:
                        departFlight.durationsList &&
                        departFlight.durationsList[index].substring(
                          2,
                          departFlight.durationsList[index].length
                        ),
                      toAddress:
                        departFlight.arrivalTerminalList &&
                        departFlight.arrivalTerminalList[index],
                      flightCode: departFlight.flightCode,
                      city: {
                        from:
                          index === 0
                            ? departFlight.fromCity
                            : departFlight?.transitFlight &&
                              departFlight?.transitFlight[index - 1]?.viaCity,
                        to:
                          index !==
                          (departFlight.startTimeList &&
                            departFlight.startTimeList.length - 1)
                            ? departFlight?.transitFlight &&
                              departFlight?.transitFlight[index]?.viaCity
                            : departFlight.toCity
                      },
                      stop: departFlight.stops,
                      cabinBaggage:
                        departFlight.cabinBaggage &&
                        departFlight.cabinBaggage[index],
                      checkinBaggage:
                        departFlight.checkinBaggage &&
                        departFlight.checkinBaggage[index]
                    })}
                    {departFlight.stops && index < departFlight.stops ? (
                      <div className="layovers">
                        <p>
                          {departFlight.layoverDurationList &&
                            departFlight.layoverDurationList[index].substring(
                              2,
                              departFlight.layoverDurationList[index].length
                            )}
                        </p>
                        <p> - Change of planes in</p>
                        <p>
                          {departFlight.via?.split("-")[index] ||
                            (departFlight?.transitFlight &&
                              departFlight?.transitFlight[index]?.viaCity)}
                        </p>
                      </div>
                    ) : null}
                  </Fragment>
                ))}

            {returnFlight && (
              <div className="mainDivider">
                <span className="circle circle1"></span>
                <div className="divider"></div>
                <span className="circle circle2"></span>
              </div>
            )}

            <div>
              {returnFlight && returnFlight.stops === 0
                ? flighInfoTabCard({
                    flipPlaneIcon: true,
                    airLine: returnFlight.flightCode,
                    fromTime: returnFlight.depTime,
                    fromDate: returnFlight.depDate,
                    fromAddress:
                      returnFlight.departureTerminalList &&
                      returnFlight.departureTerminalList[0],
                    toTime: returnFlight.arrTime,
                    toDate: returnFlight.arrDate,
                    duration: returnFlight.duration,
                    toAddress:
                      returnFlight.arrivalTerminalList &&
                      returnFlight.arrivalTerminalList[0],
                    flightCode: returnFlight.flightCode,
                    city: {
                      from: returnFlight.fromCity,
                      to: returnFlight.toCity
                    },
                    stop: returnFlight.stops,
                    cabinBaggage:
                      returnFlight.cabinBaggage && returnFlight.cabinBaggage[0],
                    checkinBaggage:
                      returnFlight.checkinBaggage &&
                      returnFlight.checkinBaggage[0]
                  })
                : returnFlight &&
                  returnFlight.startTimeList?.map((ele, index) => (
                    <Fragment key={index}>
                      {flighInfoTabCard({
                        flipPlaneIcon: true,
                        airLine: returnFlight.flightCode?.split("->")[index],
                        fromTime: moment(
                          returnFlight?.startTimeList
                            ? returnFlight?.startTimeList[index]
                            : new Date()
                        ).format("HH:mm"),
                        fromDate: moment(
                          returnFlight?.startTimeList
                            ? returnFlight?.startTimeList[index]
                            : new Date()
                        ).format("DD/MM/YYYY"),
                        fromAddress:
                          returnFlight.departureTerminalList &&
                          returnFlight.departureTerminalList[index],
                        toTime: moment(
                          returnFlight?.endTimeList
                            ? returnFlight?.endTimeList[index]
                            : new Date()
                        ).format("HH:mm"),
                        toDate: moment(
                          returnFlight?.endTimeList
                            ? returnFlight?.endTimeList[index]
                            : new Date()
                        ).format("DD/MM/YYYY"),
                        duration:
                          returnFlight.durationsList &&
                          returnFlight.durationsList[index].substring(
                            2,
                            returnFlight.durationsList[index].length
                          ),
                        toAddress:
                          returnFlight.arrivalTerminalList &&
                          returnFlight.arrivalTerminalList[index],
                        flightCode: returnFlight.flightCode,
                        city: {
                          from:
                            index === 0
                              ? returnFlight.fromCity
                              : returnFlight?.transitFlight &&
                                returnFlight?.transitFlight[index - 1]?.viaCity,
                          to:
                            index !==
                            (returnFlight.startTimeList &&
                              returnFlight.startTimeList.length - 1)
                              ? returnFlight?.transitFlight &&
                                returnFlight?.transitFlight[index]?.viaCity
                              : returnFlight.toCity
                        },
                        stop: returnFlight.stops,
                        cabinBaggage:
                          returnFlight.cabinBaggage &&
                          returnFlight.cabinBaggage[index],
                        checkinBaggage:
                          returnFlight.checkinBaggage &&
                          returnFlight.checkinBaggage[index]
                      })}
                      {returnFlight.stops && index < returnFlight.stops ? (
                        <div className="layovers">
                          <p>
                            {returnFlight.layoverDurationList &&
                              returnFlight.layoverDurationList[index].substring(
                                2,
                                returnFlight.layoverDurationList[index].length
                              )}
                          </p>
                          <p> - Change of planes in</p>
                          <p>
                            {returnFlight.via?.split("-")[index] ||
                              (returnFlight?.transitFlight &&
                                returnFlight?.transitFlight[index]?.viaCity)}
                          </p>
                        </div>
                      ) : null}
                    </Fragment>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightDetailPage