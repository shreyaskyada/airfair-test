//TODO make it dynamic and move styling to css file
import React, { useState, useEffect } from "react"
import { Avatar, Button, Card, Space, Tag, Typography } from "antd"
import { DownOutlined, UpOutlined } from "@ant-design/icons"
import * as _ from "lodash"
import { airlineMapping } from "../../services/airports"
import { Airlines_Images } from "../../data/popularAirlines"
import "./DataCard.css"

const { Text, Title } = Typography

interface Props {
  checked?: boolean
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
  const { tags, flight, type, dataKey, onSelectedFlightChange, checked } = props

  const [details, setDetails] = useState(false)
  const [flightNames, setFlightNames] = useState<string[]>([])
  const [flightImage, setFlightImage] = useState<any>(null)

  useEffect(() => {
    const _names = _.uniq(
      flight.company?.split("->").map((item) => item.substring(0, 2))
    )
    console.log("names :", _names)
    setFlightNames(_names)

    if (_names.length > 1) {
      setFlightImage(Airlines_Images["Multiple Airlines"])
    } else {
      setFlightImage(Airlines_Images[airlineMapping[_names[0]]])
    }
  }, [flight])

  return (
    <Space style={{ width: "100%", marginBottom: "20px" }} direction="vertical">
      <Card
        style={{
          width: "100%",
          boxShadow: "0px 4px 4px 0px rgba(17, 17, 17, 0.1)",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        <div
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
              marginRight: "10px",
              height: "20px",
              width: "20px",
              verticalAlign: "middle"
            }}
            value={`${type}-${dataKey}`}
            checked={checked}
            onChange={onSelectedFlightChange}
          />
          <>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "70%",
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

                    <Space align="start" direction="vertical" size={0}>
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
                    width: "30%",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0px 8px"
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
                      Regular Fare: ₹ {flight.price}
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
          </>
        </div>
      </Card>
    </Space>
  )
}

export default DataCard
