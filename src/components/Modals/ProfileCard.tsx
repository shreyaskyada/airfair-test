import React, { useEffect, useState } from "react"
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
  Space,
  Select
} from "antd"
import { loginBanner } from "../../assets/images"
import { getFlightsConfig } from "../../services/api/urlConstants"
import backendService from "../../services/api"
import {
  getProfileDetails,
  signupUser,
  updateProfileDetails
} from "../../services/auth"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { toggleModal, updateUserDetails } from "../../redux/slices/app"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { getBankDetails, getBankName } from "../../services/airports"
import useLocalStorage from "../../hooks/LocalStorage"

const { Text, Title } = Typography

const walletOptions = {
  names: [
    { label: "Paytm", value: "paytm" },
    { label: "Amazon Pay", value: "amazon pay" },
    { label: "Freecharge", value: "freecharge" },
    { label: "Airtel Money", value: "airtel money" },
    { label: "Jio Money", value: "jio money" },
    { label: "Google Pay", value: "google pay" },
    { label: "Mobikwik", value: "mobikwik" },
    { label: "Payzapp", value: "payzapp" },
    { label: "Phonepe", value: "phonepe" }
  ],
  types: [
    { label: "UPI", value: "UPI" },
    { label: "Wallet", value: "Wallet" }
  ]
}

const ProfileCard = ({ onFinishHandler }: any) => {
  const dispatch = useAppDispatch()
  const [authToken, setAuthToken] = useLocalStorage("authToken", "")
  const [userId, setUserId] = useLocalStorage("userId", "")

  const { notifcationModal, userDetails } = useAppSelector(
    (state: any) => state.app
  )

  const [profileDetails, setProfileDetails] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: ""
  })

  const [bankDetails, setBankDetails] = useState({
    names: [],
    types: [
      { value: "credit", label: "credit" },
      { value: "debit", label: "debit" }
    ],
    cardNames: [],
    issuers: [
      { value: "MASTER", label: "MASTER" },
      { value: "VISA", label: "VISA" },
      { value: "RUPAY", label: "RUPAY" },
      { value: "AMEX", label: "AMEX" }
    ]
  })

  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    const dataParams = form.getFieldsValue()
    console.log(dataParams)
    updateProfileDetails(
      userId,
      dataParams.phoneNo,
      dataParams.bankCards,
      dataParams.wallets,
      authToken
    )
      .then((res) => {
        // onFinishHandler(true, dataParams);
        notifcationModal &&
          notifcationModal("success", "User profile updated successfully")
        dispatch(toggleModal({ modal: "profile", status: false }))
      })
      .catch((err) => {
        const errorMessage = err.data.message || ""
        notifcationModal && notifcationModal("error", errorMessage)
        // onFinishHandler(false, err);
      })
  }

  const onCancelHandler = () => {
    dispatch(toggleModal({ modal: "profile", status: false }))
  }

  const fetchCardName = (bankName: string, bankType: string) => {
    getBankName(bankName, bankType).then((res: any) => {
      setBankDetails((prevState) => ({
        ...prevState,
        cardNames: res
          ? res.map((item: any) => ({
              label: item.cardName,
              value: item.cardName
            }))
          : []
      }))
    })
  }

  useEffect(() => {
    if (userDetails.phone) {
      setProfileDetails({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        mobileNo: userDetails.phoneNo,
        email: userDetails.email
      })
    }

    form.setFieldsValue({
      firstName: userDetails.firstName || "",
      lastName: userDetails.lastName || "",
      email: userDetails.email || "",
      phoneNo: userDetails.phoneNo || "",
      wallets: userDetails.walletList,
      bankCards: userDetails.bankList
    })
    getBankDetails("A").then((res: any) => {
      setBankDetails((prevState) => ({
        ...prevState,
        names: res.map((item: any) => ({
          label: item.bankName,
          value: item.bankName
        }))
      }))
    })
  }, [])

  return (
    <div>
      <Modal
        open={true}
        centered
        width={800}
        footer={null}
        closable={true}
        onCancel={onCancelHandler}
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
            Complete your profile
          </Title>
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            style={{
              width: "100%"
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="firstName"
              rules={[
                { required: true, message: "Please input your firstname!" }
              ]}
            >
              <Input disabled={true} placeholder="First name" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="lastName"
              rules={[
                { required: true, message: "Please input your lastname!" }
              ]}
            >
              <Input disabled={true} placeholder="Last name" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email" }
              ]}
            >
              <Input disabled={true} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="phoneNo"
              rules={[
                { required: true, message: "Please input your phone number!" }
              ]}
            >
              <Input placeholder="Phone number" />
            </Form.Item>
            <Title level={5}>
              To know about best flight deals on your credit/debit card, please
              select your card information below
            </Title>
            <Form.List
              name="bankCards"
              //   rules={[
              //     {
              //       validator: async (_, names) => {
              //         if (!names || names.length < 2) {
              //           return Promise.reject(new Error("At least 2 passengers"));
              //         }
              //       },
              //     },
              //   ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <>
                      <Space.Compact
                        key={index + "_" + field.name}
                        style={{
                          display: "flex",
                          margin: "1rem 0",
                          alignItems: "center",
                          flexWrap: "wrap"
                        }}
                      >
                        {bankDetails.names.length && (
                          <Form.Item
                            {...field}
                            validateTrigger={["onChange", "onBlur"]}
                            name={[field.name, "bankName"]}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "Please input bank name"
                              }
                            ]}
                            style={{
                              display: "inline-block"
                            }}
                            noStyle
                          >
                            <Select
                              allowClear
                              style={{
                                marginRight: "10px",
                                marginTop: "10px",
                                width: "calc(25% - 0px)"
                              }}
                              placeholder="Bank name"
                              options={bankDetails.names}
                            />
                          </Form.Item>
                        )}

                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please input card type"
                            }
                          ]}
                          name={[field.name, "bankCardType"]}
                          style={{
                            display: "inline-block"
                          }}
                          noStyle
                        >
                          <Select
                            allowClear
                            style={{
                              marginRight: "10px",
                              marginTop: "10px",
                              width: "calc(25% - 0px)"
                            }}
                            placeholder="Card type"
                            options={bankDetails.types}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          name={[field.name, "bankCardName"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "bank's card name"
                            }
                          ]}
                          style={{
                            display: "inline-block"
                          }}
                          noStyle
                        >
                          <Select
                            allowClear
                            style={{
                              marginRight: "10px",
                              marginTop: "10px",
                              width: "calc(25% - 0px)"
                            }}
                            onClick={() => {
                              fetchCardName(
                                form.getFieldValue([
                                  "bankCards",
                                  field.name,
                                  "bankName"
                                ]),
                                form.getFieldValue([
                                  "bankCards",
                                  field.name,
                                  "bankCardType"
                                ])
                              )
                            }}
                            placeholder="Bank card name"
                            options={bankDetails.cardNames}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          name={[field.name, "bankIssuerName"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "bank issuer name"
                            }
                          ]}
                          style={{
                            display: "inline-block"
                          }}
                          noStyle
                        >
                          <Select
                            allowClear
                            style={{
                              marginRight: "10px",
                              marginTop: "10px",
                              width: "calc(25% - 0px)"
                            }}
                            placeholder="Bank issuer name"
                            options={bankDetails.issuers}
                          />
                        </Form.Item>
                        {
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => {
                              remove(index)
                              setBankDetails((prevState) => ({
                                ...prevState,
                                cardNames: []
                              }))
                            }}
                          />
                        }
                      </Space.Compact>
                    </>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "100%" }}
                      icon={<PlusOutlined />}
                    >
                      Add bank
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Title level={5}>Wallet details</Title>
            <Form.List
              name="wallets"
              //   rules={[
              //     {
              //       validator: async (_, names) => {
              //         if (!names || names.length < 2) {
              //           return Promise.reject(new Error("At least 2 passengers"));
              //         }
              //       },
              //     },
              //   ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <>
                      <Space.Compact
                        key={index + "_" + field.name}
                        style={{
                          display: "flex",
                          marginBottom: 8,
                          alignItems: "center"
                        }}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please input wallet name"
                            }
                          ]}
                          name={[field.name, "walletName"]}
                          style={{
                            display: "inline-block"
                          }}
                          noStyle
                        >
                          <Select
                            allowClear
                            style={{
                              marginRight: "10px",
                              width: "calc(50% - 0px)"
                            }}
                            placeholder="Wallet name"
                            options={walletOptions.names}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          name={[field.name, "walletType"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please input wallet type"
                            }
                          ]}
                          style={{
                            display: "inline-block"
                          }}
                          noStyle
                        >
                          <Select
                            allowClear
                            style={{
                              marginRight: "10px",
                              width: "calc(50% - 0px)"
                            }}
                            placeholder="Wallet type"
                            options={walletOptions.types}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      </Space.Compact>
                    </>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "100%" }}
                      icon={<PlusOutlined />}
                    >
                      Add wallet
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            {/* <Form.Item name="wallets">
              <div style={{ display: "flex" }}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ marginRight: "10px" }}
                  placeholder="Please select wallet name"
                  options={walletOptions.names}
                />
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Please select wallet type"
                  options={walletOptions.types}
                />
              </div>
            </Form.Item> */}
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
  )
}

export default ProfileCard
