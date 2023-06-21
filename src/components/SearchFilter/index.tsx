import { useEffect, useState } from "react"
import dayjs from "dayjs"
import _ from "lodash"
import moment from "moment"

import {
  Form,
  Input,
  Radio,
  DatePicker,
  Typography,
  Space,
  Card,
  Segmented
} from "antd"

import { RangePickerProps } from "antd/es/date-picker"
import { AutoComplete, Popover, Button } from "antd"
import { getAirportsWrapper } from "../../services/airports"
import { getFlightsConfig } from "../../services/api/urlConstants"
import backendService from "../../services/api"
import {
  updateDepartFlights,
  updateFlights,
  updateReturnFlights
} from "../../redux/slices/flights"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { useNavigate } from "react-router"
import { uploadIsLoading } from "../../redux/slices/app"
import { updateOriginFlights } from "../../redux/slices/originFlight"
import { updateDestinationFlights } from "../../redux/slices/destinationFlight"

const { TextArea } = Input
const { Title, Text } = Typography

const options = [
  { value: "Burns Bay Road" },
  { value: "Downing Street" },
  { value: "Wall Street" }
]

const seatTypes = [
  { label: "Economy/Premium Economy", value: "ECONOMY" },
  { label: "Premium Economy", value: "PREMIUM_ECONOMY" },
  { label: "Business", value: "BUSINESS" },
  { label: "First Class", value: "FIRST_CLASS" }
]

const initialValues = {
  from: {
    code: "DEL",
    city: "New Delhi",
    name: "Indira Gandhi International Airport"
  },
  to: { code: "BOM", city: "Mumbai", name: "C S M International Airport" },
  type: "one-way",
  departure: dayjs(),
  return: dayjs(),
  adult: 1,
  child: 0,
  infant: 0,
  class: "ECONOMY"
}

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().subtract(1, "day").endOf("day")
}

function compareArrays(array1: any, array2: any) {
  if (array1.length !== array2.length) {
    return false
  }

  const sortedArray1 = array1.slice().sort()
  const sortedArray2 = array2.slice().sort()

  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false
    }
  }

  return true
}

const SearchFilter = ({ redirectRoute = "" }: { redirectRoute: string }) => {
  const navigate = useNavigate()

  const { userDetails } = useAppSelector((state) => state.app)
  const [form] = Form.useForm()
  const [inputValues, setInputValues] = useState(initialValues)
  const [fromOptions, setFromOptions] = useState([])
  const [toOptions, setToOptions] = useState([])
  const [showInput, setShowInput] = useState({
    from: false,
    to: false,
    departure: false,
    return: false,
    travellers: false
  })
  const [formValues, setFormValues] = useState({
    from: "",
    to: ""
  })
  const dispatch = useAppDispatch()

  const segmentAdultValues = Array(9)
    .fill(0)
    .map((_, i) => ({ label: i + 1, value: i + 1 }))
  const segmentOtherValues = Array(6)
    .fill(0)
    .map((_, i) => ({ label: i, value: i }))

  const onFinish = (params: any) => {
    dispatch(uploadIsLoading(true))
    const values = inputValues
    const isRoundTrip = values.type === "round-trip"
    let data: any = {}
    data.from = values.from.code
    data.to = values.to.code
    data.doj = moment(values.departure.toString()).format("DDMMYYYY")
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isRoundTrip
      ? (data.doa = moment(values.return.toString()).format("DDMMYYYY"))
      : null
    data.adults = values.adult
    data.children = values.child
    data.infants = values.infant
    data.roundtrip = isRoundTrip ? true : false
    data.seatingClass = values.class
    data.bankList = userDetails.bankList
    data.walletList = userDetails.walletList

    const config = getFlightsConfig(data)
    backendService
      .request(config)
      .then((res: any) => {
        dispatch(updateFlights(res))
        dispatch(updateOriginFlights(res.flightCompareResponse))

        const departProviders = Object.keys(
          res.flightCompareResponse[0].compare || {}
        )
        const flightsToFilter = res.returnJourneyCompareResponse || []

        let data = flightsToFilter.filter((value: any) => {
          let providers = Object.keys(value.compare)
          return compareArrays(departProviders, providers)
        })

        dispatch(updateDestinationFlights(data))
        dispatch(uploadIsLoading(false))

        dispatch(updateDepartFlights(res.flightCompareResponse[0]))

        isRoundTrip
          ? dispatch(updateReturnFlights(data[0]))
          : dispatch(updateReturnFlights({}))
        redirectRoute && navigate(redirectRoute)
      })
      .catch((err) => console.error(err))
  }

  const fromLocationSearchHandler = (value: string) => {
    const [airportCode, airportCity, airportName] = value.split("-")
    setInputValues((prevState) => ({
      ...prevState,
      from: { code: airportCode, city: airportCity, name: airportName }
    }))
    setFormValues((prevState) => ({
      ...prevState,
      from: value
    }))
  }

  const toLocationSearchHandler = (value: string) => {
    const [airportCode, airportCity, airportName] = value.split("-")
    setInputValues((prevState) => ({
      ...prevState,
      to: { code: airportCode, city: airportCity, name: airportName }
    }))
    setFormValues((prevState) => ({
      ...prevState,
      to: value
    }))
  }

  const textAreaClearHandler = (updatedValues: any) => {
    setShowInput((prevState) => ({ ...prevState, ...updatedValues }))
  }

  useEffect(() => {
    if (showInput.from) {
      getAirportsWrapper(inputValues.from.code)
        .then((data: any) => {
          const airports = data.airportList?.map((airport: any) => ({
            value: `${airport.airportCd}-${airport.city}-${airport.airportName}`
          }))
          setFromOptions(airports)
        })
        .catch((err) => console.error(err))
    }
  }, [inputValues.from])

  useEffect(() => {
    if (showInput.from) {
      let check = _.includes(
        _.map(fromOptions, (ele) => _.get(ele, "value")),
        formValues.from
      )
      if (check) {
        textAreaClearHandler({ from: false })
      }
    }
  }, [inputValues.from])

  useEffect(() => {
    if (showInput.to) {
      getAirportsWrapper(inputValues.to.code)
        .then((data: any) => {
          const airports = data.airportList?.map((airport: any) => ({
            value: `${airport.airportCd}-${airport.city}-${airport.airportName}`
          }))
          setToOptions(airports)
        })
        .catch((err) => console.error(err))
    }
  }, [inputValues.to])

  useEffect(() => {
    if (showInput.to) {
      let check = _.includes(
        _.map(toOptions, (ele) => _.get(ele, "value")),
        formValues.to
      )
      if (check) {
        textAreaClearHandler({ to: false })
      }
    }
  }, [inputValues.to])

  useEffect(() => {
    if (showInput.departure) {
      textAreaClearHandler({ departure: false })
    }
  }, [inputValues.departure])

  useEffect(() => {
    if (showInput.return) {
      textAreaClearHandler({ return: false })
    }
  }, [inputValues.return])

  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "10px",
        color: "black",
        background: "#C4DBF6"
      }}
    >
      <Form form={form} onFinish={onFinish} initialValues={initialValues}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            margin: "0px"
          }}
        >
          <div style={{ margin: "8px 0px 0px 16px", alignSelf: "flex-start" }}>
            <Form.Item name="type">
              <Radio.Group>
                <Radio
                  value="one-way"
                  onClick={() =>
                    setInputValues((prevState) => ({
                      ...prevState,
                      type: "one-way"
                    }))
                  }
                >
                  One way
                </Radio>
                <Radio
                  value="round-trip"
                  onClick={() =>
                    setInputValues((prevState) => ({
                      ...prevState,
                      type: "round-trip"
                    }))
                  }
                >
                  Round trip
                </Radio>
                {/* <Radio value="multi-city">Multi city</Radio> */}
              </Radio.Group>
            </Form.Item>
          </div>
          <div
            style={{
              width: "auto",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
              border: "1px solid #E7E7E7",
              borderRadius: "8px"
            }}
          >
            <Card
              style={{ borderRadius: "0px", background: "#C4DBF6" }}
              bodyStyle={{ padding: 0, width: "250px", height: "100%" }}
              onClick={() => {
                setShowInput((prevState) => ({ ...prevState, from: true }))
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start"
                }}
              >
                <div style={{ padding: "8px" }}>
                  <label style={{ height: "50px" }}>From</label>
                  <Title style={{ padding: "0px", margin: "0px" }} ellipsis>
                    {inputValues.from.city}
                  </Title>
                  <Text>
                    {inputValues.from.code}, {inputValues.from.name}
                  </Text>
                </div>
                <Form.Item
                  name="from"
                  style={{
                    margin: "0px",
                    position: "absolute",
                    top: "30px",
                    width: "100%",
                    zIndex: !showInput.from ? -1 : 1
                  }}
                >
                  {showInput.from && (
                    <AutoComplete
                      autoFocus
                      allowClear
                      style={{ width: "100%", height: "calc(100% - 20px)" }}
                      defaultValue=""
                      placeholder="From field"
                      onSearch={_.debounce(fromLocationSearchHandler, 500)}
                      onSelect={fromLocationSearchHandler}
                      options={fromOptions}
                    >
                      <TextArea
                        onBlur={() => {
                          textAreaClearHandler({ from: false })
                        }}
                        autoSize={{ minRows: 5, maxRows: 8 }}
                      />
                    </AutoComplete>
                  )}
                </Form.Item>
              </div>
            </Card>
            <Card
              style={{ borderRadius: "0px", background: "#C4DBF6" }}
              bodyStyle={{ padding: 0, width: "250px", height: "100%" }}
              onClick={() => {
                setShowInput((prevState) => ({ ...prevState, to: true }))
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start"
                }}
              >
                <div style={{ padding: "8px" }}>
                  <label style={{ height: "50px" }}>To</label>
                  <Title style={{ padding: "0px", margin: "0px" }} ellipsis>
                    {inputValues.to.city}
                  </Title>
                  <Text>
                    {inputValues.to.code}, {inputValues.to.name}
                  </Text>
                </div>
                <Form.Item
                  name="to"
                  style={{
                    margin: "0px",
                    position: "absolute",
                    top: "30px",
                    width: "100%",
                    zIndex: !showInput.to ? -1 : 1
                  }}
                >
                  {showInput.to && (
                    <AutoComplete
                      autoFocus
                      allowClear
                      style={{ width: "100%", height: "calc(100% - 20px)" }}
                      defaultValue=""
                      placeholder="To field"
                      onSearch={_.debounce(toLocationSearchHandler, 500)}
                      onSelect={toLocationSearchHandler}
                      options={toOptions}
                    >
                      <TextArea
                        onBlur={() => {
                          textAreaClearHandler({ to: false })
                        }}
                        autoSize={{ minRows: 5, maxRows: 8 }}
                      />
                    </AutoComplete>
                  )}
                </Form.Item>
              </div>
            </Card>
            <Card
              style={{ borderRadius: "0px", background: "#C4DBF6" }}
              bodyStyle={{ padding: "8px", width: "150px", maxWidth: "150px" }}
              onClick={() => {
                setShowInput((prevState) => ({
                  ...prevState,
                  departure: true
                }))
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start"
                }}
              >
                <label>Departure</label>
                <Title style={{ padding: "0px", margin: "0px" }}>
                  {inputValues.departure.format("DD")}{" "}
                  {
                    <Text>{`${inputValues.departure.format(
                      "MMM"
                    )}'${inputValues.departure.format("YY")}`}</Text>
                  }
                </Title>
                <Text>{inputValues.departure.format("dddd")}</Text>
                <Form.Item
                  name="departure"
                  style={{
                    margin: "0px",
                    position: "absolute",
                    top: "30px",
                    left: "0px",
                    width: "100%",
                    zIndex: !showInput.departure ? -1 : 1
                  }}
                >
                  {showInput.departure && (
                    <DatePicker
                      autoFocus
                      open
                      placeholder=""
                      showTime={false}
                      format="DD-MMM-YY"
                      showToday={false}
                      defaultValue={dayjs()}
                      size="large"
                      style={{ height: "78px", width: "100%" }}
                      disabledDate={disabledDate}
                      onChange={(value) =>
                        setInputValues((prevState) => ({
                          ...prevState,
                          departure: value || dayjs()
                        }))
                      }
                      onBlur={() =>
                        setShowInput((prevState) => ({
                          ...prevState,
                          departure: false
                        }))
                      }
                    />
                  )}
                </Form.Item>
              </div>
            </Card>
            <Card
              style={{
                overflow: "hidden",
                borderRadius: "0px",
                background: "#C4DBF6"
              }}
              bodyStyle={{ padding: "8px", width: "150px", maxWidth: "150px" }}
              onClick={() => {
                form.setFieldValue("type", "round-trip")
                setInputValues((prevState) => ({
                  ...prevState,
                  type: "round-trip"
                }))
                setShowInput((prevState) => ({ ...prevState, return: true }))
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start"
                }}
              >
                <label>Return</label>
                {inputValues.type === "one-way" ? (
                  <Text type="secondary">
                    Tap to add a return date for bigger discounts
                  </Text>
                ) : (
                  <>
                    <Title style={{ padding: "0px", margin: "0px" }}>
                      {inputValues.return.format("DD")}{" "}
                      {
                        <Text>{`${inputValues.return.format(
                          "MMM"
                        )}'${inputValues.return.format("YY")}`}</Text>
                      }
                    </Title>
                    <Text>{inputValues.return.format("dddd")}</Text>
                  </>
                )}
                <Form.Item
                  name="return"
                  style={{
                    margin: "0px",
                    position: "absolute",
                    top: "30px",
                    left: "0px",
                    width: "100%",
                    zIndex: !showInput.return ? -1 : 1
                  }}
                >
                  {showInput.return && (
                    <DatePicker
                      autoFocus
                      open
                      placeholder=""
                      showTime={false}
                      showToday={false}
                      size="large"
                      style={{ height: "78px", width: "100%" }}
                      disabledDate={disabledDate}
                      onChange={(value) =>
                        setInputValues((prevState) => ({
                          ...prevState,
                          return: value || dayjs()
                        }))
                      }
                      onBlur={() =>
                        setShowInput((prevState) => ({
                          ...prevState,
                          return: false
                        }))
                      }
                    />
                  )}
                </Form.Item>
              </div>
            </Card>
            <Card
              style={{ borderRadius: "0px", background: "#C4DBF6" }}
              bodyStyle={{ padding: "8px", maxWidth: "150px" }}
              onClick={() => {
                setShowInput((prevState) => ({
                  ...prevState,
                  travellers: true
                }))
              }}
            >
              <Popover
                trigger="click"
                placement="bottomRight"
                arrow={false}
                zIndex={!showInput.travellers ? -1 : 1}
                content={
                  <Space direction="vertical">
                    <Form.Item label="Adult" name="adult">
                      <Segmented
                        options={[
                          ...segmentAdultValues,
                          { label: "9+", value: 10 }
                        ]}
                        onChange={(value) =>
                          setInputValues((prevState) => ({
                            ...prevState,
                            adult: Number(value)
                          }))
                        }
                      />
                    </Form.Item>
                    <Space>
                      <Form.Item label="Child" name="child">
                        <Segmented
                          options={[
                            ...segmentOtherValues,
                            { label: "6+", value: 7 }
                          ]}
                          onChange={(value) =>
                            setInputValues((prevState) => ({
                              ...prevState,
                              child: Number(value)
                            }))
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Infant" name="infant">
                        <Segmented
                          options={[
                            ...segmentOtherValues,
                            { label: "6+", value: 7 }
                          ]}
                          onChange={(value) =>
                            setInputValues((prevState) => ({
                              ...prevState,
                              infant: Number(value)
                            }))
                          }
                        />
                      </Form.Item>
                    </Space>
                    <Form.Item label="Choose Travel Class" name="class">
                      <Segmented
                        options={seatTypes}
                        onChange={(value) =>
                          setInputValues((prevState) => ({
                            ...prevState,
                            class: value.toString()
                          }))
                        }
                      />
                    </Form.Item>
                  </Space>
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start"
                  }}
                >
                  <label>Travellers & Class</label>
                  <Title style={{ padding: "0px", margin: "0px" }}>
                    {inputValues.adult +
                      inputValues.child +
                      inputValues.infant +
                      " "}
                    <Text>Traveller</Text>
                  </Title>
                  <Text>
                    {
                      seatTypes.find((type) => type.value === inputValues.class)
                        ?.label
                    }
                  </Text>
                </div>
              </Popover>
            </Card>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              position: "relative",
              top: "16px"
            }}
          >
            <Form.Item style={{ margin: "0px" }}>
              <Button htmlType="submit">SEARCH</Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default SearchFilter