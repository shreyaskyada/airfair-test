import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router';
import { uniq } from 'lodash';
import { Airlines_Images } from '../../data/popularAirlines';
import { airlineMapping } from '../../services/airports';
import { Modal, Tag } from 'antd';
import { airplaneIcon } from '../../assets/images';
import SendEmailCard from '../../components/Modals/SendEmailCard';
import { ISearchFlights } from '../../redux/slices/searchFlights';
import {
  updateDepartFlights,
  updateReturnFlights,
} from '../../redux/slices/flights';

const InternationDataCard = (props: any) => {
  const {
    flight,
    cheapestFare,
    cheapestProvider,
    compare,
    flightCode,
    inboundFlight,
    outboundFlight,
    seatingClass,
  } = props;
  const dispatch = useAppDispatch();
  const [details, setDetails] = useState(false);
  const [flightNames, setFlightNames] = useState<string[]>([]);
  const [flightImage, setFlightImage] = useState<any>(null);
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  );

  useEffect(() => {
    const _names = uniq(
      flightCode
        .split(':')[0]
        ?.split('->')
        .map((item: string) => item.substring(0, 2))
    );
    setFlightNames(_names as string[]);

    if (_names.length > 1) {
      setFlightImage(Airlines_Images[airlineMapping[_names[0] as string]]);
    } else {
      setFlightImage(Airlines_Images['Multiple Airlines']);
    }
  }, [flight]);

  const getStops = (s: number) => {
    return `(${s} stop${s > 1 ? 's' : ''})`;
  };

  const getLayoverDetails = (durationArr: string[], cities: any) => {
    if (durationArr?.length) {
      const time = durationArr[0]
        .substring(2)
        .split('H')
        .join('H ')
        .toLocaleLowerCase();
      return `${time} in ${cities[0]?.viaCity}`;
    }
    return '';
  };

  return (
    <div className='roundTripDetailCard'>
      <div className='cardContainer'>
        <div className='flightInfoSection'>
          <div className='flightNamesSection'>
            <div className='flightImageSection' style={{ marginRight: '10px' }}>
              <img
                src={flightImage ? flightImage : ''}
                style={{ width: '100%', height: '100%' }}
              />
              <div className='nameTime' style={{ marginBottom: '0.5rem' }}>
                <p className='flightName'>
                  {flightNames
                    .map((name) => airlineMapping[name || 'AI'])
                    .join(', ')}
                </p>
              </div>
            </div>
            <div className='flightDetailSection' style={{ marginLeft: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div
                    className='flightTimeDetail'
                    style={{ margin: '0.5rem 0' }}
                  >
                    <div
                      className='flightTime'
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                      }}
                    >
                      <h3>{outboundFlight.depTime}</h3>
                      <span>-</span>
                      <h3>{outboundFlight.arrTime}</h3>
                    </div>
                  </div>

                  <div
                    className='flightCity'
                    style={{
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '10px',
                    }}
                  >
                    <p>{`${outboundFlight.from}`}</p>
                    <span>-</span>
                    <p>{`${outboundFlight.to}`}</p>
                  </div>
                </div>
                <div>
                  <h3
                    className='flightTotalTime'
                    style={{ margin: '0.5rem 0' }}
                  >{`${outboundFlight.duration} ${
                    outboundFlight.stops > 0
                      ? getStops(outboundFlight.stops)
                      : '(non-stop)'
                  }`}</h3>
                  <p className='flightCity'>
                    {getLayoverDetails(
                      outboundFlight.layoverDurationList,
                      outboundFlight.transitFlight
                    )}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div
                    className='flightTimeDetail'
                    style={{ margin: '0.5rem 0' }}
                  >
                    <div
                      className='flightTime'
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                      }}
                    >
                      <h3>{inboundFlight.depTime}</h3>
                      <span>-</span>
                      <h3>{inboundFlight.arrTime}</h3>
                    </div>
                  </div>

                  <div
                    className='flightCity'
                    style={{
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '10px',
                    }}
                  >
                    <p>{`${inboundFlight.from}`}</p>
                    <span>-</span>
                    <p>{`${inboundFlight.to}`}</p>
                  </div>
                </div>
                <div>
                  <h3
                    className='flightTotalTime'
                    style={{ margin: '0.5rem 0' }}
                  >{`${inboundFlight.duration} ${
                    inboundFlight.stops > 0
                      ? getStops(inboundFlight.stops)
                      : '(non-stop)'
                  }`}</h3>
                  <p className='flightCity'>
                    {getLayoverDetails(
                      inboundFlight.layoverDurationList,
                      inboundFlight.transitFlight
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flightPrice'>
          <div className='flightPriceContent'>
            <div className='fareSection' style={{ marginBottom: '0.3rem' }}>
              <p className='regularTitle'>₹{cheapestFare.toString()}</p>
            </div>
            <p className='flightAgent'>{cheapestProvider.providerCode}</p>
            <div style={{ marginTop: '0.3rem' }}>
              {Object.keys(compare).length > 1 && (
                <div>
                  <p>
                    {!details
                      ? `+${Object.keys(compare).length - 1} more providers`
                      : ''}
                  </p>
                </div>
              )}
            </div>
            <button
              className='headerButtons filled'
              style={{ marginTop: '0.5rem', height: '34px' }}
              onClick={() => {
                dispatch(
                  updateDepartFlights({
                    ...outboundFlight,
                    compare,
                    cheapestProvider,
                    seatingClass,
                  })
                );

                dispatch(
                  updateReturnFlights({
                    ...inboundFlight,
                    seatingClass,
                    //   compare,
                    //   cheapestProvider,
                  })
                );
                if (searchFlightData.totalTravellers > 9) {
                  setShowModal(true);
                } else {
                  navigate(
                    '/flights/' +
                      `${outboundFlight.from}-${outboundFlight.to}` +
                      `-${outboundFlight.flightCode}-${outboundFlight.duration}-${outboundFlight.depTime}`
                  );
                }
                // },1100)
              }}
            >
              Select Deal
            </button>
          </div>
        </div>
      </div>
      <Modal
        open={showModal}
        centered
        footer={null}
        closable={false}
        zIndex={1003}
        onCancel={() => setShowModal(false)}
        width='350px'
      >
        <SendEmailCard
          key={new Date().toString()}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default InternationDataCard;
