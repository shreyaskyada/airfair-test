import React, { useEffect, useState } from "react"
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
  Popover
} from "antd"
import * as _ from "lodash"
import dayjs from "dayjs"
import useLocalStorage from "../../hooks/LocalStorage"
import { Drawer } from "antd"
import type { TabsProps } from "antd"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { toggleModal, updateFlightDetails } from "../../redux/slices/app"
import { Flight, FlightState } from "../../redux/slices/flights"
import { airlineMapping } from "../../services/airports"
import { getBestOffer } from "../../services/airports"
import moment from "moment"
import { ISearchFlights } from "../../redux/slices/searchFlights"
import { Airlines_Images } from "../../data/popularAirlines"

const { Text, Title } = Typography
const { Meta } = Card

const FlightDetailsCard = ({ onFinishHandler }: any) => {
  const dispatch = useAppDispatch()
  const [authToken] = useLocalStorage("authToken", "")

  const [bestOffer, setBestOffer] = useState<any>(null)
  const [bestOffer2, setBestOffer2] = useState<any>(null)
  const [provider, setProvider] = useState<any>([])

  const { modal, flightDetails, userDetails } = useAppSelector(
    (state) => state.app
  )
  const { departFlight, returnFlight } = useAppSelector(
    (state: { flight: FlightState }) => state.flight
  )
  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  )

  useEffect(() => {
    const getDiscount = async (token: any) => {
      setBestOffer(null)
      setBestOffer2(null)
      try {
        if (
          !provider.length ||
          !searchFlightData ||
          token === '""' ||
          token === ""
        ) {
          throw new Error("invalid inputs")
        }
        const walletList = userDetails.walletList.map(
          (wallet: any) => wallet.walletName
        )

        const bankList = userDetails.bankList.map((bank: any) => ({
          bankName: bank.bankName.toUpperCase(),
          bankCards: [
            (bank.bankCardType + "-" + bank.bankCardName).toUpperCase()
          ]
        }))

        const doj = moment(searchFlightData.dateOfDep).valueOf()
        const dob = moment(dayjs().toString()).valueOf()

        const payload: any = provider.map((_provider: any) => ({
          provider: _provider.provider,
          airline: ["ALL"],
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

        const res1: any = await getBestOffer(payload[0], token)

        setBestOffer(res1.bestOffer)

        if (payload.length > 1) {
          const res2: any = await getBestOffer(payload[1], token)
          setBestOffer2(res2.bestOffer)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const token = localStorage.getItem("authToken")
    getDiscount(token)
  }, [provider, searchFlightData, userDetails])

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

      providers.sort((a: any, b: any) => a.totalFare - b.totalFare)
      setProvider(providers)
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
      providers.sort((a: any, b: any) => a.totalFare - b.totalFare)

      setProvider(providers)
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
          <Title level={5} style={{ color: "#013042" }}>
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
          </Title>
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
                <Avatar src={<img src={image && image} alt="flight" />} />
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
              description={Object.entries(flighDetails.compare || {}).map(
                (item) => {
                  return title === "depart" &&
                    item[0] !== flighDetails.cheapestProvider?.providerCode ? (
                    <>
                      <Button
                        style={{
                          color: "#4E6F7B"
                        }}
                        ghost={true}
                        type="text"
                        onClick={() => {
                          // dispatch(updateFlightDetails(true));
                        }}
                      >
                        <Link
                          to={provider.length > 1 && provider[1].url}
                          target="_blank"
                        >
                          {provider.length > 1 &&
                          bestOffer2 &&
                          bestOffer2.fare &&
                          bestOffer2.fare.totalFareAfterDiscount
                            ? bestOffer2.fare.totalFareAfterDiscount
                            : provider.length > 1 &&
                              provider[1].totalFare +
                                "-" +
                                provider[1].provider}
                          {!provider.length && item[1].fare?.totalFare + "-"}{" "}
                          {!provider.length && item[0]}
                        </Link>
                      </Button>
                      <Popover
                        content={
                          bestOffer2 ? (
                            <>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Base Fare:
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {provider.length > 1 && provider[1].baseFare}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Totall Tax:
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {provider.length > 1 && provider[1].tax}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Ticket price:
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {bestOffer2.fare.totalFare}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Total discount:
                                </span>{" "}
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {bestOffer2.fare.totalDiscount}
                                </span>
                              </div>

                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Promo code:
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#013042"
                                  }}
                                >
                                  {bestOffer2.promoCode
                                    ? bestOffer2.promoCode
                                    : "No offer applicable"}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#4E6F7B" }}>
                                  Total price after discount:{" "}
                                </span>
                                <b>
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      color: "#013042"
                                    }}
                                  >
                                    {bestOffer2.fare.totalFareAfterDiscount
                                      ? bestOffer2.fare.totalFareAfterDiscount
                                      : bestOffer2.fare.totalFare}
                                  </span>
                                </b>
                              </div>
                            </>
                          ) : (
                            <div
                              style={{ fontWeight: "bold", color: "#013042" }}
                            >
                              LogIn to get discount offeres
                            </div>
                          )
                        }
                        title={
                          bestOffer2 && (
                            <Text
                              style={{ fontWeight: "bold", color: "#013042" }}
                            >
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
                    </>
                  ) : null
                }
              )}
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
    console.log(airLine)
    return (
      <Card style={{ borderRadius: "5px" }}>
        <Meta
          style={{ marginBottom: "1rem" }}
          avatar={
            <Avatar
              style={{ border: "1px solid #013042" }}
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
            />
          }
          title={
            <Text style={{ fontWeight: "bold", color: "#013042" }}>
              {airlineMapping[airLine?.slice(0, 2) || "AI"]}
            </Text>
          }
          description={<Text style={{ color: "#4E6F7B" }}>{airLine}</Text>}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            columnGap: "15px"
          }}
        >
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
  {
    /* <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          columnGap: "15px",
        }}
      >
        <Meta
          title={
            <div>
              <b>BAGGAGE:</b>
            </div>
          }
          description={<span>ADULT</span>}
        />
        <Meta
          title={
            <div>
              <b>CHECK IN:</b>
            </div>
          }
          description={<span>25 Kgs</span>}
        />
        <Meta
          title={
            <div>
              <b>CABIN:</b>
            </div>
          }
          description={<span>8 Kgs</span>}
        />
      </div> */
  }

  // const flighSummaryCard = () => (
  //   <Card title="Fare breakup">
  //     <div
  //       style={{
  //         display: "grid",
  //         gridTemplateColumns: "1fr 3fr"
  //       }}
  //     >
  //       <span>
  //         <b>TOTAL</b>
  //       </span>
  //       <span>
  //         <b>₹ 11,240</b>
  //       </span>
  //       <span style={{ color: "rgb(135, 135, 135)" }}>Base Fare</span>
  //       <span style={{ color: "rgb(135, 135, 135)" }}>₹ 9,596</span>
  //       <span style={{ color: "rgb(135, 135, 135)" }}>Surcharges</span>
  //       <span style={{ color: "rgb(135, 135, 135)" }}>₹ 1,644</span>
  //     </div>
  //   </Card>
  // )

  const flightInfoCardCretor = (flight: Flight) => {
    {
      console.log("Flight-", flight)
    }
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
                ) : null}
              </React.Fragment>
            ))}
      </div>
    )
  }

  const flighInfoTabCardContainer = () => (
    <div
      style={{
        display: "flex",
        width: "100%",
        gap: ".5rem"
      }}
    >
      <div style={{ flex: "1 1" }}>{flightInfoCardCretor(departFlight)}</div>
      {!_.isEmpty(returnFlight) && (
        <div style={{ flex: "1 1" }}>{flightInfoCardCretor(returnFlight)}</div>
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

  const flightDetailsCard = (
    <div className="flightBottomDetailCard">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem"
        }}
      >
        <div
          className="flightSummaryDetail"
          style={{
            display: "flex",
            flexBasis: "70%",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <div>{detailsCard("depart", departFlight)}</div>
          <div>
            {!_.isEmpty(returnFlight) && (
              <div>{detailsCard("return", returnFlight)}</div>
            )}
          </div>
        </div>
        <div style={{ display: "Flex", flexDirection: "column", gap: ".8rem" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: ".4rem"
              }}
            >
              <Title level={4} style={{ marginBottom: 0, color: "#013042" }}>
                Final Fare: ₹
                <span>
                  {bestOffer &&
                  bestOffer.fare &&
                  bestOffer.fare.totalFareAfterDiscount
                    ? bestOffer.fare.totalFareAfterDiscount
                    : provider.length && provider[0].totalFare}
                </span>
              </Title>
            </div>
            <Title level={5} style={{ margin: 0, color: "#013042" }}>
              {provider.length && provider[0].provider}
            </Title>

            <Popover
              content={
                bestOffer ? (
                  <>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>Base Fare:</span>
                      <span style={{ fontWeight: "bold", color: "#013042" }}>
                        {provider.length && provider[0].baseFare}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>Totall Tax:</span>
                      <span style={{ fontWeight: "bold", color: "#013042" }}>
                        {provider.length && provider[0].tax}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>Ticket price:</span>
                      <span style={{ fontWeight: "bold", color: "#013042" }}>
                        {bestOffer.fare.totalFare}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>Total discount:</span>{" "}
                      <span style={{ fontWeight: "bold", color: "#013042" }}>
                        {bestOffer.fare.totalDiscount}
                      </span>
                    </div>

                    <div>
                      <span style={{ color: "#4E6F7B" }}>Promo code:</span>
                      <span style={{ fontWeight: "bold", color: "#013042" }}>
                        {bestOffer.promoCode
                          ? bestOffer.promoCode
                          : "No offer applicable"}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#4E6F7B" }}>
                        Total price after discount:{" "}
                      </span>
                      <b>
                        <span style={{ fontWeight: "bold", color: "#013042" }}>
                          {bestOffer.fare.totalFareAfterDiscount
                            ? bestOffer.fare.totalFareAfterDiscount
                            : bestOffer.fare.totalFare}
                        </span>
                      </b>
                    </div>
                  </>
                ) : (
                  <div style={{ fontWeight: "bold", color: "#013042" }}>
                    LogIn to get get discount offers
                  </div>
                )
              }
              title={
                bestOffer && (
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
              style={{ color: "#4E6F7B", marginLeft: ".4rem" }}
            >
              Fare Details
            </Text>
          </div>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <button
              onClick={() => {
                const link = provider.length && provider[0].url
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
  )

  return (
    <>
      {/* <Modal
        open={true}
        mask={false}
        footer={null}
        closable={false}
        width="75vw"
        className="no-padding"
        style={{ padding: "0 !important", top: "80vh", left: "100px" }}
      >
        {flightDetailsCard}
      </Modal> */}
      {/* <Modal
        open={true}
        mask={false}
        footer={null}
        closable={false}
        width="75vw"
        className="no-padding"
        style={{ padding: "0 !important", top: "80vh", left: "100px" }}
      >
        {flightDetailsCard}
      </Modal> */}

      {/* <Drawer
        height={"auto"}
        autoFocus={false}
        bodyStyle={{
          padding: 0
        }}
        rootStyle={{
          marginLeft: "calc(200px + 10%)",
          width: "calc(80% - 200px)",
          position:"sticky",
          bottom:0
        }}
        placement="bottom"
        mask={false}
        headerStyle={{
          display: "none"
        }}
        contentWrapperStyle={{
          boxShadow: "none"
        }}
        footer={null}
        onClose={() => {
          dispatch(
            dispatch(toggleModal({ modal: "flightInfo", status: false }))
          )
        }}
        open={modal.flightInfo}
      > */}
      <div>

        {flightDetailsCard}
      </div>
        
      {/* </Drawer> */}
      <Drawer
          title="Two-level Drawer"
          placement="bottom"
          closable={true}
          footer={null}
          headerStyle={{
            display: "none"
          }}
          style={{
            marginLeft: "calc(200px + 5%)",
            width: "calc(90% - 200px)",
            borderRadius: "5px 5px 0 0",
            padding: "0",
            background: "white"
          }}
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

export default FlightDetailsCard
