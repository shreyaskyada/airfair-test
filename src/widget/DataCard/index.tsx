import React, { useState, useEffect } from "react"
import { Button, Card, Space, Tag } from "antd"
import { DownOutlined, UpOutlined } from "@ant-design/icons"
import * as _ from "lodash"
import { airlineMapping } from "../../services/airports"
import { Airlines_Images } from "../../data/popularAirlines"
import "./DataCard.css"

interface Props {
  checked?: boolean
  departCode?: string
  currentCode?: string
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
  const {
    tags,
    flight,
    type,
    dataKey,
    onSelectedFlightChange,
    checked,
    currentCode,
    departCode
  } = props

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
    <div className="detailCard">
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
              <div className="tagContainer">
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
    </div>
  )
}

export default DataCard
