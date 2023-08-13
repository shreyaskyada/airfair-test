import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { InfoOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import {
  Button,
  Card,
  Form,
  Avatar,
  Tabs,
  Typography,
  Divider,
  Popover,
  Grid,
  Dropdown,
  MenuProps
} from "antd"
import * as _ from "lodash"
import dayjs from "dayjs"
import useLocalStorage from "../../hooks/LocalStorage"
import { Drawer } from "antd"
import type { TabsProps } from "antd"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  toggleModal,
  updateFlightDetails,
  uploadIsLoading
} from "../../redux/slices/app"
import { Flight, FlightState } from "../../redux/slices/flights"
import { airlineMapping } from "../../services/airports"
import { getBestOffer } from "../../services/airports"
import moment from "moment"
import { ISearchFlights } from "../../redux/slices/searchFlights"
import { Airlines_Images } from "../../data/popularAirlines"
import { useDimensions } from "../../hooks/useDimensions"

const { Text, Title } = Typography
const { Meta } = Card
const { useBreakpoint } = Grid

const P = [{
  "provider": "Easy",
  "totalFare": 4496,
  "url": "https://www.happyeasygo.com/flights/DEL-BOM/2023-08-13?tripType=&adults=1&childs=0&baby=0&cabinClass=E&airline=&carrier=",
  "baseFare": 3311,
  "tax": 1185,
  "bestOffer": {
      "offerType": "PROMOCODE_OFFER",
      "bankName": null,
      "cardName": null,
      "cardType": null,
      "walletName": null,
      "promoCode": null,
      "discountType": null,
      "primaryDiscountType": null,
      "fare": {
          "baseFare": 3311,
          "tax": 1185,
          "comission": 0,
          "cashbackDiscount": 0,
          "instantDiscount": 0,
          "totalDiscount": 0,
          "totalFare": 4496,
          "totalFareAfterDiscount": 0,
          "totalBaseFare": 0,
          "adultBaseFare": 0,
          "adultTax": 0,
          "totalTax": 0,
          "adultTotalFare": 0,
          "totalCommission": 0,
          "surcharge": 0,
          "otherCharges": 0
      },
      "comment": null,
      "fareReduced": false
  }
},
{
  "provider": "HAPPYE",
  "totalFare": 4496,
  "url": "https://www.happyeasygo.com/flights/DEL-BOM/2023-08-13?tripType=&adults=1&childs=0&baby=0&cabinClass=E&airline=&carrier=",
  "baseFare": 3311,
  "tax": 1185,
  "bestOffer": {
      "offerType": "PROMOCODE_OFFER",
      "bankName": null,
      "cardName": null,
      "cardType": null,
      "walletName": null,
      "promoCode": null,
      "discountType": null,
      "primaryDiscountType": null,
      "fare": {
          "baseFare": 3311,
          "tax": 1185,
          "comission": 0,
          "cashbackDiscount": 0,
          "instantDiscount": 0,
          "totalDiscount": 0,
          "totalFare": 4496,
          "totalFareAfterDiscount": 0,
          "totalBaseFare": 0,
          "adultBaseFare": 0,
          "adultTax": 0,
          "totalTax": 0,
          "adultTotalFare": 0,
          "totalCommission": 0,
          "surcharge": 0,
          "otherCharges": 0
      },
      "comment": null,
      "fareReduced": false
  }
}
]

const FlightDetailCard = ({ onFinishHandler }: any) => {
  const dispatch = useAppDispatch()
  const screen = useBreakpoint()

  const [providerWithOffers, setProviderWithOffers] = useState<any>([])
  const [providerWithOffers2, setProviderWithOffers2] = useState<any>([])

  const modalRef = useRef<HTMLDivElement>(null)
  const providerListRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)

  const [height, width] = useDimensions(modalRef)
  const [leftColHeight, leftColwidth] = useDimensions(leftColRef)
  const [rightColHeight, rightColwidth] = useDimensions(rightColRef)
  const [providerHeight, providerwidth] = useDimensions(providerListRef)

  const { flightDetails, userDetails } = useAppSelector((state) => state.app)

  const { departFlight, returnFlight } = useAppSelector(
    (state: { flight: FlightState }) => state.flight
  )
  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  )

  useEffect(() => {
    if (
      ((leftColwidth + rightColwidth > width &&
        leftColwidth !== rightColwidth) ||
        (leftColwidth === rightColwidth && providerwidth > width))
    ) {
      let items: any = [...providerWithOffers]
      let items2 = [...providerWithOffers2]
      
      let i = items.pop()
      items2.push(i)
      
      setProviderWithOffers(items)
      setProviderWithOffers2(items2)
      
    }
  }, [leftColwidth, rightColwidth, width, providerwidth])
  
  const getDiscount = async (provider: []) => {
    try {
      if (!provider.length || !searchFlightData) {
        throw new Error("invalid inputs")
      }

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

      const returnAirlinesCode =
        returnFlight &&
        returnFlight.flightCode?.split("->").map((item) => item.substring(0, 2))

      const departAirlineNames =
        departAirlinesCode?.map((code) => airlineMapping[code]) || []
      const returnAirlineNames =
        returnAirlinesCode?.map((code) => airlineMapping[code]) || []

      const airlineNames = _.uniq([
        ...departAirlineNames,
        ...returnAirlineNames
      ])

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

      _providersWithOffer = [..._providersWithOffer,...P]

      _providersWithOffer.length > 1 &&
        _providersWithOffer.sort((a, b) => {
          const aFare =
            a.bestOffer.fare.totalFareAfterDiscount > 0
              ? a.bestOffer.fare.totalFareAfterDiscount
              : a.totalFare
          const bFare =
            b.bestOffer.fare.totalFareAfterDiscount > 0
              ? b.bestOffer.fare.totalFareAfterDiscount
              : b.totalFare

          return aFare - bFare
        })

      setProviderWithOffers(_providersWithOffer)
      setProviderWithOffers2([])
      dispatch(uploadIsLoading(false))
    } catch (error) {
      console.log(error)
      dispatch(uploadIsLoading(false))
    }
  }

  useEffect(() => {
    let providers: any = []

    if (!_.isEmpty(departFlight) && !_.isEmpty(returnFlight)) {
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
          let url = departFlight.compare && departFlight.compare[key].redirecUrl
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

          providers.push({
            provider: key,
            totalFare: totalFare,
            url: url,
            baseFare: baseFare,
            tax: totalTax
          })
        })

      getDiscount(providers)
    } else if (!_.isEmpty(departFlight) && _.isEmpty(returnFlight)) {
      const keys = Object.keys(departFlight.compare || {})
      keys &&
        keys.forEach((key: any) => {
          let totalDepartFare =
            departFlight.compare && departFlight.compare[key]
              ? departFlight.compare[key].fare?.totalFareAfterDiscount
              : 0

          let url = departFlight.compare && departFlight.compare[key].redirecUrl

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

          providers.push({
            provider: key,
            totalFare: totalDepartFare,
            url: url,
            baseFare: baseFare,
            tax: totalTax
          })
        })

      getDiscount(providers)
    }
  }, [departFlight, returnFlight])

  const detailsCard = (title: string, flighDetails: Flight) => {
    const _names = _.uniq(
      flighDetails?.flightCode?.split("->").map((item) => item.substring(0, 2))
    )

    let image

    if (_names.length > 1) {
      image = Airlines_Images["Multiple Airlines"]
    } else {
      image = Airlines_Images[airlineMapping[_names[0]]]
    }

    return (
      flighDetails && (
        <>
          <h4 className="fareHeading">
            {title === "depart" ? "Departure" : "Return"} |{" "}
            {_.uniq(
              flighDetails?.flightCode
                ?.split("->")
                .map((item) => item.substring(0, 2))
            ).map((name, index) => {
              const comma =
                index !==
                _.uniq(
                  flighDetails?.flightCode
                    ?.split("->")
                    .map((item) => item.substring(0, 2))
                ).length -
                  1
                  ? ","
                  : ""

              return `${airlineMapping[name || "AI"]}${comma}`
            })}
          </h4>
          <Card
            style={{
              background: "transparent",
              border: 0,
              borderRadius: "5px"
            }}
            bodyStyle={{ paddingLeft: "0" }}
          >
            <Meta
              avatar={
                <div style={{ width: "30px", height: "30px" }}>
                  <img
                    src={image && image}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              }
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span style={{ color: "#013042" }}>
                    {flighDetails.from} → {flighDetails.to}
                  </span>
                  {/* <span>₹ {flighDetails.cheapestFare}</span> */}
                </div>
              }
              description={<></>}
            />
          </Card>
        </>
      )
    )
  }

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
    city
  }: any) => {
    return (
      <Card style={{ borderRadius: "5px" }}>
        <Meta
          style={{ marginBottom: "1rem" }}
          avatar={
            <div style={{ width: "30px", height: "30px" }}>
              <img
                src={Airlines_Images[airlineMapping[airLine?.slice(0, 2)]]}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          }
          title={
            <Text style={{ fontWeight: "bold", color: "#013042" }}>
              {airlineMapping[airLine?.slice(0, 2) || "AI"]}
            </Text>
          }
          description={<Text style={{ color: "#4E6F7B" }}>{airLine}</Text>}
        />
        <div className="flightSchedule">
          <Meta
            title={
              <div>
                <b className="time" style={{ color: "#013042" }}>
                  {fromTime}
                </b>
                <br />
                <span className="date" style={{ color: "#4E6F7B" }}>
                  {fromDate}
                </span>
              </div>
            }
            description={
              <div>
                <span className="city" style={{ color: "#4E6F7B" }}>
                  {city?.from}
                </span>
                <br />
                <span className="terminal" style={{ color: "#4E6F7B" }}>
                  {" "}
                  {`${
                    fromAddress
                      ? fromAddress.includes("Terminal")
                        ? ""
                        : "Terminal "
                      : "Terminal "
                  } ${fromAddress || "--"}`}
                </span>
              </div>
            }
          />
          <hr style={{ opacity: 0 }} />
          <Meta
            className="middle"
            style={{ height: "100%" }}
            title={
              <div className="middle-info">
                <b
                  style={{ fontWeight: "bold", color: "#013042" }}
                >{`Duration ${duration}`}</b>
              </div>
            }
          />
          <hr style={{ opacity: 0 }} />
          <Meta
            title={
              <div className="right-info">
                <b
                  className="time"
                  style={{ fontWeight: "bold", color: "#013042" }}
                >
                  {toTime}
                </b>
                <span className="date" style={{ color: "#4E6F7B" }}>
                  {toDate}
                </span>
              </div>
            }
            description={
              <div className="right-info">
                <span className="city" style={{ color: "#4E6F7B" }}>
                  {city?.to}
                </span>
                <span className="terminal" style={{ color: "#4E6F7B" }}>
                  {" "}
                  {`${
                    toAddress
                      ? toAddress.includes("Terminal")
                        ? ""
                        : "Terminal "
                      : "Terminal "
                  } ${toAddress || "--"}`}
                </span>
              </div>
            }
          />
        </div>
      </Card>
    )
  }

  const flightInfoCardCretor = (flight: Flight) => {
    return (
      <div>
        {flight.stops === 0
          ? flighInfoTabCard({
              airLine: flight.flightCode,
              fromTime: flight.depTime,
              fromDate: flight.depDate,
              fromAddress:
                flight.departureTerminalList && flight.departureTerminalList[0],
              toTime: flight.arrTime,
              toDate: flight.arrDate,
              duration: flight.duration,
              toAddress:
                flight.arrivalTerminalList && flight.arrivalTerminalList[0],
              flightCode: flight.flightCode,
              city: {
                from: flight.fromCity,
                to: flight.toCity
              }
            })
          : flight.startTimeList?.map((ele, index) => (
              <React.Fragment key={index}>
                {flighInfoTabCard({
                  airLine: flight.flightCode?.split("->")[index],
                  fromTime: moment(
                    flight?.startTimeList
                      ? flight?.startTimeList[index]
                      : new Date()
                  ).format("HH:mm"),
                  fromDate: moment(
                    flight?.startTimeList
                      ? flight?.startTimeList[index]
                      : new Date()
                  ).format("DD/MM/YYYY"),
                  fromAddress:
                    flight.departureTerminalList &&
                    flight.departureTerminalList[index],
                  toTime: moment(
                    flight?.endTimeList
                      ? flight?.endTimeList[index]
                      : new Date()
                  ).format("HH:mm"),
                  toDate: moment(
                    flight?.endTimeList
                      ? flight?.endTimeList[index]
                      : new Date()
                  ).format("DD/MM/YYYY"),
                  duration:
                    flight.durationsList &&
                    flight.durationsList[index].substring(
                      2,
                      flight.durationsList[index].length
                    ),
                  toAddress:
                    flight.arrivalTerminalList &&
                    flight.arrivalTerminalList[index],
                  flightCode: flight.flightCode,
                  city: {
                    from:
                      index === 0
                        ? flight.fromCity
                        : flight?.transitFlight &&
                          flight?.transitFlight[index - 1]?.viaCity,
                    to:
                      index !==
                      (flight.startTimeList && flight.startTimeList.length - 1)
                        ? flight?.transitFlight &&
                          flight?.transitFlight[index]?.viaCity
                        : flight.toCity
                  }
                })}
                {flight.stops && index < flight.stops ? (
                  screen.xs ? (
                    <p
                      style={{
                        color: "#4E6F7B",
                        width: "100%",
                        textAlign: "center",
                        margin: ".5rem 0"
                      }}
                    >
                      Change of planes |{" "}
                      {flight.layoverDurationList &&
                        flight.layoverDurationList[index].substring(
                          2,
                          flight.layoverDurationList[index].length
                        )}{" "}
                      | via{" "}
                      {flight.via?.split("-")[index] ||
                        (flight?.transitFlight &&
                          flight?.transitFlight[index]?.viaAirportCode)}
                    </p>
                  ) : (
                    <Divider plain style={{ color: "#4E6F7B" }}>
                      Change of planes |{" "}
                      {flight.layoverDurationList &&
                        flight.layoverDurationList[index].substring(
                          2,
                          flight.layoverDurationList[index].length
                        )}{" "}
                      | via{" "}
                      {flight.via?.split("-")[index] ||
                        (flight?.transitFlight &&
                          flight?.transitFlight[index]?.viaAirportCode)}
                    </Divider>
                  )
                ) : null}
              </React.Fragment>
            ))}
      </div>
    )
  }

  const flighInfoTabCardContainer = () => (
    <div
      className={
        searchFlightData && searchFlightData.flightType === "ONE_WAY"
          ? "bottomDrawerSingleFlight"
          : "bottomDrawer"
      }
    >
      <div>
        <p className="summaryHeadings">Departure Flights</p>
        {flightInfoCardCretor(departFlight)}
      </div>
      {!_.isEmpty(returnFlight) && (
        <div>
          <p className="summaryHeadings">Return Flights</p>
          {flightInfoCardCretor(returnFlight)}
        </div>
      )}
    </div>
  )

  const flightInfoTabs: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <Text style={{ fontSize: "1rem", color: "#013042" }}>
          Flight details
        </Text>
      ),
      children: flighInfoTabCardContainer()
    }
    // {
    //   key: "2",
    //   label: `Fare summary`,
    //   children: flighSummaryCard()
    // }
  ]

  const SingleProviderFareDetail: React.FC<any> = ({ provider }) => {
    return (
      <div onClick={(e)=>e.stopPropagation()}>
        {provider ? (
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Button
              style={{
                fontWeight: "bold",
                color: "#013042"
              }}
              type="text"
            >
              ₹
              <Link to={provider.url} target="_blank">
                {provider.bestOffer &&
                provider.bestOffer.fare &&
                provider.bestOffer.fare.totalFareAfterDiscount
                  ? provider.bestOffer.fare.totalFareAfterDiscount
                  : provider.totalFare}
                {"-" + provider.provider}
              </Link>
            </Button>
            <Popover
              zIndex={2000}
              content={
                provider && provider.bestOffer ? (
                  <>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>Base Fare:</span>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#013042"
                        }}
                      >
                        {provider && provider.baseFare}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>Total Tax:</span>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#013042"
                        }}
                      >
                        {provider && provider.tax}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>Total Fare:</span>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#013042"
                        }}
                      >
                        {provider &&
                          provider.bestOffer &&
                          provider.bestOffer.fare &&
                          provider.bestOffer.fare.totalFare}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>Total discount:</span>{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#013042"
                        }}
                      >
                        {provider &&
                          provider.bestOffer &&
                          provider.bestOffer.fare &&
                          provider.bestOffer.fare.totalDiscount}
                      </span>
                    </div>

                    <div>
                      <span style={{ color: "#4E6F7B" }}>Promo code:</span>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#013042"
                        }}
                      >
                        {provider.bestOffer && provider.bestOffer.promoCode
                          ? provider.bestOffer.promoCode
                          : "No offer applicable"}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>
                        Total fare after discount:{" "}
                      </span>
                      <b>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "#013042"
                          }}
                        >
                          {provider.bestOffer &&
                          provider.bestOffer.fare &&
                          provider.bestOffer.fare.totalFareAfterDiscount
                            ? provider.bestOffer.fare.totalFareAfterDiscount
                            : provider.bestOffer.fare &&
                              provider.bestOffer.fare.totalFare}
                        </span>
                      </b>
                    </div>
                  </>
                ) : (
                  <div style={{ fontWeight: "bold", color: "#013042" }}>
                    Unlock Exclusive Deals by Logging In
                  </div>
                )
              }
              title={
                provider.bestOffer && (
                  <Text style={{ fontWeight: "bold", color: "#013042" }}>
                    Price breakdown
                  </Text>
                )
              }
              trigger="hover"
            >
              <Button
                shape="circle"
                icon={<InfoOutlined style={{ color: "white" }} />}
                size="small"
                style={{ background: "#4E6F7B" }}
              />
            </Popover>
          </div>
        ) : (
          <></>
        )}
      </div>
    )
  }

  const providerList = (
    <div
      style={{
        marginTop: ".8rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center"
      }}
    >
      {providerWithOffers.length ? (
        providerWithOffers.map((_provider: any, index: number) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center"
              }}
              key={index}
            >
              {index > 0 && <SingleProviderFareDetail provider={_provider} />}
            </div>
          )
        })
      ) : (
        <></>
      )}

      {providerWithOffers2.length ? (
        <div
          style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <Dropdown
            menu={{
              items: providerWithOffers2.map(
                (_provider: any, index: number) => ({
                  key: index,
                  label: <SingleProviderFareDetail provider={_provider} />
                })
              )
            }}
            placement="top"
            trigger={["click"]}
          >
            <Button type="text">More {">>"}</Button>
          </Dropdown>
        </div>
      ) : (
        <></>
      )}
    </div>
  )

  const flightDetailsCard = (
    <>
      <div className="flightBottomDetailCard">
        <div
          className="bottomCardContent"
          style={{ width: "100%" }}
          ref={modalRef}
        >
          <div style={{ width: "100%" }} ref={leftColRef}>
            <div className="flightSummaryDetail">
              <div>{detailsCard("depart", departFlight)}</div>

              {!_.isEmpty(returnFlight) && (
                <div>{detailsCard("return", returnFlight)}</div>
              )}
            </div>

            <div style={{ width: "max-content" }} ref={providerListRef}>
              {providerList}
            </div>
          </div>
          <div className="fareDetail" ref={rightColRef}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: ".4rem"
                }}
              >
                <h4 className="fareHeading">
                  Cheapest Fare: ₹
                  {providerWithOffers.length && (
                    <span>
                      {providerWithOffers.length &&
                      providerWithOffers[0].bestOffer &&
                      providerWithOffers[0].bestOffer.fare &&
                      providerWithOffers[0].bestOffer.fare
                        .totalFareAfterDiscount
                        ? providerWithOffers[0].bestOffer.fare
                            .totalFareAfterDiscount
                        : providerWithOffers[0].totalFare}
                    </span>
                  )}
                </h4>
              </div>
              <p style={{ margin: 0, color: "#013042" }}>
                {providerWithOffers.length && providerWithOffers[0].provider}
              </p>

              <Popover
                content={
                  providerWithOffers.length &&
                  providerWithOffers[0].bestOffer ? (
                    <>
                      <div>
                        <span style={{ color: "#4E6F7B" }}>Base Fare:</span>
                        <span style={{ fontWeight: "bold", color: "#013042" }}>
                          {providerWithOffers.length &&
                            providerWithOffers[0].baseFare}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#4E6F7B" }}>Total Tax:</span>
                        <span style={{ fontWeight: "bold", color: "#013042" }}>
                          {providerWithOffers.length &&
                            providerWithOffers[0].tax}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#4E6F7B" }}>Total Fare:</span>
                        <span style={{ fontWeight: "bold", color: "#013042" }}>
                          {providerWithOffers.length &&
                            providerWithOffers[0].bestOffer.fare.totalFare}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#4E6F7B" }}>
                          Total discount:
                        </span>{" "}
                        <span style={{ fontWeight: "bold", color: "#013042" }}>
                          {providerWithOffers.length &&
                            providerWithOffers[0].bestOffer.fare.totalDiscount}
                        </span>
                      </div>

                      <div>
                        <span style={{ color: "#4E6F7B" }}>Promo code:</span>
                        <span style={{ fontWeight: "bold", color: "#013042" }}>
                          {providerWithOffers[0].bestOffer &&
                          providerWithOffers[0].bestOffer.promoCode
                            ? providerWithOffers[0].bestOffer.promoCode
                            : "No offer applicable"}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#4E6F7B" }}>
                          Total fare after discount:{" "}
                        </span>
                        <b>
                          <span
                            style={{ fontWeight: "bold", color: "#013042" }}
                          >
                            {providerWithOffers[0].bestOffer.fare
                              .totalFareAfterDiscount
                              ? providerWithOffers[0].bestOffer.fare
                                  .totalFareAfterDiscount
                              : providerWithOffers[0].bestOffer.fare.totalFare}
                          </span>
                        </b>
                      </div>
                    </>
                  ) : (
                    <div style={{ fontWeight: "bold", color: "#013042" }}>
                      Unlock Exclusive Deals by Logging In
                    </div>
                  )
                }
                title={
                  providerWithOffers.length &&
                  providerWithOffers[0].bestOffer && (
                    <Text style={{ fontWeight: "bold", color: "#013042" }}>
                      Price breakdown
                    </Text>
                  )
                }
                trigger="hover"
              >
                <Button
                  shape="circle"
                  icon={<InfoOutlined style={{ color: "white" }} />}
                  size="small"
                  style={{ background: "#4E6F7B" }}
                />
              </Popover>
              <Text
                type="secondary"
                style={{
                  fontWeight: "bold",
                  color: "#013042",
                  marginLeft: ".4rem"
                }}
              >
                Fare Details
              </Text>
            </div>
            <div className="cardButtons">
              <button
                onClick={() => {
                  const link =
                    providerWithOffers.length && providerWithOffers[0].url
                  window.open(link, "_blank")
                }}
                className="headerButtons filled"
              >
                Book now
              </button>

              <button
                onClick={() => {
                  dispatch(updateFlightDetails(true))
                }}
                className="headerButtons outlined"
              >
                Flight Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <div>{flightDetailsCard}</div>

      <Drawer
        title="Two-level Drawer"
        placement="bottom"
        closable={true}
        footer={null}
        headerStyle={{
          display: "none"
        }}
        style={
          screen.md
            ? {
                marginLeft: "calc(200px + 5%)",
                width: "calc(90% - 200px)",
                borderRadius: "5px 5px 0 0",
                padding: "0",
                background: "white"
              }
            : {
                borderRadius: "5px 5px 0 0",
                padding: "0",
                background: "white",
                width: "95%",
                margin: "0 auto"
              }
        }
        className="flightScheduleDrawer"
        contentWrapperStyle={{
          boxShadow: "none"
        }}
        onClose={() => {
          dispatch(updateFlightDetails(false))
        }}
        open={flightDetails}
      >
        <Tabs tabBarStyle={{ color: "#013042" }} items={flightInfoTabs} />
      </Drawer>
    </>
  )
}

export default FlightDetailCard
