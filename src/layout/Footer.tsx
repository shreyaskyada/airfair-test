import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Typography, Divider } from 'antd';
import {
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import moment from 'moment';
import dayjs from 'dayjs';
import { popularFlightsData } from '../data/popularFlights';
import { getFlightsConfig } from '../services/api/urlConstants';
import backendService from '../services/api';
import { uploadIsLoading } from '../redux/slices/app';
import {
  updateFlights,
  updateReturnFlights,
  updateDepartFlights,
} from '../redux/slices/flights';
import { updateOriginFlights } from '../redux/slices/originFlight';
import { updateDestinationFlights } from '../redux/slices/destinationFlight';
import { AIRPORT_DATA } from '../data/popularFlights';
import './layoutStyles.css';
import {
  updateFlightType,
  updateInitialValues,
} from '../redux/slices/searchFlights';
import { notification } from '../components/Notification/customNotification';
import { TripType } from '../data/contants';

const { Title, Text } = Typography;
const { Footer: FooterLayout } = Layout;

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userDetails } = useAppSelector((state) => state.app);

  const getflightDetail = (
    departureFlightCode: string,
    destination: string
  ) => {
    dispatch(uploadIsLoading(true));

    const destinationAirport = AIRPORT_DATA.find(
      (airport) => airport.code.toLowerCase() === destination.toLowerCase()
    );
    const departureAirport = AIRPORT_DATA.find(
      (airport) =>
        airport.code.toLowerCase().toLowerCase() ===
        departureFlightCode.toLowerCase()
    );

    const searchedData = {
      from: {
        code: departureAirport?.code,
        city: departureAirport?.city,
        name: departureAirport?.name,
      },
      to: {
        code: destinationAirport?.code,
        city: destinationAirport?.city,
        name: destinationAirport?.name,
      },
      type: 'one-way',
      departure: dayjs().add(1, 'days'),
      return: dayjs(),
      adult: 1,
      child: 0,
      infant: 0,
      class: 'ECONOMY',
    };

    const flightDetail: any = {
      from: departureFlightCode,
      to: destinationAirport?.code,
      doj: moment().add(1, 'days').format('DDMMYYYY'),
      seatingClass: 'ECONOMY',
      adults: 1,
      children: 0,
      infants: 0,
      roundtrip: false,
      bankList: userDetails.bankList,
      walletList: userDetails.walletList,
    };

    const flightList = getFlightsConfig(flightDetail);
    backendService
      .request(flightList)
      .then((res: any) => {
        dispatch(updateFlights(res));
        dispatch(updateOriginFlights(res.flightCompareResponse));
        dispatch(updateDestinationFlights(res.returnJourneyCompareResponse));
        dispatch(updateDepartFlights(res.flightCompareResponse[0]));
        dispatch(updateFlightType(TripType.ONE_WAY));
        dispatch(updateReturnFlights({}));
        dispatch(updateInitialValues(searchedData));
        dispatch(uploadIsLoading(false));
        navigate('/flights-listing');
      })
      .catch((error) => {
        dispatch(uploadIsLoading(false));
        console.error(error);
        notification.warning({ message: 'No flights Found, Please try again' });
      });
  };
  return (
    <div className='footerContainer'>
      <div className='footerSection'>
        <h2 className='footerHeading'>Top Flights</h2>
        <Divider style={{ background: 'white' }} />
        <Row gutter={[0, 6]}>
          {popularFlightsData.map((flights) =>
            flights.destinationFlights.map((flight, index) => (
              <Col
                key={index}
                xs={24}
                sm={12}
                md={8}
                xl={6}
                onClick={() =>
                  getflightDetail(
                    flights.departureFlightCode,
                    flight.fligthCode
                  )
                }
              >
                <Text className='flightLinks'>
                  {flights.departureFlightTitle.split(' ')[0]} To{' '}
                  {flight.flightTitle}
                </Text>
              </Col>
            ))
          )}
        </Row>
        <Divider style={{ background: 'white' }} />
        <Row gutter={[0, 6]}>
          <Col xs={24} sm={24} md={8} xl={6}>
            <div className='socialLinksSection'>
              <div className='socialLinkContainer'>
                <a
                  href='https://www.instagram.com/tripsaverz.in/'
                  className='linkUrl'
                  target='_blank'
                >
                  <InstagramOutlined style={{ fontSize: 25, color: 'white' }} />
                </a>
              </div>
              <div className='socialLinkContainer'>
                <a
                  href='https://www.linkedin.com/company/mytripsaver/'
                  className='linkUrl'
                  target='_blank'
                >
                  <LinkedinOutlined style={{ fontSize: 25, color: 'white' }} />
                </a>
              </div>
              {/* <div className='socialLinkContainer'>
                <a
                  href='https://twitter.com/mytripsaver?t=iR40aB6zc6DO-25z31dkdQ&s=09'
                  className='linkUrl'
                  target='_blank'
                >
                  <TwitterOutlined style={{ fontSize: 25, color: 'white' }} />
                </a>
              </div>
              <div className='socialLinkContainer'>
                <a
                  href='https://youtube.com/@mytripsaver'
                  className='linkUrl'
                  target='_blank'
                >
                  <YoutubeOutlined style={{ fontSize: 25, color: 'white' }} />
                </a>
              </div> */}
            </div>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={8}
            xl={{
              offset: 6,
              span: 6,
            }}
          >
            <div onClick={() => navigate('/privacy-policy')}>
              <Text className='flightLinks'>Privacy Policy</Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} xl={6}>
            <div onClick={() => navigate('/terms-and-conditions')}>
              <Text className='flightLinks'>Terms And Conditions</Text>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;
