//TODO make it dynamic and move styling to css file
import React, { useState } from "react";
import { Avatar, Button, Card, Space, Tag, Typography, Popover } from "antd";
import {
  HeartOutlined,
  UserOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import * as _ from "lodash";

import { Radio } from "antd";

import "./DataCard.css";
import { airlineMapping } from "../../services/airports";
import { arrayBuffer } from "node:stream/consumers";

const { Text, Title } = Typography;

interface Props {
  checked?:boolean
  index: number;
  dataKey: number;
  type: string;
  selectedKey: string;
  onSelectedFlightChange: any;
  tags: {
    color: string;
    name: string;
  }[];
  flight: {
    connectivity: string;
    agent: string;
    type: string;
    company: string;
    companyImg: string;
    price: string;
    totalTime: string;
    schedule: {
      departure: string;
      arrival: string;
    };
    route: {
      from: string;
      to: string;
    };
    partners: {
      price: string;
      name: string;
    }[];
  };
  onLikeClick?: () => void;
  onViewDealClick?: () => void;
}

const DataCard = (props: Props) => {
  const {
    tags,
    flight,
    type,
    dataKey,
    selectedKey,
    onLikeClick,
    onViewDealClick,
    onSelectedFlightChange,
    checked
  } = props;

  const cardPopoverData = {
    content: (
      <>
        <div>
          <span>Ticket price:</span> <span>1000</span>
        </div>
        <div>
          <span>Payment fee:</span> <span>100</span>
        </div>
        <br />
        <div>
          <span>Total price:</span> <span>1100</span>
        </div>
      </>
    ),
    title: "Price breakdown",
    trigger: "hover",
    placement: "topLeft",
  };

  const [details, setDetails] = useState(false);
  return (
    <Space style={{ width: "100%", marginBottom: "20px" }} direction="vertical">
      <Card style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="radio"
            name={type}
            id={type}
            style={{
              marginRight: "10px",
              height: "20px",
              width: "20px",
              verticalAlign: "middle",
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
                    width: "75%",
                    borderRight: "1px solid rgba(167, 98, 234, 0.4)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      {tags.map((tag) => (
                        <Tag color={tag.color}>{tag.name}</Tag>
                      ))}
                    </div>
                    {/* <Button
                      onClick={onLikeClick}
                      type="link"
                      icon={<HeartOutlined />}
                    /> */}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Avatar size={40} src={flight.companyImg} />
                    <Space align="start" direction="vertical" size={0}>
                      <Text
                        style={{ fontWeight: 700, fontSize: "15px" }}
                        strong
                      >
                        {_.uniq(
                          flight.company
                            ?.split("->")
                            .map((item) => item.substring(0, 2))
                        )
                          .map((name) => airlineMapping[name || "AI"])
                          .join(", ")}
                      </Text>
                      <Text
                        style={{ fontWeight: 700, fontSize: "15px" }}
                        strong
                      >
                        {flight.schedule.departure} - {flight.schedule.arrival}
                      </Text>
                      <Text ellipsis={true} type="secondary">
                        {flight.route.from} - {flight.route.to}
                      </Text>
                    </Space>
                    <Text strong>{flight.connectivity}</Text>
                    <Text strong>{flight.totalTime}</Text>
                  </div>
                  <Space>
                    <Text type="secondary">{flight.company}</Text>
                  </Space>
                  <Space style={{ justifyContent: "space-between" }}>
                    <Space
                      size="large"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {flight.partners.map((partner) => {
                        return (
                          Array.isArray(flight.agent) ? flight.agent[0] !== partner.name && (
                            <Space>
                              <Text strong>₹ {partner.price}</Text>
                              <Text strong>{partner.name}</Text>
                            </Space>
                          ): flight.agent !== partner.name && (
                            <Space>
                              <Text strong>₹ {partner.price}</Text>
                              <Text strong>{partner.name}</Text>
                            </Space>
                        ))
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
                    padding: "0px 8px",
                  }}
                >
                  <Space>

                    <Title level={5} style={{ margin: "2px", padding: "0px" }}>
                      Regular Fare : 
                      ₹ {flight.price}
                    </Title>
                  </Space>
                  <Space direction="vertical" size={0} align="start">
                    {/* <Text style={{ fontSize: "12px" }}>{flight.type}</Text> */}
                    <Text style={{ fontSize: "12px" }}>{flight.agent}</Text>
                  </Space>
                  {/* <Button
                    onClick={onViewDealClick}
                    style={{ backgroundColor: "#15986D", color: "#fff" }}
                    size="large"
                  >
                    View Deal
                  </Button> */}
                </div>
              </div>
            </div>
          </>
        </div>
      </Card>
    </Space>
  );
};

export default DataCard;
