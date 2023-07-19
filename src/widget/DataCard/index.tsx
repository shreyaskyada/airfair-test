import React, { useState, useEffect } from "react"
import { Button, Card, Space, Tag } from "antd"
import { DownOutlined, UpOutlined } from "@ant-design/icons"
import * as _ from "lodash"
import { airlineMapping } from "../../services/airports"
import { Airlines_Images } from "../../data/popularAirlines"
import "./DataCard.css"

interface Props {
  checked?: boolean
  departCode?:string
  currentCode?:string
  index: number
  dataKey: number
  type: string
  selectedKey: string
  onSelectedFlightChange: any
  tags: {
    color: string
    name: string
  }[]
  flight: {
    connectivity: string
    agent: string
    type: string
    company: string
    companyImg: string
    price: string
    totalTime: string
    schedule: {
      departure: string
      arrival: string
    }
    route: {
      from: string
      to: string
    }
    partners: {
      price: string
      name: string
    }[]
  }
  onLikeClick?: () => void
  onViewDealClick?: () => void
}

const DataCard = (props: Props) => {
  const { tags, flight, type, dataKey, onSelectedFlightChange, checked,currentCode,departCode } = props

  const [details, setDetails] = useState(false)
  const [flightNames, setFlightNames] = useState<string[]>([])
  const [flightImage, setFlightImage] = useState<any>(null)

  useEffect(() => {
    const _names = _.uniq(
      flight.company?.split("->").map((item) => item.substring(0, 2))
    )
    setFlightNames(_names)

    if (_names.length > 1) {
      setFlightImage(Airlines_Images["Multiple Airlines"])
    } else {
      setFlightImage(Airlines_Images[airlineMapping[_names[0]]])
    }

    
  }, [flight])

  return (
    // <Space style={{ width: "100%", marginBottom: "20px",padding:0 }} direction="vertical">
    <div
      style={{
       
      }}
      className="detailCard"
    >
      <div className="cardContainer">
        <div className="radioButtonContainer">
          <input
            type="radio"
            name={type}
            id={type}
            className="radioButton"
            value={`${type}-${dataKey}`}
            checked={checked}
            onChange={onSelectedFlightChange}
          />
        </div>
        <div className="flightInfoSection">
          <div className="flightNamesSection">
            <div className="flightImageSection">
              <img
                src={flightImage ? flightImage : flight.companyImg}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="flightDetailSection">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  {tags.map((tag) => (
                    <Tag color={tag.color}>{tag.name}</Tag>
                  ))}
                </div>
              </div>
              <div className="nameTime">
                <p className="flightName">
                  {flightNames
                    .map((name) => airlineMapping[name || "AI"])
                    .join(", ")}
                </p>
                <p className="flightTime"> {flight.totalTime}</p>
              </div>

              <p className="flightScheduled">
                {flight.schedule.departure} - {flight.schedule.arrival}
              </p>
              <p className="flightRoute">
                {flight.route.from} - {flight.route.to}
              </p>
              <p className="flightConnectivity">{flight.connectivity}</p>
            </div>
          </div>
          <div className="flightCompanySection">
            <p className="flightCompany">{flight.company}</p>
            <div className="flightCompanyInfo">
              <p>
                {flight.partners.map((partner) => {
                  return Array.isArray(flight.agent)
                    ? flight.agent[0] !== partner.name && (
                        <div className="flightPartener">
                          <p
                            style={{ color: "#013042" }}
                            className="partenerPrice"
                          >
                            ₹ {partner.price}
                          </p>
                          <p
                            className="partenerName"
                            style={{ color: "#013042" }}
                          >
                            {partner.name}
                          </p>
                        </div>
                      )
                    : flight.agent !== partner.name && (
                        <div className="flightPartener">
                          <p
                            className="partenerPrice"
                            style={{ color: "#013042" }}
                          >
                            ₹ {partner.price}
                          </p>
                          <p
                            className="partenerName"
                            style={{ color: "#013042" }}
                          >
                            {partner.name}
                          </p>
                        </div>
                      )
                })}
                {details &&
                  flight.partners.length - 2 &&
                  flight.partners.slice(2).map((partner) => (
                    <div className="flightPartener">
                      <p className="partenerPrice">₹ {partner.price}</p>
                      <p className="partenerName">{partner.name}</p>
                    </div>
                  ))}
              </p>
            </div>
            <div>
              {flight.partners.length - 2 > 0 && (
                <div>
                  <p>{!details ? `+${flight.partners.length - 2} more` : ""}</p>
                  <Button
                    onClick={() => setDetails((prevState) => !prevState)}
                    type="link"
                    icon={!details ? <DownOutlined /> : <UpOutlined />}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flightPrice">
          <div className="flightPriceContent">
            <div className="fareSection">
              <p className="regularTitle">Regular Fare:</p>
              <p className="regularPrice">₹{flight.price}</p>
            </div>
            <p className="flightAgent">{flight.agent}</p>
          </div>
        </div>
      </div>
      {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
          className="radioInputs"
        >
          <input
            type="radio"
            name={type}
            id={type}
            style={{
              marginRight: "5px",
              height: "20px",
              width: "20px",
              verticalAlign: "middle"
            }}
            value={`${type}-${dataKey}`}
            checked={checked}
            onChange={onSelectedFlightChange}
          />

            <div style={{ width: "100%" }}>
              <div className="cardContent">
                <div
                  style={{
                    width: "75%",
                    borderRight: "1px solid #F0F0F0",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      {tags.map((tag) => (
                        <Tag color={tag.color}>{tag.name}</Tag>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div style={{ width: "48px", height: "48px" }}>
                      <img
                        src={flightImage ? flightImage : flight.companyImg}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>

                    <Space align="start" direction="vertical" style={{marginLeft:".8rem"}} size={0}>
                      <Text
                        style={{
                          fontWeight: 700,
                          fontSize: "15px",
                          color: "#013042"
                        }}
                        strong
                      >
                        {flightNames
                          .map((name) => airlineMapping[name || "AI"])
                          .join(", ")}
                      </Text>
                      <Text
                        style={{
                          fontWeight: 700,
                          fontSize: "15px",
                          color: "#013042"
                        }}
                        strong
                      >
                        {flight.schedule.departure} - {flight.schedule.arrival}
                      </Text>
                      <Text
                        ellipsis={true}
                        type="secondary"
                        style={{ color: "#4E6F7B" }}
                      >
                        {flight.route.from} - {flight.route.to}
                      </Text>
                    </Space>
                    <Text strong style={{ color: "#013042" }}>
                      {flight.connectivity}
                    </Text>
                    <Text
                      strong
                      style={{ color: "#013042", marginRight: ".8rem" }}
                    >
                      {flight.totalTime}
                    </Text>
                  </div>
                  <Space>
                    <Text type="secondary" style={{ color: "#4E6F7B" }}>
                      {flight.company}
                    </Text>
                  </Space>
                  <Space style={{ justifyContent: "space-between" }}>
                    <Space
                      size="large"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      {flight.partners.map((partner) => {
                        return Array.isArray(flight.agent)
                          ? flight.agent[0] !== partner.name && (
                              <Space>
                                <Text strong style={{ color: "#013042" }}>
                                  ₹ {partner.price}
                                </Text>
                                <Text strong style={{ color: "#013042" }}>
                                  {partner.name}
                                </Text>
                              </Space>
                            )
                          : flight.agent !== partner.name && (
                              <Space>
                                <Text strong style={{ color: "#013042" }}>
                                  ₹ {partner.price}
                                </Text>
                                <Text strong style={{ color: "#013042" }}>
                                  {partner.name}
                                </Text>
                              </Space>
                            )
                      })}
                      {details &&
                        flight.partners.length - 2 &&
                        flight.partners.slice(2).map((partner) => (
                          <Space>
                            <Text strong>₹ {partner.price}</Text>
                            <Text strong>{partner.name}</Text>
                          </Space>
                        ))}
                    </Space>
                    {flight.partners.length - 2 > 0 && (
                      <Space size={0} style={{ alignSelf: "flex-end" }}>
                        <Text>
                          {!details
                            ? `+${flight.partners.length - 2} more`
                            : ""}
                        </Text>
                        <Button
                          onClick={() => setDetails((prevState) => !prevState)}
                          type="link"
                          icon={!details ? <DownOutlined /> : <UpOutlined />}
                        />
                      </Space>
                    )}
                  </Space>
                </div>
                <div
                  style={{
                    width: "25%",
                    display: "flex",
                    flexDirection: "column",
                    marginLeft:"10px"
                  }}
                >
                  <Space>
                    <Title
                      level={5}
                      style={{
                        margin: "2px",
                        padding: "0px",
                        color: "#013042"
                      }}
                    >
                      Regular Fare: ₹{flight.price}
                    </Title>
                  </Space>
                  <Space direction="vertical" size={0} align="start">
                    <Text style={{ fontSize: "12px", color: "#4E6F7B" }}>
                      {flight.agent}
                    </Text>
                  </Space> 
                </div>
              </div>
            </div>
        </div> */}
    </div>
    // </Space>
  )
}

export default DataCard
