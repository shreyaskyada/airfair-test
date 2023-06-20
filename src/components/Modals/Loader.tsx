import React from "react";
import { Modal, Typography } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined spin />;

const Loader = () => {
  const { isLoading } = useAppSelector((state) => state.app);
  console.log("Called Loader", isLoading);
  return (
    <div>
      <Modal
        open={isLoading}
        centered
        footer={null}
        closable={false}
        zIndex={1001}
        width={"auto"}
        maskClosable={false}
        maskStyle={{ position: "absolute" }}
      >
        <Spin size="large" indicator={antIcon} />
      </Modal>
    </div>
  );
};

export default Loader;
