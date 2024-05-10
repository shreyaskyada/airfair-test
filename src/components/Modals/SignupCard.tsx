import React, { useState } from "react"
import { Button, Form, Input, Modal, Typography } from "antd"
import { loginBanner } from "../../assets/images"
import { signupUser } from "../../services/auth"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { toggleModal } from "../../redux/slices/app"
import { uploadIsLoading } from "../../redux/slices/app"
import { notification } from "../Notification/customNotification"
import { Link } from "react-router-dom"
import PhoneInput from 'react-phone-input-2'
import validator from 'validator';
import 'react-phone-input-2/lib/style.css'

const { Title } = Typography

const SignupCard = ({ onFinishHandler }: any) => {
  const[countryCode,setCountryCode]= useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useAppDispatch() 
  const isLoading = useAppSelector((state) => state.app.isLoading)

  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    const phone = form.getFieldsValue().phoneNo;
    const country_code = phone.substring(0,countryCode.length)
    const phone_number =  phone.substring(countryCode.length);
    form.setFieldValue("phoneNo",`${country_code}-${phone_number}`);
    
    if(!isLoading) {
      const dataParams = form.getFieldsValue()
      dispatch(uploadIsLoading(true))
      signupUser(dataParams)
        .then((res) => {
          onFinishHandler(true, dataParams)
          dispatch(uploadIsLoading(false))
        })
        .catch((err) => {
          const message = err.data.message || "Server Error"
          notification.error({ message })
  
          onFinishHandler(false, err)
          dispatch(uploadIsLoading(false))
        })
    }
  }

  const onCancelHandler = () => {
    dispatch(toggleModal({ modal: "signup", status: false }))
  }

  const handlePhoneNumberChange = (value: string, data: { dialCode: string }) => {
    setCountryCode(data.dialCode);

    form.setFieldValue("phoneNo",data.dialCode === countryCode ?  value : data.dialCode)
  };

  const phoneValidator = (rule:any, value:any, callback:any) => {
    if(!validator.isMobilePhone(`+${value}`)){
      callback("Enter a valid number")
    } else{
      callback();
    }
  };

  const usernameValidator = (rule:any, value:any, callback:any) => {
    if (value && value.length < 8) {
      callback('Username must be at least 8 characters');
    } else {
      callback();
    }
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
        zIndex={3003}
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
          <Title level={3} style={{ font: "Robotto" }}>
            Sign up
          </Title>
          <Form
           autoComplete="off"
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            style={{
              width: "100%"
            }}
            onFinish={onFinish}
           
          
          >
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="firstName"
              rules={[
                { required: true, message: "Please input your firstname!" }
              ]}
            >
              <Input placeholder="First name" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="lastName"
              rules={[
                { required: true, message: "Please input your lastname!" }
              ]}
            >
              <Input placeholder="Last name" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email" }
              ]}
            >
              <Input placeholder="Email"/>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="userName"
              rules={[
                { required: true, message: "Please input your username!" },
              
                {
                  validator: usernameValidator,
                },
              
              ]}
            >
              <Input placeholder="User name" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" }
              ]}
            >
              <Input.Password placeholder="Password" autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your password again!"
                }
              ]}
            >
              <Input.Password placeholder="Confirm password"/>
            </Form.Item>
            <Form.Item
              name="phoneNo"
              rules={[
                { required: true, message: "Please input your phone number!" },
                {
                  validator: phoneValidator,
                },
              ]}
            >
              <PhoneInput
                country={"in"}                
                onChange={handlePhoneNumberChange}
                inputStyle={{width:"100%",height:"31.6px",border: isFocused ? '1px solid #4096ff' : "" , boxShadow: isFocused ? "0 0 0 2px rgba(5, 145, 255, 0.1)" : ""}}
                buttonStyle={{border: isFocused ? '1px solid #4096ff' : ""}}
                dropdownStyle={{bottom:"35px", width:"282px"}}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
               />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" disabled={isLoading}>
                Submit
              </Button>
            </Form.Item>
          </Form>

          <small>
            By cliking submit, you agree to our{' '}
            <Link target='_blank' to='/terms-and-conditions'>Terms of Use</Link> and{' '}
            <Link target='_blank' to='/privacy-policy'>Privacy Policy</Link>.
          </small>
        </div>
      </Modal>
    </div>
  )
}

export default SignupCard
