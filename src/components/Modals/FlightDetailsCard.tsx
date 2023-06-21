import React from "react"
import { InfoCircleFilled, InfoOutlined, InfoCircleTwoTone } from "@ant-design/icons"

import { Button, Card, Form, Input, Avatar, Tabs, InputNumber, Modal, Typography, Divider, Popover } from "antd"
import * as _ from "lodash"
import { Drawer } from "antd"
import type { TabsProps } from "antd"

import { loginBanner } from "../../assets/images"
import { getFlightsConfig } from "../../services/api/urlConstants"
import backendService from "../../services/api"
import { signupUser } from "../../services/auth"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { toggleModal, updateFlightDetails } from "../../redux/slices/app"
import { Flight, FlightState } from "../../redux/slices/flights"
import { airlineMapping } from "../../services/airports"
import moment from "moment"

const { Text, Title } = Typography
const { Meta } = Card

const FlightDetailsCard = ({ onFinishHandler }: any) => {
    const { modal, flightDetails } = useAppSelector((state) => state.app)
    const { departFlight, returnFlight } = useAppSelector((state: { flight: FlightState }) => state.flight)
    const dispatch = useAppDispatch()

    const [form] = Form.useForm()

    const onFinish = (values: any) => {
        const dataParams = form.getFieldsValue()
        console.log(dataParams)
        signupUser(dataParams)
            .then((res) => {
                console.log("register done")
                onFinishHandler(true)
            })
            .catch((err) => {
                console.log("err", err)
                onFinishHandler(false)
            })
    }

    const detailsCard = (title: string, flighDetails: Flight) =>
        flighDetails && (
            <>
                <Title level={5}>
                    {title === "depart" ? "Dep" : "Ret"} | {_.uniq(flighDetails?.flightCode?.split("->").map((item) => item.substring(0, 2))).map((name) => airlineMapping[name || "AI"])}
                </Title>
                <Card style={{ background: "transparent", border: 0 }} bodyStyle={{ paddingLeft: "0" }}>
                    <Meta
                        avatar={<Avatar src='https://xsgames.co/randomusers/avatar.php?g=pixel' />}
                        title={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                <span>
                                    {flighDetails.from} → {flighDetails.to}
                                </span>
                                <span>₹ {flighDetails.cheapestFare}</span>
                            </div>
                        }
                        description={Object.entries(flighDetails.compare || {}).map((item) => {
                            console.log(item[0], flighDetails.cheapestProvider?.providerCode)
                            return item[0] !== flighDetails.cheapestProvider?.providerCode ? (
                                <>
                                    <Button
                                        style={{
                                            color: "black",
                                        }}
                                        ghost={true}
                                        type='text'
                                        onClick={() => {
                                            // dispatch(updateFlightDetails(true));
                                        }}>
                                        {item[1].fare?.totalFare} - {item[0]}
                                    </Button>
                                    <Popover
                                        content={
                                            <>
                                                <div>
                                                    <span>Ticket price:</span> <span>{item[1].fare?.totalFare}</span>
                                                </div>
                                                <div>
                                                    <span>Total discount:</span> <span>{item[1].fare?.totalDiscount}</span>
                                                </div>
                                                <div>
                                                    <span>Promo code:</span> <span>{item[1].offerDescription?.promoCode || "No offer applicable"}</span>
                                                </div>
                                                <div>
                                                    <span>Total price after discount:</span> <b>{item[1].fare?.totalFareAfterDiscount}</b>
                                                </div>
                                            </>
                                        }
                                        title={"Price breakdown"}
                                        trigger='hover'>
                                        <Button shape='circle' icon={<InfoOutlined />} size='small' />
                                    </Popover>
                                </>
                            ) : null
                        })}
                    />
                </Card>
            </>
        )

    const flighInfoTabCard = ({ fromTime, fromDate, fromAddress, toTime, toDate, duration, toAddress, flightCode, airLine, city }: any) => (
        <Card>
            <Meta avatar={<Avatar src='https://xsgames.co/randomusers/avatar.php?g=pixel' />} title={airlineMapping[airLine?.slice(0, 2) || "AI"]} description={`${airLine}`} />
            <br />
            <br />
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                    columnGap: "15px",
                }}>
                <Meta
                    title={
                        <div>
                            <b className='time'>{fromTime}</b>
                            <br />
                            <span className='date'>{fromDate}</span>
                        </div>
                    }
                    description={
                        <div>
                            <span className='city'>{city?.from}</span>
                            <br />
                            <span className='terminal'> {`${fromAddress ? (fromAddress.includes("Terminal") ? "" : "Terminal ") : "Terminal "} ${fromAddress || "--"}`}</span>
                        </div>
                    }
                />
                <hr className='border' />
                <Meta
                    className='middle'
                    style={{ height: "100%" }}
                    title={
                        <div className='middle-info'>
                            <b>{`Duration ${duration}`}</b>
                        </div>
                    }
                />
                <hr className='border' />
                <Meta
                    title={
                        <div className='right-info'>
                            <b className='time'>{toTime}</b>
                            <span className='date'>{toDate}</span>
                        </div>
                    }
                    description={
                        <div className='right-info'>
                            <span className='city'>{city?.to}</span>
                            <span className='terminal'> {`${toAddress ? (toAddress.includes("Terminal") ? "" : "Terminal ") : "Terminal "} ${toAddress || "--"}`}</span>
                        </div>
                    }
                />
            </div>
            {/* <div
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
      </div> */}
        </Card>
    )

    const flighSummaryCard = () => (
        <Card title='Fare breakup'>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 3fr",
                }}>
                <span>
                    <b>TOTAL</b>
                </span>
                <span>
                    <b>₹ 11,240</b>
                </span>
                <span style={{ color: "rgb(135, 135, 135)" }}>Base Fare</span>
                <span style={{ color: "rgb(135, 135, 135)" }}>₹ 9,596</span>
                <span style={{ color: "rgb(135, 135, 135)" }}>Surcharges</span>
                <span style={{ color: "rgb(135, 135, 135)" }}>₹ 1,644</span>
            </div>
        </Card>
    )

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
                      flightCode: flight.flightCode,
                  })
                : flight.startTimeList?.map((ele, index) => (
                      <>
                          {flighInfoTabCard({
                              airLine: flight.flightCode?.split("->")[index],
                              fromTime: moment(flight?.startTimeList ? flight?.startTimeList[index] : new Date()).format("HH:mm"),
                              fromDate: moment(flight?.startTimeList ? flight?.startTimeList[index] : new Date()).format("DD/MM/YYYY"),
                              fromAddress: flight.departureTerminalList && flight.departureTerminalList[index],
                              toTime: moment(flight?.endTimeList ? flight?.endTimeList[index] : new Date()).format("HH:mm"),
                              toDate: moment(flight?.endTimeList ? flight?.endTimeList[index] : new Date()).format("DD/MM/YYYY"),
                              duration: flight.durationsList && flight.durationsList[index].substring(2, flight.durationsList[index].length),
                              toAddress: flight.arrivalTerminalList && flight.arrivalTerminalList[index],
                              flightCode: flight.flightCode,
                              city: {
                                  from: index === 0 ? flight.fromCity : flight?.transitFlight && flight?.transitFlight[index - 1]?.viaCity,
                                  to: index !== (flight.startTimeList && flight.startTimeList.length - 1) ? flight?.transitFlight && flight?.transitFlight[index]?.viaCity : flight.toCity,
                              },
                          })}
                          {flight.stops && index < flight.stops ? (
                              <Divider plain>
                                  Change of planes | {flight.layoverDurationList && flight.layoverDurationList[index].substring(2, flight.layoverDurationList[index].length)} | via {flight.via?.split("-")[index] || (flight?.transitFlight && flight?.transitFlight[index]?.viaAirportCode)}
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
                width: "100%",
            }}>
            <div style={{ marginBottom: "10px", flex: "1 1" }}>{flightInfoCardCretor(departFlight)}</div>
            {!_.isEmpty(returnFlight) && <div style={{ flex: "1 1" }}>{flightInfoCardCretor(returnFlight)}</div>}
        </div>
    )

    const flightInfoTabs: TabsProps["items"] = [
        {
            key: "1",
            label: `Flight details`,
            children: flighInfoTabCardContainer(),
        },
        {
            key: "2",
            label: `Fare summary`,
            children: flighSummaryCard(),
        },
    ]

    const flightDetailsCard = (
        <div
            style={{
                padding: "0 25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                background: "#B23850",
            }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1fr",
                    columnGap: "2em",
                    width: "100%",
                }}>
                <div>{detailsCard("depart", departFlight)}</div>
                {!_.isEmpty(returnFlight) && <div>{detailsCard("return", returnFlight)}</div>}
                <div
                    style={{
                        justifySelf: "flex-end",
                    }}>
                    <div>
                        <Title level={4} style={{ marginBottom: 0 }}>
                            ₹ {(departFlight.cheapestFare || 0) + (returnFlight.cheapestFare || 0)}
                        </Title>
                        <Title level={5} style={{ margin: 0 }}>
                            {departFlight.cheapestProvider?.providerCode}
                        </Title>

                        <Popover
                            content={
                                <>
                                    <div>
                                        <span>Ticket price:</span> <span>{departFlight.compare && departFlight.compare[departFlight.cheapestProvider?.providerCode!].fare?.totalFare}</span>
                                    </div>
                                    <div>
                                        <span>Total discount:</span> <span>{departFlight.compare && departFlight.compare[departFlight.cheapestProvider?.providerCode!].fare?.totalDiscount}</span>
                                    </div>

                                    <div>
                                        <span>Promo code:</span> <span>{(departFlight.compare && departFlight.compare[departFlight.cheapestProvider?.providerCode!].offerDescription?.promoCode) || "No offer applicable"}</span>
                                    </div>
                                    <div>
                                        <span>Total price after discount:</span> <b>{departFlight.compare && departFlight.compare[departFlight.cheapestProvider?.providerCode!].fare?.totalFareAfterDiscount}</b>
                                    </div>
                                </>
                            }
                            title={"Price breakdown"}
                            trigger='hover'>
                            <Button shape='circle' icon={<InfoOutlined />} size='small' />
                        </Popover>
                        <Text type='secondary'>Fare Details</Text>
                    </div>
                    <div>
                        <Button
                            type='primary'
                            onClick={() => {
                                dispatch(updateFlightDetails(true))
                            }}>
                            Book now
                        </Button>
                        <br />

                        <Button
                            onClick={() => {
                                dispatch(updateFlightDetails(true))
                            }}>
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
                    padding: 0,
                }}
                rootStyle={{
                    marginLeft: "calc(200px + 10%)",
                    width: "calc(80% - 200px)",
                }}
                placement='bottom'
                mask={false}
                headerStyle={{
                    display: "none",
                }}
                footer={null}
                onClose={() => {
                    dispatch(dispatch(toggleModal({ modal: "flightInfo", status: false })))
                }}
                open={modal.flightInfo}>
                {flightDetailsCard}
                <Drawer
                    title='Two-level Drawer'
                    placement='bottom'
                    closable={true}
                    footer={null}
                    headerStyle={{
                        display: "none",
                    }}
                    style={{
                        marginLeft: "calc(200px + 5%)",
                        width: "calc(90% - 200px)",
                        borderRadius: "20px 20px 0 0",
                        padding: "0",
                    }}
                    contentWrapperStyle={{
                        boxShadow: "none",
                    }}
                    onClose={() => {
                        dispatch(updateFlightDetails(false))
                    }}
                    open={flightDetails}>
                    <Tabs items={flightInfoTabs} />
                </Drawer>
            </Drawer>
        </div>
    )
}

export default FlightDetailsCard
