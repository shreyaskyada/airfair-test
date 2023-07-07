import { useEffect, useState, useRef } from "react"
import { Form, Input, Modal, Space, Select, Button, Typography } from "antd"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { updateProfileDetails, getProfileDetails } from "../../services/auth"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { toggleModal, updateUserDetails } from "../../redux/slices/app"
import { getBankDetails, getBankName } from "../../services/airports"
import useLocalStorage from "../../hooks/LocalStorage"
import { loginBanner } from "../../assets/images"
import "./style.css"

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

const CustomDropDown = (props: any) => {
  const [bankData, setBankData] = useState<any>([])

  useEffect(() => {
    const getBankNamesFunc = async () => {
      try {
        if (props.bankName && props.cardType) {
          const bankNames = await getBankName(props.bankName, props.cardType)
          setBankData(bankNames)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getBankNamesFunc()
  }, [props.bankName, props.cardType])

  return bankData && bankData.length ? (
    <>
      {bankData.map((value: any) => (
        <option
          className="menuOptions"
          value={value.cardName}
          onClick={() => {
            props.form.setFieldValue(
              ["bankCards", props.name, "bankCardName"],
              value.cardName
            )
            props.selectRef.current.blur()
          }}
        >
          {value.cardName}
        </option>
      ))}
    </>
  ) : (
    <div>No Data</div>
  )
}

const ProfileCard = ({ onFinishHandler }: any) => {
  const dispatch = useAppDispatch()
  const [authToken] = useLocalStorage("authToken", "")
  const [userId] = useLocalStorage("userId", "")
  const selectRef = useRef<any>(null)
  const [form] = Form.useForm()

  const { notifcationModal } = useAppSelector((state: any) => state.app)

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

  useEffect(() => {
    const setUserProfileDetail = async () => {
      try {
        const res = await getUserProfileDetails()

        form.setFieldsValue({
          firstName: res.firstName || "",
          lastName: res.lastName || "",
          email: res.email || "",
          phoneNo: res.mobileNo || "",
          wallets: res.walletList,
          bankCards: res.bankList
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
      } catch (error) {
        console.log(error)
      }
    }

    setUserProfileDetail()
  }, [userId, authToken])

  const getUserProfileDetails = async () => {
    try {
      let res: any = await getProfileDetails(userId, authToken)

      const walletList = res.walletDetails.map((wallet: any) => ({
        walletName: wallet.walletName.toLowerCase(),
        walletType: wallet.walletType
      }))

      const bankList = res.bankDetails.map((bank: any) => ({
        bankCardName: bank.cardName,
        bankCardType: bank.cardType,
        bankIssuerName: bank.cardIssuer,
        bankName: bank.bankName
      }))

      res = { ...res, walletList, bankList }
      return res
    } catch (error) {
      throw error
    }
  }

  const onFinish = () => {
    const dataParams = form.getFieldsValue()

    updateProfileDetails(
      userId,
      dataParams.phoneNo,
      dataParams.email,
      dataParams.bankCards,
      dataParams.wallets,
      authToken
    )
      .then(async (res) => {
        // onFinishHandler(true, dataParams);
        const userDetail = await getUserProfileDetails()
        dispatch(updateUserDetails(userDetail))

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
              Discover the Best Flight Deals for Your Card. Select Your Card
              Information Below and Save Big!
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
                  {fields.map((field, index) => {
                    return (
                      <div
                        key={(Math.random() + 1).toString(36).substring(2)}
                        style={{
                          display: "flex",
                          margin: "1rem 0",
                          alignItems: "center"
                        }}
                      >
                        {bankDetails.names.length && (
                          <Form.Item
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
                                width: "calc(25% - 0px)"
                              }}
                              placeholder="Bank name"
                              options={bankDetails.names}
                            />
                          </Form.Item>
                        )}

                        <Form.Item
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
                              width: "calc(25% - 0px)"
                            }}
                            placeholder="Card type"
                            options={bankDetails.types}
                          />
                        </Form.Item>
                        <Form.Item
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
                              width: "calc(25% - 0px)"
                            }}
                            ref={selectRef}
                            dropdownRender={() => (
                              <CustomDropDown
                                bankName={form.getFieldValue([
                                  "bankCards",
                                  field.name,
                                  "bankName"
                                ])}
                                cardType={form.getFieldValue([
                                  "bankCards",
                                  field.name,
                                  "bankCardType"
                                ])}
                                name={field.name}
                                selectRef={selectRef}
                                form={form}
                              />
                            )}
                            placeholder="Bank card name"
                            options={bankDetails.cardNames}
                          />
                        </Form.Item>
                        <Form.Item
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
                      </div>
                    )
                  })}

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
                        key={(Math.random() + 1).toString(36).substring(2)}
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
        </div>
      </Modal>
    </div>
  )
}

export default ProfileCard
