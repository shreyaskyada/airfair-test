import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import _, { lowerCase } from 'lodash';
import moment from 'moment';

import {
  Form,
  Input,
  Radio,
  DatePicker,
  Typography,
  Space,
  Card,
  Segmented,
  Row,
  Col,
} from 'antd';

import { RangePickerProps } from 'antd/es/date-picker';
import { AutoComplete, Popover, Button } from 'antd';
import { getAirportsWrapper } from '../../services/airports';
import { getFlightsConfig } from '../../services/api/urlConstants';
import backendService from '../../services/api';
import {
  resetFlights,
  updateDepartFlights,
  updateFlights,
  updateInternationalFlights,
  updateReturnFlights,
} from '../../redux/slices/flights';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router';
import { UserDetailsType, uploadIsLoading } from '../../redux/slices/app';
import { resetOriginFlights, updateOriginFlights } from '../../redux/slices/originFlight';
import { resetDestinationFlights, updateDestinationFlights } from '../../redux/slices/destinationFlight';
import {
  ISearchFlights,
  updateAdults,
  updateChild,
  updateClass,
  updateDepartureDate,
  updateFlightType,
  updateFromSearchValues,
  updateInfant,
  updateReturnDate,
  updateSaarchFlights,
  updateToSearchValues,
} from '../../redux/slices/searchFlights';
import './searchFilterStyles.css';
import { notification } from '../Notification/customNotification';
import { TripType, popularFlightsArr } from '../../data/contants';
import { resetFilters } from '../../redux/slices/filters';
import {
  capitalizeFirstLetter,
  compareProvidersAndFilter,
} from '../../data/utils';
import { airplaneIcon } from '../../assets/images';
import CustomAutoComplete from '../shared/CustomAutoComplete';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text } = Typography;

const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];

const seatTypes = [
  { label: 'Economy', value: 'ECONOMY' },
  { label: 'Premium Economy', value: 'PREMIUM_ECONOMY' },
  { label: 'Business', value: 'BUSINESS' },
  { label: 'First Class', value: 'FIRST_CLASS' },
];

// const initialValues = {
//   from: {
//     code: "DEL",
//     city: "New Delhi",
//     name: "Indira Gandhi International Airport"
//   },
//   to: { code: "BOM", city: "Mumbai", name: "C S M International Airport" },
//   type: "one-way",
//   departure: dayjs(),
//   return: dayjs(),
//   adult: 1,
//   child: 0,
//   infant: 0,
//   class: "ECONOMY"
// }

function compareArrays(array1: any, array2: any) {
  if (array1.length !== array2.length) {
    return false;
  }

  const sortedArray1 = array1.slice().sort();
  const sortedArray2 = array2.slice().sort();

  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false;
    }
  }

  return true;
}

const getDropdownLabel = (airport: any) => (
  <div className='flex-center' style={{ paddingRight: '10px' }}>
    <img
      src={airplaneIcon}
      alt='plane'
      style={{ width: '20px', marginRight: '5px' }}
    />
    <div
      style={{
        flexGrow: 1,
        flexWrap: 'wrap',
        overflowWrap: 'break-word',
      }}
    >
      <p className='fieldLabel' style={{ whiteSpace: 'normal' }}>
        {airport.city}, {capitalizeFirstLetter(airport.country)}
      </p>
      <p
        className='fieldSubTitle'
        style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
      >
        {airport.airportName}
      </p>
    </div>
    <p
      className='fieldSubTitle'
      style={{
        fontWeight: 'bold',
        width: '25px',
        marginLeft: '5px',
      }}
    >
      {airport.airportCd}
    </p>
  </div>
);

const popularCityLabel = {
  label: (
    <p
      className='fieldSubTitle'
      style={{
        fontWeight: 'bold',
        marginLeft: '5px',
      }}
    >
      Popular Cities
    </p>
  ),
  value: '',
};

const SearchFilter = ({
  redirectRoute = '',
  origin,
}: {
  redirectRoute: string;
  origin?: string;
}) => {
  const navigate = useNavigate();
  const [isFlightsLoading, setIsFlightsLoading] = useState(false);

  const { userDetails } = useAppSelector((state) => state.app);
  const { initialValues: _initialValues } = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  );
  const [form] = Form.useForm();
  const [inputValues, setInputValues] = useState<any>(_initialValues);
  const [fromOptions, setFromOptions] = useState([
    popularCityLabel,
    ...popularFlightsArr.map((airport: any) => ({
      label: getDropdownLabel(airport),
      value: `${airport.airportCd}-${airport.city}-${airport.airportName}`,
    })),
  ]);
  const [toOptions, setToOptions] = useState([
    popularCityLabel,
    ...popularFlightsArr.map((airport: any) => ({
      label: getDropdownLabel(airport),
      value: `${airport.airportCd}-${airport.city}-${airport.airportName}`,
    })),
  ]);
  const [showInput, setShowInput] = useState({
    from: false,
    to: false,
    departure: false,
    return: false,
    travellers: false,
  });
  const [formValues, setFormValues] = useState({
    from: '',
    to: '',
  });
  const dispatch = useAppDispatch();
  const { flights } = useAppSelector((state) => state.flight);

  const [queryParams, setQueryParams]: any = useSearchParams();

  // console.log("queryParams", serializeFormQuery(queryParams) );

  const getAirportByCode = async (cityCode: string) => {
    try {
      const data: any = await getAirportsWrapper(cityCode);
      const airportList = data?.airportList || [];
      const filteredAirports = airportList.filter(
        (airport: any) => airport.airportCd === cityCode
      );

      return filteredAirports[0];
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!queryParams.get("from")) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        axios
          .get(
            `https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=bdc_123c9922d59e439b854a182e252d731e`
          )
          .then((res) => {
            getAirportsWrapper(res.data?.city)
              .then((data: any) => {
                const airportList = data?.airportList || [];

                console.log("listData ===>", data);

                const filteredAirport = airportList.filter(
                  (airport: any) =>
                    lowerCase(airport.city) === lowerCase(res.data?.city)
                );

                setInputValues((prevState: any) => ({
                  ...prevState,
                  from: {
                    code: filteredAirport[0].airportCd,
                    city: filteredAirport[0].city,
                    name: filteredAirport[0].airportName,
                  },
                }));
              })
              .catch((err) => console.error(err));
          });
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (queryParams.get("from")) {
        let initValues = {};
        const fromCityCode = queryParams.get("from");
        const toCityCode = queryParams.get("to");
        const depDate = queryParams.get("depDate");
        const retDate = queryParams.get("retDate");
        const type = queryParams.get("type");
        const adults = queryParams.get("adults");
        const child = queryParams.get("child");
        const infants = queryParams.get("infants");
        const travelClass = queryParams.get("class");

        try {
          if (fromCityCode) {
            const fromAirportData = await getAirportByCode(fromCityCode);
            initValues = {
              from: {
                code: fromAirportData.airportCd,
                city: fromAirportData.city,
                name: fromAirportData.airportName,
              },
            };
          }
          if (toCityCode) {
            const toAirportData = await getAirportByCode(toCityCode);
            initValues = {
              ...initValues,
              to: {
                code: toAirportData.airportCd,
                city: toAirportData.city,
                name: toAirportData.airportName,
              },
            };
          }

          initValues = {
            ...initValues,
            ...(depDate && { departure: dayjs.unix(Number.parseInt(depDate)) }),
            ...(retDate && { return: dayjs.unix(Number.parseInt(retDate)) }),
            ...(type && { type: type }),
            ...(adults && { adult: parseInt(adults) }),
            ...(child && { child: parseInt(child) }),
            ...(infants && { infant: parseInt(infants) }),
            ...(travelClass && { class: travelClass }),
          };
          type && form.setFieldValue("type", type);
          depDate &&
            form.setFieldValue(
              "departure",
              dayjs.unix(Number.parseInt(depDate))
            );
          adults && form.setFieldValue("adult", parseInt(adults));
          child && form.setFieldValue("child", parseInt(child));
          infants && form.setFieldValue("infant", parseInt(infants));
          travelClass && form.setFieldValue("class", travelClass);

          !Object.keys(flights).length &&
            onFinish({ ...inputValues, ...initValues });
          setInputValues({ ...inputValues, ...initValues });
        } catch (error) {
          console.error("Error fetching airport data:", error);
        }
      }
    };

    fetchData();
  }, []);

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    if (current && current < dayjs().subtract(1, 'day').endOf('day')) {
      return true;
    }
    return false;
  };

  const disableReturnDates: RangePickerProps['disabledDate'] = (current) => {
    if (
      (current && current < dayjs().subtract(1, 'day').endOf('day')) ||
      (inputValues &&
        current < inputValues.departure.subtract(1, 'day').endOf('day'))
    ) {
      return true;
    }
    return false;
  };

  const segmentAdultValues = Array(9)
    .fill(0)
    .map((_, i) => ({ label: i + 1, value: i + 1 }));
  const segmentOtherValues = Array(6)
    .fill(0)
    .map((_, i) => ({ label: i, value: i }));

  const onFinish = (newInputValues: any = undefined) => {
    dispatch(uploadIsLoading(true));
    setIsFlightsLoading(true);
    const values: any = newInputValues || inputValues;
    if (values) {
      const isRoundTrip = values.type === 'round-trip';
      let data: any = {};
      data.from = values.from.code;
      data.to = values.to.code;
      data.doj = moment(values.departure.toString()).format('DDMMYYYY');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isRoundTrip
        ? (data.doa = moment(values.return.toString()).format('DDMMYYYY'))
        : null;
      data.adults = values.adult;
      data.children = values.child;
      data.infants = values.infant;
      data.roundtrip = isRoundTrip ? true : false;
      data.seatingClass = values.class;
      data.bankList = userDetails.bankList;
      data.walletList = userDetails.walletList;

      const paramsString = `?from=${data.from}&to=${data.to}&depDate=${dayjs(
        values.departure
      ).unix()}&retDate=${dayjs(values.return).unix()}&type=${
        values.type
      }&adults=${data.adults}&child=${data.children}&infants=${
        data.infants
      }&class=${data.seatingClass}`;

      const searchFlightData: ISearchFlights = {
        totalTravellers: values.adult + values.child + values.infant,
        dateOfDep: values.departure.toString(),
        flightType: isRoundTrip ? TripType.ROUND_TRIP : TripType.ONE_WAY,
      };

      const config = getFlightsConfig(data);
      backendService
        .request(config)
        .then((res: any) => {
          console.log('RES', res);
          if (res.internationalReturnJourneyCompareResponse) {
            dispatch(
              updateInternationalFlights(
                res.internationalReturnJourneyCompareResponse
              )
            );

            dispatch(updateSaarchFlights(searchFlightData));

            dispatch(uploadIsLoading(false));

            dispatch(resetFilters());

            redirectRoute && navigate(`${redirectRoute}${paramsString}`);
          } else {
            dispatch(updateInternationalFlights(null));

            dispatch(updateFlights(res));
            dispatch(updateOriginFlights(res.flightCompareResponse));

            const departProviders = Object.keys(
              res.flightCompareResponse[0].compare || {}
            );
            const flightsToFilter = res.returnJourneyCompareResponse || [];

            let data = flightsToFilter.filter((value: any) => {
              let providers = Object.keys(value.compare);
              return compareProvidersAndFilter(departProviders, providers);
            });

            console.log('data', data);

            dispatch(updateDestinationFlights(data));

            dispatch(updateDepartFlights(res.flightCompareResponse[0]));

            isRoundTrip
              ? dispatch(updateReturnFlights(data[0]))
              : dispatch(updateReturnFlights({}));

            dispatch(updateSaarchFlights(searchFlightData));
            //dispatch(uploadIsLoading(false))

            dispatch(uploadIsLoading(false));

            dispatch(resetFilters());

            redirectRoute && navigate(`${redirectRoute}${paramsString}`);
          }
        })
        .catch((err) => {
          console.error(err);

          dispatch(resetFlights());
          dispatch(resetDestinationFlights());
          dispatch(resetOriginFlights());
          dispatch(uploadIsLoading(false));
          notification.warning({
            message: 'No flights Found, Please try again',
          });
        })
        .finally(() => {
          setIsFlightsLoading(false);
          dispatch(uploadIsLoading(false));
        });
    }
  };

  const fromLocationSearchHandler = (value: string) => {
    if (value) {
      const [airportCode, airportCity, airportName] = value.split("-");
      setQueryParams({
        ...Object.fromEntries([...(queryParams as any)]),
        from: airportCode,
      });
      dispatch(
        updateFromSearchValues({
          code: airportCode,
          city: airportCity,
          name: airportName,
        })
      );
      setInputValues((prevState: any) => ({
        ...prevState,
        from: { code: airportCode, city: airportCity, name: airportName },
      }));
      setFormValues((prevState) => ({
        ...prevState,
        from: value,
      }));
    } else {
      textAreaClearHandler({ from: false });
      setFromOptions([
        popularCityLabel,
        ...popularFlightsArr.map((airport: any) => ({
          label: getDropdownLabel(airport),
          value: `${airport.airportCd}-${airport.city}-${airport.airportName}`,
        })),
      ]);
    }
  };

  const toLocationSearchHandler = (value: string) => {
    if (value) {
      const [airportCode, airportCity, airportName] = value.split("-");
      setQueryParams({
        ...Object.fromEntries([...(queryParams as any)]),
        to: airportCode,
      });
      dispatch(
        updateToSearchValues({
          code: airportCode,
          city: airportCity,
          name: airportName,
        })
      );
      setInputValues((prevState: any) => ({
        ...prevState,
        to: { code: airportCode, city: airportCity, name: airportName },
      }));
      setFormValues((prevState) => ({
        ...prevState,
        to: value,
      }));
    } else {
      textAreaClearHandler({ to: false });
      setToOptions([
        popularCityLabel,
        ...popularFlightsArr.map((airport: any) => ({
          label: getDropdownLabel(airport),
          value: `${airport.airportCd}-${airport.city}-${airport.airportName}`,
        })),
      ]);
    }
  };

  const textAreaClearHandler = (updatedValues: any) => {
    setShowInput((prevState) => ({ ...prevState, ...updatedValues }));
  };

  useEffect(() => {
    if (showInput.from) {
      getAirportsWrapper(inputValues.from.code)
        .then((data: any) => {
          const listData = data.airportList?.length
            ? data.airportList
            : popularFlightsArr;
          const airports = listData?.map((airport: any) => ({
            label: getDropdownLabel(airport),
            value: `${airport.airportCd}-${airport.city}-${airport.airportName}`,
          }));
          if (!data.airportList?.length) {
            airports.unshift(popularCityLabel);
          }
          setFromOptions(airports);
        })
        .catch((err) => console.error(err));
    }
  }, [inputValues]);

  useEffect(() => {
    if (showInput.from) {
      let check = _.includes(
        _.map(fromOptions, (ele) => _.get(ele, 'value')),
        formValues.from
      );
      if (check) {
        textAreaClearHandler({ from: false });
      }
    }
  }, [inputValues]);

  useEffect(() => {
    if (showInput.to) {
      getAirportsWrapper(inputValues.to.code)
        .then((data: any) => {
          const listData = data.airportList?.length
            ? data.airportList
            : popularFlightsArr;
          const airports = listData?.map((airport: any) => ({
            label: getDropdownLabel(airport),
            value: `${airport.airportCd}-${airport.city}-${airport.airportName}`,
          }));
          if (!data.airportList?.length) {
            airports.unshift(popularCityLabel);
          }
          setToOptions(airports);
        })
        .catch((err) => console.error(err));
    }
  }, [inputValues]);

  useEffect(() => {
    if (showInput.to) {
      let check = _.includes(
        _.map(toOptions, (ele) => _.get(ele, 'value')),
        formValues.to
      );
      if (check) {
        textAreaClearHandler({ to: false });
      }
    }
  }, [inputValues]);

  useEffect(() => {
    if (showInput.departure) {
      textAreaClearHandler({ departure: false });
    }
  }, [inputValues]);

  useEffect(() => {
    if (showInput.return) {
      textAreaClearHandler({ return: false });
    }
  }, [inputValues && inputValues.return]);

  return (
    <div
      className={
        origin === 'home' ? 'searchSection' : 'searchSectionFlightPage'
      }
    >
      {origin === 'home' ? (
        <div className='moving-text-container'>
          <Title level={4} className='moving-text'>
            Signup Now and Update Profile to get best deals on your Credit /
            Debit Cards
          </Title>
        </div>
      ) : null}
      <div
        className={
          origin === 'home'
            ? 'searchBarContainer'
            : 'searchBarContainerFlightPage'
        }
      >
        <Form form={form} onFinish={() => onFinish()} initialValues={_initialValues}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ alignSelf: 'flex-start', margin: '1rem 0 0 0' }}>
              <Form.Item name='type'>
                <Radio.Group>
                  <Radio
                    value='one-way'
                    onClick={() => {
                      setInputValues((prevState: any) => ({
                        ...prevState,
                        type: 'one-way',
                      }));
                      dispatch(updateFlightType("one-way"));
                      setQueryParams({
                        ...Object.fromEntries([...(queryParams as any)]),
                        type: "one-way",
                      });
                    }}
                    style={{ color: '#013042' }}
                  >
                    One way
                  </Radio>
                  <Radio
                    value='round-trip'
                    onClick={() => {
                      setInputValues((prevState: any) => ({
                        ...prevState,
                        type: "round-trip",
                        ...(!queryParams.get("retDate") && {
                          return: inputValues.departure?.add(1, "day"),
                        }),
                      }));
                      dispatch(updateFlightType("round-trip"));
                      if (!queryParams.get("retDate")) {
                        dispatch(
                          updateReturnDate(
                            inputValues && inputValues.departure?.add(1, "day")
                          )
                        );
                      }
                      setQueryParams({
                        ...Object.fromEntries([...(queryParams as any)]),
                        type: "round-trip",
                      });
                    }}
                    style={{ color: '#013042' }}
                  >
                    Round trip
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className='departCityForm'>
              <Card
                style={{ borderRadius: '0px', background: 'transparent' }}
                bodyStyle={{ padding: 0 }}
                onClick={() => {
                  setShowInput((prevState) => ({ ...prevState, from: true }));
                }}
                className='departCity'
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <div className='field'>
                    <label className='fieldLabel'>From</label>
                    <h1 className='fieldTitle'>{inputValues.from.city}</h1>
                    <p className='fieldSubTitle'>
                      {inputValues.from.code && inputValues.from.name ? (
                        <>
                          {inputValues.from.code}{" "}
                          {inputValues.from.code !== "" ? "," : null}{" "}
                          {inputValues.from.name}
                        </>
                      ) : (
                        <Text type="secondary">Enter city or airport</Text>
                      )}
                    </p>
                  </div>
                  <Form.Item
                    name='from'
                    style={{
                      margin: '0px',
                      position: 'absolute',
                      top: '30px',
                      width: '100%',
                      zIndex: !showInput.from ? -1 : 1,
                    }}
                  >
                    {showInput.from && (
                      <CustomAutoComplete
                        onSearch={_.debounce(fromLocationSearchHandler, 500)}
                        onSelect={fromLocationSearchHandler}
                        options={fromOptions}
                        onBlur={() => {
                          textAreaClearHandler({ from: false });
                        }}
                        onOpen={() => {
                          setFromOptions([
                            popularCityLabel,
                            ...popularFlightsArr.map((airport: any) => ({
                              label: getDropdownLabel(airport),
                              value: `${airport.airportCd}-${airport.city}-${airport.airportName}`,
                            })),
                          ]);
                        }}
                      />
                    )}
                  </Form.Item>
                </div>
              </Card>
              <Card
                className='returnCity'
                style={{ borderRadius: '0px' }}
                bodyStyle={{ padding: 0 }}
                onClick={() => {
                  setShowInput((prevState) => ({ ...prevState, to: true }));
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <div className='field'>
                    <label className='fieldLabel'>To</label>
                    <h1 className='fieldTitle'>{inputValues.to.city}</h1>
                    <p className='fieldSubTitle'>
                      {inputValues.to.code && inputValues.to.name ? (
                        <>
                          {inputValues.to.code}{" "}
                          {inputValues.to.code !== "" ? "," : null}{" "}
                          {inputValues.to.name}
                        </>
                      ) : (
                        <Text type="secondary">Enter city or airport</Text>
                      )}
                    </p>
                  </div>
                  <Form.Item
                    name='to'
                    style={{
                      margin: '0px',
                      position: 'absolute',
                      top: '30px',
                      width: '100%',
                      zIndex: !showInput.to ? -1 : 1,
                    }}
                  >
                    {showInput.to && (
                      <CustomAutoComplete
                        onSearch={_.debounce(toLocationSearchHandler, 500)}
                        onSelect={toLocationSearchHandler}
                        options={toOptions}
                        onBlur={() => {
                          textAreaClearHandler({ to: false });
                        }}
                        onOpen={() => {
                          setToOptions([
                            popularCityLabel,
                            ...popularFlightsArr.map((airport: any) => ({
                              label: getDropdownLabel(airport),
                              value: `${airport.airportCd}-${airport.city}-${airport.airportName}`,
                            })),
                          ]);
                        }}
                      />
                    )}
                  </Form.Item>
                </div>
              </Card>
              <Card
                className='departDate'
                style={{ borderRadius: '0px' }}
                bodyStyle={{ padding: '8px' }}
                onClick={() => {
                  setShowInput((prevState) => ({
                    ...prevState,
                    departure: true,
                  }));
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <label className='fieldLabel'>Departure</label>
                  <h1 className='fieldTitle'>
                    {inputValues &&
                      inputValues?.departure &&
                      inputValues.departure.format('DD')}{' '}
                    {
                      <Text style={{ color: '#4E6F7B' }}>{`${
                        inputValues &&
                        inputValues?.departure &&
                        inputValues.departure.format('MMM')
                      }'${
                        inputValues &&
                        inputValues?.departure &&
                        inputValues.departure.format('YY')
                      }`}</Text>
                    }
                  </h1>
                  <p className='fieldSubTitle'>
                    {inputValues &&
                      inputValues?.departure &&
                      inputValues.departure.format('dddd')}
                  </p>
                  <Form.Item
                    name='departure'
                    style={{
                      margin: '0px',
                      position: 'absolute',
                      top: '30px',
                      left: '0px',
                      width: '100%',
                      zIndex: !showInput.departure ? -1 : 1,
                      backgroundColor: '#fff',
                    }}
                  >
                    {showInput.departure && (
                      <DatePicker
                        autoFocus
                        open
                        placeholder=''
                        showTime={false}
                        format='DD-MMM-YY'
                        showToday={false}
                        defaultValue={dayjs()}
                        size='large'
                        style={{ height: '78px', width: '100%' }}
                        disabledDate={disabledDate}
                        onChange={(value) => {
                          setInputValues((prevState: any) => ({
                            ...prevState,
                            departure: value || dayjs(),
                          }));
                          setQueryParams({
                            ...Object.fromEntries([...(queryParams as any)]),
                            depDate: dayjs(value).unix(),
                          });
                          dispatch(updateDepartureDate(value || dayjs()));
                          const diff = value?.diff(inputValues.return);
                          if (value && diff && diff > 0) {
                            const retDt = (
                              value ||
                              (inputValues && inputValues.departure)
                            ).add(1, 'day');
                            dispatch(updateReturnDate(retDt));
                            setInputValues((prevState: any) => ({
                              ...prevState,
                              return: retDt,
                            }));
                          }

                          if (
                            inputValues &&
                            inputValues.type === 'round-trip'
                          ) {
                            const retDt = value?.add(1, 'day');
                            dispatch(updateReturnDate(retDt));
                            setInputValues((prevState: any) => ({
                              ...prevState,
                              return: retDt,
                            }));
                          }
                        }}
                        onBlur={() =>
                          setShowInput((prevState) => ({
                            ...prevState,
                            departure: false,
                          }))
                        }
                      />
                    )}
                  </Form.Item>
                </div>
              </Card>
              <Card
                className='returnDate'
                style={{
                  overflow: 'hidden',
                  borderRadius: '0px',
                }}
                bodyStyle={{ padding: '8px' }}
                onClick={() => {
                  form.setFieldValue('type', 'round-trip');
                  const diff = inputValues.departure?.diff(inputValues.return);
                  console.log('DIFFere', diff);
                  let returnDate = inputValues.return;
                  if (inputValues.departure && diff && diff > 0) {
                    returnDate = inputValues.departure?.add(1, 'day');
                    dispatch(updateReturnDate(returnDate));
                  }
                  setInputValues((prevState: any) => ({
                    ...prevState,
                    type: 'round-trip',
                    return: returnDate,
                  }));
                  setQueryParams({
                    ...Object.fromEntries([...(queryParams as any)]),
                    type: "round-trip",
                  });
                  setShowInput((prevState) => ({ ...prevState, return: true }));
                  dispatch(updateFlightType('round-trip'));
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <label className='fieldLabel'>Return</label>
                  {inputValues.type === 'one-way' ? (
                    <Text type='secondary'>
                      Tap to add a return date for bigger discounts
                    </Text>
                  ) : (
                    <>
                      <h1 className='fieldTitle'>
                        {inputValues &&
                          inputValues?.return &&
                          inputValues.return.format('DD')}{' '}
                        {
                          <Text style={{ color: '#4E6F7B' }}>{`${
                            inputValues &&
                            inputValues?.return &&
                            inputValues.return.format('MMM')
                          }'${
                            inputValues &&
                            inputValues?.return &&
                            inputValues.return.format('YY')
                          }`}</Text>
                        }
                      </h1>
                      <p className='fieldSubTitle'>
                        {inputValues &&
                          inputValues?.return &&
                          inputValues.return.format('dddd')}
                      </p>
                    </>
                  )}
                  <Form.Item
                    name='return'
                    style={{
                      margin: '0px',
                      position: 'absolute',
                      top: '30px',
                      left: '0px',
                      width: '100%',
                      zIndex: !showInput.return ? -1 : 1,
                      backgroundColor: '#fff',
                    }}
                  >
                    {showInput.return && (
                      <>
                        <DatePicker
                          autoFocus
                          open
                          placeholder=''
                          key={inputValues.departure?.toString()}
                          format='DD-MMM-YY'
                          showTime={false}
                          showToday={false}
                          size='large'
                          // defaultValue={inputValues && inputValues.return}
                          style={{ height: '78px', width: '100%' }}
                          value={inputValues && inputValues.return}
                          disabledDate={disableReturnDates}
                          inputRender={(props) => {
                            const inputDate = dayjs(
                              props.value as string,
                              'DD-MMM-YY'
                            );
                            console.log('props.value', props.value);
                            console.log('inputDate', inputDate?.toString());
                            console.log(
                              'inputValues.return',
                              inputValues.return?.toString()
                            );

                            let returnDate = (props.value as string)?.trim()
                              ? inputDate
                              : inputValues.return
                              ? inputValues.return
                              : inputValues.departure;
                            const diff =
                              inputValues.departure?.diff(returnDate);
                            console.log('diff', diff);
                            if (inputValues.departure && diff && diff > 0) {
                              returnDate = inputValues.departure;
                            }
                            console.log('returnDate:', returnDate?.toString());

                            return (
                              <input
                                {...props}
                                value={returnDate?.format('DD-MMM-YY')}
                                title={returnDate?.format('DD-MMM-YY')}
                              />
                            );
                          }}
                          onChange={(value) => {
                            setInputValues((prevState: any) => ({
                              ...prevState,
                              return: value,
                            }));
                            setQueryParams({
                              ...Object.fromEntries([...(queryParams as any)]),
                              retDate: dayjs(value).unix(),
                            });
                            dispatch(
                              updateReturnDate(
                                value ||
                                  (inputValues &&
                                    inputValues.departure?.add(1, 'day'))
                              )
                            );
                          }}
                          onBlur={() =>
                            setShowInput((prevState: any) => ({
                              ...prevState,
                              return: false,
                            }))
                          }
                        />
                      </>
                    )}
                  </Form.Item>
                </div>
              </Card>
              <Card
                className='traveller'
                style={{ borderRadius: '0px' }}
                bodyStyle={{ padding: '8px' }}
                onClick={() => {
                  setShowInput((prevState: any) => ({
                    ...prevState,
                    travellers: true,
                  }));
                }}
              >
                <Popover
                  trigger='click'
                  placement='bottomRight'
                  arrow={false}
                  zIndex={11000}
                  content={
                    <Space direction='vertical'>
                      <Form.Item label='Adult' name='adult'>
                        <Segmented
                          options={[
                            ...segmentAdultValues,
                            { label: '9+', value: 10 },
                          ]}
                          onChange={(value) => {
                            setInputValues((prevState: any) => ({
                              ...prevState,
                              adult: Number(value),
                            }));
                            setQueryParams({
                              ...Object.fromEntries([...(queryParams as any)]),
                              adults: value,
                            });
                            dispatch(updateAdults(Number(value)));
                          }}
                        />
                      </Form.Item>
                      <Space>
                        <Form.Item label='Child' name='child'>
                          <Segmented
                            options={[
                              ...segmentOtherValues,
                              { label: '6+', value: 7 },
                            ]}
                            onChange={(value) => {
                              setInputValues((prevState: any) => ({
                                ...prevState,
                                child: Number(value),
                              }));
                              setQueryParams({
                                ...Object.fromEntries([
                                  ...(queryParams as any),
                                ]),
                                child: value,
                              });
                              dispatch(updateChild(Number(value)));
                            }}
                          />
                        </Form.Item>
                        <Form.Item label='Infant' name='infant'>
                          <Segmented
                            options={[
                              ...segmentOtherValues,
                              { label: '6+', value: 7 },
                            ]}
                            onChange={(value) => {
                              setInputValues((prevState: any) => ({
                                ...prevState,
                                infant: Number(value),
                              }));
                              setQueryParams({
                                ...Object.fromEntries([
                                  ...(queryParams as any),
                                ]),
                                infants: value,
                              });
                              dispatch(updateInfant(Number(value)));
                            }}
                          />
                        </Form.Item>
                      </Space>
                      <Form.Item label='Choose Travel Class' name='class'>
                        <Segmented
                          options={seatTypes}
                          onChange={(value) => {
                            setInputValues((prevState: any) => ({
                              ...prevState,
                              class: value.toString(),
                            }));
                            setQueryParams({
                              ...Object.fromEntries([...(queryParams as any)]),
                              class: value,
                            });
                            dispatch(updateClass(value.toString()));
                          }}
                        />
                      </Form.Item>
                    </Space>
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <label className='fieldLabel'>Travellers & Class</label>
                    <h1 className='fieldTitle'>
                      {inputValues.adult +
                        inputValues.child +
                        inputValues.infant +
                        ' '}
                      <Text style={{ color: '#013042' }}>Traveller</Text>
                    </h1>
                    <p className='fieldSubTitle'>
                      {
                        seatTypes.find(
                          (type) => type.value === inputValues.class
                        )?.label
                      }
                    </p>
                  </div>
                </Popover>
              </Card>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                position: 'relative',
                top: '16px',
              }}
            >
              <Form.Item style={{ margin: "0px" }}>
                <button
                  type="submit"
                  className="searchButton"
                  disabled={isFlightsLoading}
                >
                  SEARCH
                </button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SearchFilter;
