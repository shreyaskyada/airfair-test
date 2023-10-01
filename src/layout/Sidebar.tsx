import React from "react"
import { Layout, Menu, Typography } from "antd"
import type { MenuProps } from "antd"
import { DatabaseOutlined, RightOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { aboutUsIcon, hotelIcon, logoImage, planeIcon } from "../assets/images"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { toggleSidebar } from "../redux/slices/app"

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
    icon:  <img src={hotelIcon} alt="hotel" width={30} height={30} />,
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
        <span style={{fontSize:".8rem"}}>Coming Soon!</span>
        </div>
        <RightOutlined style={{ fontSize: 18 }} />
      </Text>
    ),
    path: ""
  },
  {
    key: "aboutus",
    icon: <img src={aboutUsIcon} width={30} height={30} alt="info" />,
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
        <span>About Us</span> <RightOutlined style={{ fontSize: 18 }} />
      </Text>
    ),
    path: "/aboutUs"
  },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const {showSidebar } = useAppSelector(
    (state) => state.app
  )
  const dispatch = useAppDispatch()

  const items: MenuProps["items"] = menuItems.map((item, index) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => {
      item.path && dispatch(toggleSidebar()) && navigate(item.path)
    }
  }))

  return (
    <div
      className={showSidebar ? "sideBarContainer" : "hideSidebar"}
    >
      <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logoImage}
            style={{ height: "60px", marginLeft: "1.3rem", marginTop: "1rem" }}
          />
        </div>
      <Menu
        mode="inline"
        items={items}
        activeKey="flights"
        style={{ border: "none", marginTop: "1rem" }}
      />
    </div>
  )
}

export default Sidebar
