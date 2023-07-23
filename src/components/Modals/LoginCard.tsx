import React from "react";
import { Button, Card, Form, Input, Modal, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import { loginBanner } from "../../assets/images";
import { toggleModal } from "../../redux/slices/app";
import { useAppDispatch } from "../../redux/hooks";
import { loginUser } from "../../services/auth";
import { notification } from "../Notification/customNotification"

const { Text, Title } = Typography;

const LoginCard = ({ onFinishHandler }: any) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const dataParams = form.getFieldsValue();
    loginUser(dataParams)
      .then((res) => {
        onFinishHandler(true, { ...res, username: dataParams.username });
        notification.success({message:"LoggedIn Successfully!!!"})
      })
      .catch((err) => {
        onFinishHandler(false, err);
        notification.error({message:err.data.message || "Server Error"})
      });
  };

  const onCancelHandler = () => {
    dispatch(toggleModal({ modal: "login", status: false }));
  };

  return (
    <div>
      <Modal
        open={true}
        centered
        footer={null}
        closable={true}
        zIndex={1003}
        onCancel={onCancelHandler}
        width="350px"
      >
        <div
          style={{
            padding: "40px 10px 10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img src={loginBanner} alt="Login banner" />
          <Title level={3} style={{ font: "Robotto" }}>
            Log in
          </Title>

          <Form
            name="basic"
            initialValues={{ remember: true }}
            style={{
              width: "100%",
            }}
            form={form}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default LoginCard;
