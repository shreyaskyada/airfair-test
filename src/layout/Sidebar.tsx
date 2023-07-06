import React from "react"
import { Layout, Menu } from "antd"
import type { MenuProps } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const { Sider } = Layout

const Sidebar = () => {
  const navigate = useNavigate()

  const items: MenuProps["items"] = [UserOutlined].map((icon, index) => ({
    key: "flights",
    icon: React.createElement(icon),
    label: `Flights`,
    onClick: () => navigate("/")
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
