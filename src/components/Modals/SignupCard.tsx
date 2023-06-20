import React from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
} from "antd";
import { loginBanner } from "../../assets/images";
import { getFlightsConfig } from "../../services/api/urlConstants";
import backendService from "../../services/api";
import { signupUser } from "../../services/auth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleModal } from "../../redux/slices/app";

const { Text, Title } = Typography;

const SignupCard = ({ onFinishHandler }: any) => {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const dataParams = form.getFieldsValue();
    signupUser(dataParams)
      .then((res) => {
        onFinishHandler(true, dataParams);
      })
      .catch((err) => {
        onFinishHandler(false, err);
      });
  };

  const onCancelHandler = () => {
    dispatch(toggleModal({ modal: "signup", status: false }));
  };

  return (
    <div>
      <Modal
        open={true}
        centered
        footer={null}
        closable={true}
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
            Sign up
          </Title>
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            style={{
              width: "100%",
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="firstName"
              rules={[
                { required: true, message: "Please input your firstname!" },
              ]}
            >
              <Input placeholder="First name" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="lastName"
              rules={[
                { required: true, message: "Please input your lastname!" },
              ]}
            >
              <Input placeholder="Last name" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your password again!",
                },
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="userName"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="User name" />
            </Form.Item>
            <Form.Item
              name="phoneNo"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input placeholder="Phone number" />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Text type="secondary">
            By continuing you agree to Skyscanner's Terms of Service and Privacy
            Policy.
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default SignupCard;
