import { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Modal,
  Space,
  Select,
  Button,
  Typography,
  Grid,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { updateProfileDetails, getProfileDetails } from "../../services/auth";
import { useAppDispatch } from "../../redux/hooks";
import { toggleModal, updateUserDetails } from "../../redux/slices/app";
import { getBankDetails, getBankName } from "../../services/airports";
import useLocalStorage from "../../hooks/LocalStorage";
import { notification } from "../Notification/customNotification";
import "./style.css";
import { useWatch } from "antd/es/form/Form";
import { loginBanner } from "../../assets/images";

const { Title } = Typography;
const { useBreakpoint } = Grid;

function comapreProfileDetail(obj1: any, obj2: any) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        return false;
      }
    } else if (
      typeof value1 === "object" &&
      value1 !== null &&
      typeof value2 === "object" &&
      value2 !== null
    ) {
      if (!comapreProfileDetail(value1, value2)) {
        return false;
      }
    } else if (value1 !== value2) {
      return false;
    }
  }

  return true;
}

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
    { label: "Phonepe", value: "phonepe" },
  ],
  types: [
    { label: "UPI", value: "UPI" },
    { label: "Wallet", value: "Wallet" },
  ],
};

const CustomDropDown = (props: any) => {
  const [bankData, setBankData] = useState<any>([]);
  const bankName = useWatch(["bankCards", props.name, "bankName"]);
  const cardType = useWatch(["bankCards", props.name, "bankCardType"]);

  useEffect(() => {
    const getBankNamesFunc = async () => {
      try {
        if (bankName && cardType) {
          const bankNames: any = await getBankName(bankName, cardType);

          setBankData(
            bankNames.map((bankName: any) => {
              return {
                value: bankName.cardName,
                label: bankName.cardName,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
        setBankData([]);
      }
    };
    getBankNamesFunc();
  }, [bankName, cardType]);

  return (
    <Select
      allowClear
      defaultValue={props.form.getFieldValue([
        "bankCards",
        props.name,
        "bankCardName",
      ])}
      onChange={(value) => {
        props.form.setFieldValue(
          ["bankCards", props.name, "bankCardName"],
          value
        );
        props.observeFormChange();
      }}
      placeholder="Card Name"
      options={bankData}
    />
  );
};

const ProfileCard = ({ onFinishHandler }: any) => {
  const [form] = Form.useForm();
  const screen = useBreakpoint();
  const dispatch = useAppDispatch();
  const selectRef = useRef<any>(null);

  const [authToken] = useLocalStorage("authToken", "");
  const [userId] = useLocalStorage("userId", "");

  const [userDetails, setUserDetails] = useState<any>({});
  const [disableSubmit, setDisableSubmit] = useState(true);

  const [bankDetails, setBankDetails] = useState({
    names: [],
    types: [
      { value: "credit", label: "Credit" },
      { value: "debit", label: "Debit" },
    ],
    cardNames: [],
    issuers: [
      { value: "MASTER", label: "MASTER" },
      { value: "VISA", label: "VISA" },
      { value: "RUPAY", label: "RUPAY" },
      { value: "AMEX", label: "AMEX" },
      { value: "DINERS", label: "DINERS" },
    ],
  });

  useEffect(() => {
    const setUserProfileDetail = async () => {
      try {
        const res = await getUserProfileDetails();

        setUserDetails({
          firstName: res.firstName || "",
          lastName: res.lastName || "",
          email: res.email || "",
          phoneNo: res.mobileNo || "",
          wallets: res.walletList,
          bankCards: res.bankList,
        });

        form.setFieldsValue({
          firstName: res.firstName || "",
          lastName: res.lastName || "",
          email: res.email || "",
          phoneNo: res.mobileNo || "",
          wallets: res.walletList,
          bankCards: res.bankList,
        });

        getBankDetails("A").then((res: any) => {
          setBankDetails((prevState) => ({
            ...prevState,
            names: res.map((item: any) => ({
              label: item.bankName,
              value: item.bankName,
            })),
          }));
        });
      } catch (error) {
        console.log(error);
      }
    };

    setUserProfileDetail();
  }, [userId, authToken]);

  const getUserProfileDetails = async () => {
    try {
      let res: any = await getProfileDetails(userId, authToken);

      const walletList = res.walletDetails.map((wallet: any) => ({
        walletName: wallet.walletName.toLowerCase(),
        walletType: wallet.walletType,
      }));

      const bankList = res.bankDetails.map((bank: any) => ({
        bankCardName: bank.cardName,
        bankCardType: bank.cardType,
        bankIssuerName: bank.cardIssuer,
        bankName: bank.bankName,
      }));

      res = { ...res, walletList, bankList };
      return res;
    } catch (error) {
      throw error;
    }
  };

  const onFinish = () => {
    setDisableSubmit(true);
    const dataParams = form.getFieldsValue();

    updateProfileDetails(
      userId,
      dataParams.phoneNo,
      dataParams.email,
      dataParams.bankCards,
      dataParams.wallets,
      authToken
    )
      .then(async (res) => {
        const userDetail = await getUserProfileDetails();
        dispatch(updateUserDetails(userDetail));

        notification.success({ message: "User profile updated successfully" });
        dispatch(toggleModal({ modal: "profile", status: false }));
      })
      .catch((err) => {
        const errorMessage = err.data.message || "";
        notification.error({ message: errorMessage });
      })
      .finally(() => {
        setDisableSubmit(false);
      });
  };

  const onCancelHandler = () => {
    dispatch(toggleModal({ modal: "profile", status: false }));
  };

  const observeFormChange = () => {
    try {
      const newUserDetails = form.getFieldsValue();

      if (!comapreProfileDetail(newUserDetails, userDetails)) {
        setDisableSubmit(false);
      } else {
        setDisableSubmit(true);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: ProfileCard.tsx:300 ~ observeFormChange ~ error:",
        error
      );
    }
  };

  return (
    <div>
      <Modal
        open={true}
        centered
        width={screen.lg ? 800 : "100%"}
        footer={null}
        closable={true}
        zIndex={1003}
        onCancel={onCancelHandler}
        className="profileModal"
      >
        <div className="profileModalContent">
          <img src={loginBanner} alt="Login banner" loading="lazy" />
          <Title level={3} style={{ font: "Robotto" }}>
            Complete your profile
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
              <Input
                disabled={true}
                placeholder="First name"
                onChange={observeFormChange}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="lastName"
              rules={[
                { required: true, message: "Please input your lastname!" },
              ]}
            >
              <Input
                disabled={true}
                placeholder="Last name"
                onChange={observeFormChange}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email" },
              ]}
            >
              <Input
                disabled={true}
                placeholder="Email"
                onChange={observeFormChange}
              />
            </Form.Item>
            <Form.Item
              name="phoneNo"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input
                disabled
                placeholder="Phone number"
                onChange={observeFormChange}
              />
            </Form.Item>
            <Title level={5}>
              Discover the Best Flight Deals for your card. Select your card
              Information Below and Save Big!
            </Title>
            <Form.List name="bankCards">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => {
                    return (
                      <div
                        key={(Math.random() + 1).toString(36).substring(2)}
                        className="formListItem"
                      >
                        {bankDetails.names.length && (
                          <Form.Item
                            validateTrigger={["onChange", "onBlur"]}
                            name={[field.name, "bankName"]}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "Please input bank name",
                              },
                            ]}
                            className="bankName"
                            noStyle
                            style={{ width: "100%" }}
                          >
                            <Select
                              allowClear
                              placeholder="Bank Name"
                              options={bankDetails.names}
                              onChange={observeFormChange}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        )}

                        <Form.Item
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please input card type",
                            },
                          ]}
                          name={[field.name, "bankCardType"]}
                          className="cardType"
                          noStyle
                        >
                          <Select
                            allowClear
                            placeholder="Card Type"
                            options={bankDetails.types}
                            onChange={observeFormChange}
                          />
                        </Form.Item>
                        <Form.Item
                          validateTrigger={["onChange", "onBlur"]}
                          name={[field.name, "bankCardName"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "bank's card name",
                            },
                          ]}
                          className="bankCardName"
                          noStyle
                        >
                          <CustomDropDown
                            observeFormChange={observeFormChange}
                            name={field.name}
                            form={form}
                          />
                        </Form.Item>
                        <Form.Item
                          validateTrigger={["onChange", "onBlur"]}
                          name={[field.name, "bankIssuerName"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "issuer name",
                            },
                          ]}
                          className="bankIssuerName"
                          noStyle
                        >
                          <Select
                            allowClear
                            placeholder="Issuer Name"
                            options={bankDetails.issuers}
                            onChange={observeFormChange}
                          />
                        </Form.Item>
                        <div className="removeButton">
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            style={{ fontSize: 20 }}
                            onClick={() => {
                              remove(index);
                              setBankDetails((prevState) => ({
                                ...prevState,
                                cardNames: [],
                              }));
                              observeFormChange();
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "100%" }}
                      icon={<PlusOutlined />}
                    >
                      Add Card
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Title level={5}>Wallet details</Title>
            <Form.List name="wallets">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                      <Space.Compact
                        key={(Math.random() + 1).toString(36).substring(2)}
                        style={{
                          display: "flex",
                          marginBottom: 8,
                          alignItems: "center",
                        }}
                      >
                        <Form.Item
                          {...field}
                          key={(Math.random() + 1).toString(36).substring(2)}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please input wallet name",
                            },
                          ]}
                          name={[field.name, "walletName"]}
                          style={{
                            display: "inline-block",
                          }}
                          noStyle
                        >
                          <Select
                            allowClear
                            style={{
                              marginRight: "10px",
                              width: "calc(50% - 0px)",
                            }}
                            placeholder="Wallet name"
                            options={walletOptions.names}
                            onChange={observeFormChange}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          key={(Math.random() + 1).toString(36).substring(2)}
                          validateTrigger={["onChange", "onBlur"]}
                          name={[field.name, "walletType"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please input wallet type",
                            },
                          ]}
                          style={{
                            display: "inline-block",
                          }}
                          noStyle
                        >
                          <Select
                            allowClear
                            style={{
                              marginRight: "10px",
                              width: "calc(50% - 0px)",
                            }}
                            placeholder="Wallet type"
                            options={walletOptions.types}
                            onChange={observeFormChange}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => {
                            remove(field.name);
                            observeFormChange();
                          }}
                        />
                      </Space.Compact>
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
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" disabled={disableSubmit}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileCard;
