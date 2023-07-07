import React from "react"
import { Layout, Menu, Typography } from "antd"
import type { MenuProps } from "antd"
import { DatabaseOutlined, RightOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { planeIcon } from "../assets/images"

const { Sider } = Layout
const { Text } = Typography

const menuItems = [
  {
    key: "flights",
    icon: <img src={planeIcon} alt="plane" />,
    label: (
      <Text
        style={{
          fontSize: "1rem",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <span>Flights</span> <RightOutlined style={{ fontSize: 18 }} />
      </Text>
    ),
    path: "/"
  },
  {
    key: "hotels",
    icon: <DatabaseOutlined style={{ fontSize: 20, color: "white" }} />,
    label: (
      <Text
        style={{
          fontSize: "1rem",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{display:"flex",flexDirection:"column"}}>
        <span>Hotels</span>
        <span>Comming Soon</span>
        </div>
        <RightOutlined style={{ fontSize: 18 }} />
      </Text>
    ),
    path: ""
  }
]

const Sidebar = () => {
  const navigate = useNavigate()

  const items: MenuProps["items"] = menuItems.map((item, index) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => {
      item.path && navigate(item.path)
    }
  }))

  return (
    <Sider
      className="sideBarContainer"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: "white"
      }}
    >
      <Menu
        mode="inline"
        items={items}
        activeKey="flights"
        style={{ border: "none", marginTop: "110px" }}
      />
    </Sider>
  )
}

export default Sidebar
