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
import { verifyToken } from "../../services/auth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleModal } from "../../redux/slices/app";

const { Text, Title } = Typography;

const VerifyTokenCard = () => {
  const dispatch = useAppDispatch();
  const { userDetails, notifcationModal } = useAppSelector(
    (state) => state.app
  );
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const dataParams = form.getFieldsValue();
    console.log(dataParams);
    verifyToken(dataParams.otp, userDetails.userName || "")
      .then((res) => {
        notifcationModal &&
          notifcationModal("success", "OTP verified successfully");
        dispatch(toggleModal({ modal: "otp", status: false }));
      })
      .catch((err) => {
        const errorMessage = err.data.message || "";
        notifcationModal && notifcationModal("error", errorMessage);
      });
  };

  const onCancelHandler = () => {
    dispatch(toggleModal({ modal: "otp", status: false }));
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
            Verify OTP
          </Title>
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            style={{
              width: "100%",
            }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="otp"
              rules={[{ required: true, message: "Please input your otp!" }]}
            >
              <Input placeholder="OTP" />
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

export default VerifyTokenCard;
