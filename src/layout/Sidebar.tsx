import React from "react";
import { Layout, Menu, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
      style={{
        borderRight: "1px solid #000",
        background: "#3B8BEB",
      }}
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        style={{
          background: "#3B8BEB",
          color: "#000",
        }}
        items={[
          // { icon: UserOutlined, path: "/", name: "Home" },
          { icon: UserOutlined, path: "/", name: "Flights" },
        ].map((item, index) => ({
          key: String(index + 1),
          icon: (
            <UserOutlined>
              <Link to={item.path} style={{ textDecoration: "none" }}>
                {item.name}
              </Link>
            </UserOutlined>
          ),
          label: item.name,
        }))}
      />
    </Sider>
  );
};

export default Sidebar;
