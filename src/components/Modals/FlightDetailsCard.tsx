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
    const getDiscount = async () => {
      try {
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

        console.log("provider : ", provider)

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

        const res1: any = await getBestOffer(payload[0], authToken)

        setBestOffer(res1.bestOffer)

        if (payload.length > 1) {
          const res2: any = await getBestOffer(payload[1], authToken)

          setBestOffer2(res2.bestOffer)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (provider.length && authToken && searchFlightData) {
      getDiscount()
    }
  }, [provider, authToken, searchFlightData])
  console.log(departFlight)

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

  console.log(departFlight, returnFlight)

  const detailsCard = (title: string, flighDetails: Flight) =>
    flighDetails && (
      <>
        <Title level={5}>
          {title === "depart" ? "Dep" : "Ret"} |{" "}
          {_.uniq(
            flighDetails?.flightCode
              ?.split("->")
              .map((item) => item.substring(0, 2))
          ).map((name) => airlineMapping[name || "AI"])}
        </Title>
        <Card
          style={{ background: "transparent", border: 0 }}
          bodyStyle={{ paddingLeft: "0" }}
        >
          <Meta
            avatar={
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
            }
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span>
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
                        color: "black"
                      }}
                      ghost={true}
                      type="text"
                      onClick={() => {
                        // dispatch(updateFlightDetails(true));
                      }}
                    >
                      <Link to={provider.length > 1 && provider[1].url}>
                        {provider.length > 1 &&
                          provider[1].totalFare + "-" + provider[1].provider}
                        {!provider.length && item[1].fare?.totalFare + "-"}{" "}
                        {!provider.length && item[0]}
                      </Link>
                    </Button>
                    <Popover
                      content={
                        bestOffer2 && (
                          <>
                            <div>
                              <span>Base Fare:</span>
                              <span>
                                {provider.length > 1 && provider[1].baseFare}
                              </span>
                            </div>
                            <div>
                              <span>Totall Tax:</span>
                              <span>
                                {provider.length > 1 && provider[1].tax}
                              </span>
                            </div>
                            <div>
                              <span>Ticket price:</span>
                              <span>{bestOffer2.fare.totalFare}</span>
                            </div>
                            <div>
                              <span>Total discount:</span>{" "}
                              <span>{bestOffer2.fare.totalDiscount}</span>
                            </div>

                            <div>
                              <span>Promo code:</span>
                              <span>
                                {bestOffer2.promoCode
                                  ? bestOffer2.promoCode
                                  : "No offer applicable"}
                              </span>
                            </div>
                            <div>
                              <span>Total price after discount: </span>
                              <b>
                                {bestOffer2.fare.totalFareAfterDiscount
                                  ? bestOffer2.fare.totalFareAfterDiscount
                                  : bestOffer2.fare.totalFare}
                              </b>
                            </div>
                          </>
                        )
                      }
                      title={"Price breakdown"}
                      trigger="hover"
                    >
                      <Button
                        shape="circle"
                        icon={<InfoOutlined />}
                        size="small"
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
  }: any) => (
    <Card>
      <Meta
        avatar={
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
        }
        title={airlineMapping[airLine?.slice(0, 2) || "AI"]}
        description={`${airLine}`}
      />
      <br />
      <br />
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
              <b className="time">{fromTime}</b>
              <br />
              <span className="date">{fromDate}</span>
            </div>
          }
          description={
            <div>
              <span className="city">{city?.from}</span>
              <br />
              <span className="terminal">
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
        <hr className="border" />
        <Meta
          className="middle"
          style={{ height: "100%" }}
          title={
            <div className="middle-info">
              <b>{`Duration ${duration}`}</b>
            </div>
          }
        />
        <hr className="border" />
        <Meta
          title={
            <div className="right-info">
              <b className="time">{toTime}</b>
              <span className="date">{toDate}</span>
            </div>
          }
          description={
            <div className="right-info">
              <span className="city">{city?.to}</span>
              <span className="terminal">
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

  const flightInfoCardCretor = (flight: Flight) => (
    <div>
      {flight.stops && flight.stops === 0
        ? flighInfoTabCard({
            airLine: flight.airline,
            fromTime: flight.depTime,
            fromDate: flight.depDate,
            fromAddress: flight.from + " " + flight.fromCity,
            toTime: flight.arrTime,
            toDate: flight.arrDate,
            duration: flight.duration,
            toAddress: flight.to + " " + flight.toCity,
            flightCode: flight.flightCode
          })
        : flight.startTimeList?.map((ele, index) => (
            <>
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
                  flight?.endTimeList ? flight?.endTimeList[index] : new Date()
                ).format("HH:mm"),
                toDate: moment(
                  flight?.endTimeList ? flight?.endTimeList[index] : new Date()
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
                <Divider plain>
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
            </>
          ))}
    </div>
  )

  const flighInfoTabCardContainer = () => (
    <div
      style={{
        display: "flex",
        width: "100%"
      }}
    >
      <div style={{ marginBottom: "10px", flex: "1 1" }}>
        {flightInfoCardCretor(departFlight)}
      </div>
      {!_.isEmpty(returnFlight) && (
        <div style={{ flex: "1 1" }}>{flightInfoCardCretor(returnFlight)}</div>
      )}
    </div>
  )

  const flightInfoTabs: TabsProps["items"] = [
    {
      key: "1",
      label: `Flight details`,
      children: flighInfoTabCardContainer()
    }
    // {
    //   key: "2",
    //   label: `Fare summary`,
    //   children: flighSummaryCard()
    // }
  ]

  const flightDetailsCard = (
    <div
      style={{
        padding: "0 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#B23850"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1.5fr",
          columnGap: "2rem",
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
        <div>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Title level={4} style={{ marginBottom: 0 }}>
                Discounted Fare: ₹
                {bestOffer &&
                  (bestOffer.fare && bestOffer.fare.totalFareAfterDiscount
                    ? bestOffer.fare.totalFareAfterDiscount
                    : provider[0].totalFare)}
              </Title>
            </div>
            <Title level={5} style={{ margin: 0 }}>
              {provider.length && provider[0].provider}
            </Title>

            <Popover
              content={
                bestOffer && (
                  <>
                    <div>
                      <span>Base Fare:</span>
                      <span>{provider.length > 1 && provider[1].baseFare}</span>
                    </div>
                    <div>
                      <span>Totall Tax:</span>
                      <span>{provider.length > 1 && provider[1].tax}</span>
                    </div>
                    <div>
                      <span>Ticket price:</span>
                      <span>{bestOffer.fare.totalFare}</span>
                    </div>
                    <div>
                      <span>Total discount:</span>{" "}
                      <span>{bestOffer.fare.totalDiscount}</span>
                    </div>

                    <div>
                      <span>Promo code:</span>
                      <span>
                        {bestOffer.promoCode
                          ? bestOffer.promoCode
                          : "No offer applicable"}
                      </span>
                    </div>
                    <div>
                      <span>Total price after discount: </span>
                      <b>
                        {bestOffer.fare.totalFareAfterDiscount
                          ? bestOffer.fare.totalFareAfterDiscount
                          : bestOffer.fare.totalFare}
                      </b>
                    </div>
                  </>
                )
              }
              title={"Price breakdown"}
              trigger="hover"
            >
              <Button shape="circle" icon={<InfoOutlined />} size="small" />
            </Popover>
            <Text type="secondary">Fare Details</Text>
          </div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                //dispatch(updateFlightDetails(true))
                window.location.href = provider.length && provider[0].url
              }}
            >
              Book now
            </Button>
            <br />

            <Button
              onClick={() => {
                dispatch(updateFlightDetails(true))
              }}
            >
              Flight Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
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

      <Drawer
        height={"auto"}
        autoFocus={false}
        bodyStyle={{
          padding: 0
        }}
        rootStyle={{
          marginLeft: "calc(200px + 10%)",
          width: "calc(80% - 200px)"
        }}
        placement="bottom"
        mask={false}
        headerStyle={{
          display: "none"
        }}
        footer={null}
        onClose={() => {
          dispatch(
            dispatch(toggleModal({ modal: "flightInfo", status: false }))
          )
        }}
        open={modal.flightInfo}
      >
        {flightDetailsCard}
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
            borderRadius: "20px 20px 0 0",
            padding: "0"
          }}
          contentWrapperStyle={{
            boxShadow: "none"
          }}
          onClose={() => {
            dispatch(updateFlightDetails(false))
          }}
          open={flightDetails}
        >
          <Tabs items={flightInfoTabs} />
        </Drawer>
      </Drawer>
    </div>
  )
}

export default FlightDetailsCard
