import React from "react";
import { Layout } from "antd";
import Homepage from "../pages/Homepage";

const { Header, Footer, Sider, Content } = Layout;

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#7EDDF1",
};

const ContentUI = () => {
  return (
    <Content style={contentStyle}>
      <div
        style={{
          margin: "40px 200px",
          //border: "1px solid black",
          borderRadius: "10px",
          color: "black",
          background: "#fff",
        }}
      >
        <Homepage />
      </div>
    </Content>
  );
};

export default ContentUI;
