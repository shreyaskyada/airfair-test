import { useEffect, useState } from "react"
import { Button, Form, Input, Modal, Typography } from "antd"
import { verifyToken } from "../../services/auth"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { toggleModal, uploadIsLoading } from "../../redux/slices/app"
import { notification } from "../Notification/customNotification"
import { sendOTPConfig } from "../../services/api/urlConstants"
import backendService from "../../services/api"
import { loginBanner } from "../../assets/images"

const { Text, Title } = Typography

const VerifyTokenCard = () => {
  const dispatch = useAppDispatch()

  const [disabled, setDisabled] = useState(true)
  const [countdown, setCountdown] = useState(30)

  const { userDetails } = useAppSelector((state) => state.app)

  const [form] = Form.useForm()

  useEffect(() => {
    let timer: any

    if (countdown > 0 && disabled) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)
    }

    if (countdown === 0 && disabled) {
      setDisabled(false)
    }

    return () => clearTimeout(timer)
  }, [countdown, disabled])

  const onFinish = (values: any) => {
    const dataParams = form.getFieldsValue()
    verifyToken(dataParams.otp, userDetails.userName || "")
      .then((res) => {
        notification.success({ message: "Account Registered Successfully" })
        dispatch(toggleModal({ modal: "otp", status: false }))
      })
      .catch((err) => {
        const errorMessage = err.data.message || "server error"
        notification.error({ message: errorMessage })
      })
  }

  const onCancelHandler = () => {
    dispatch(toggleModal({ modal: "otp", status: false }))
  }

  const handleResendOTP = async () => {
    dispatch(uploadIsLoading(true))
    const config = sendOTPConfig(userDetails.userName || "")
    return backendService
      .request(config)
      .then((res) => {
        dispatch(uploadIsLoading(false))
        notification.success({ message: "OTP Resent!!!" })
        setDisabled(true)
        setCountdown(30)
      })
      .catch((err) => {
        dispatch(uploadIsLoading(false))
        console.error(err)
        const errorMessage = err.data.message || "unexpected error"
        notification.error({ message: errorMessage })
      })
  }

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
            flexDirection: "column"
          }}
        >
          <img src={loginBanner} alt="Login banner" loading="lazy" />
          <Title level={3} style={{ font: "Robotto" }}>
            Verify OTP
          </Title>
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            style={{
              width: "100%"
            }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Text>
              Dear user, please enter the OTP (One-Time Password) received on
              your email.
            </Text>
            <Form.Item
              style={{ margin: "10px 0" }}
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
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: ".2rem"
          }}
        >
          <Text>
            00:{countdown < 10 && "0"}
            {countdown}
          </Text>
          <Button
            type="text"
            style={{ color: "#013042", fontWeight: 600 }}
            onClick={handleResendOTP}
            disabled={disabled}
          >
            Resend OTP
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default VerifyTokenCard
