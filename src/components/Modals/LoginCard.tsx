import React, { useState } from "react"
import { Button, Card, Divider, Form, Input, Modal, Typography } from "antd"
import Meta from "antd/es/card/Meta"
import { loginBanner } from "../../assets/images"
import { toggleModal } from "../../redux/slices/app"
import { useAppDispatch } from "../../redux/hooks"
import { loginUser } from "../../services/auth"
import { notification } from "../Notification/customNotification"

const { Text, Title } = Typography

const LoginCard = ({ onFinishHandler }: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    if (!isLoading) {
      setIsLoading(true)
      const dataParams = form.getFieldsValue()
      loginUser(dataParams)
        .then((res) => {
        onFinishHandler(true, { ...res, username: dataParams.username })
        notification.success({ message: "LoggedIn Successfully!!!" })
        })
        .catch((err) => {
          onFinishHandler(false, err)
          notification.error({ message: err.data.message || "Server Error" })
        })
        .finally(() => {
          setIsLoading(false)
        });
    }
  }

  const onCancelHandler = () => {
    dispatch(toggleModal({ modal: "login", status: false }))
  }

  const handleSignupModal = () => {
    dispatch(toggleModal({ modal: "signup", status: true }))
    dispatch(toggleModal({ modal: "login", status: false }))
  }

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
            flexDirection: "column"
          }}
        >
          <img src={loginBanner} alt="Login banner" />
          <Text
            style={{
              font: "Robotto",
              textAlign: "center",
              margin: "1rem 0",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#013042"
            }}
          >
            Unlock exclusive deals tailored to you! Log in to access
            personalized best deals now.
          </Text>

          <Form
            name="basic"
            initialValues={{ remember: true }}
            style={{
              width: "100%"
            }}
            form={form}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" }
              ]}
            >
              <Input placeholder="username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" }
              ]}
            >
              <Input.Password placeholder="password" />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" disabled={isLoading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Divider style={{ backgroundColor: "#F0F0F0", margin: "0" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: ".8rem",
            marginTop: "1rem"
          }}
        >
          <Text>Don't have an Account with Tripsaverz?</Text>
          <button
            className="headerButtons filled"
            style={{ width: "150px" }}
            onClick={handleSignupModal}
          >
            Create new account
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default LoginCard
