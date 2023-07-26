import React from "react";
import { Modal, Typography } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined spin style={{color:"#DBAE1E"}}/>;

const Loader = () => {
  const { isLoading } = useAppSelector((state) => state.app);
  
  return (
      <Modal
        open={isLoading}
        centered
        footer={null}
        closable={false}
        zIndex={2000}
        width={"auto"}
        maskClosable={false}
      >
        <Spin size="large" indicator={antIcon} />
      </Modal>
  );
};

export default Loader;
